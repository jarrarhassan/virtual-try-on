// Skin analysis utilities
// Analyzes skin tone, type, and concerns from face image

import { getSkinRegionIndices, normalizePoint, calculateFaceMetrics, FACE } from './landmarks';
import { fitzpatrickScale, skinTypes, skinConcerns, getRecommendedProducts } from '../data/products';
import {
  createSkinMask,
  getRegionMasks,
  getSkinSamples,
  calculateSampleStats,
  analyzeRegionTexture,
  detectRegionShine,
} from './faceParsing';

// ============================================
// COLOR SPACE CONVERSION HELPERS
// ============================================

// Convert RGB to LAB color space for accurate skin tone analysis
function rgbToLab(r, g, b) {
  // First convert RGB to XYZ
  let rNorm = r / 255;
  let gNorm = g / 255;
  let bNorm = b / 255;

  // Apply gamma correction
  rNorm = rNorm > 0.04045 ? Math.pow((rNorm + 0.055) / 1.055, 2.4) : rNorm / 12.92;
  gNorm = gNorm > 0.04045 ? Math.pow((gNorm + 0.055) / 1.055, 2.4) : gNorm / 12.92;
  bNorm = bNorm > 0.04045 ? Math.pow((bNorm + 0.055) / 1.055, 2.4) : bNorm / 12.92;

  rNorm *= 100;
  gNorm *= 100;
  bNorm *= 100;

  // RGB to XYZ (using D65 illuminant)
  const x = rNorm * 0.4124564 + gNorm * 0.3575761 + bNorm * 0.1804375;
  const y = rNorm * 0.2126729 + gNorm * 0.7151522 + bNorm * 0.0721750;
  const z = rNorm * 0.0193339 + gNorm * 0.1191920 + bNorm * 0.9503041;

  // XYZ to LAB (D65 reference white)
  const refX = 95.047;
  const refY = 100.0;
  const refZ = 108.883;

  let xNorm = x / refX;
  let yNorm = y / refY;
  let zNorm = z / refZ;

  const epsilon = 0.008856;
  const kappa = 903.3;

  xNorm = xNorm > epsilon ? Math.pow(xNorm, 1/3) : (kappa * xNorm + 16) / 116;
  yNorm = yNorm > epsilon ? Math.pow(yNorm, 1/3) : (kappa * yNorm + 16) / 116;
  zNorm = zNorm > epsilon ? Math.pow(zNorm, 1/3) : (kappa * zNorm + 16) / 116;

  const L = 116 * yNorm - 16;
  const a = 500 * (xNorm - yNorm);
  const bVal = 200 * (yNorm - zNorm);

  return { L, a, b: bVal };
}

// Calculate ITA (Individual Typology Angle) for skin tone classification
function calculateITA(lab) {
  // ITA = arctan((L* - 50) / b*) × 180/π
  const ita = Math.atan2(lab.L - 50, lab.b) * (180 / Math.PI);
  return ita;
}

// Convert RGB to HSL for saturation analysis
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

// ============================================
// LIGHTING QUALITY ASSESSMENT
// ============================================

// Assess lighting quality to determine confidence in analysis
function assessLightingQuality(imageData, width, height) {
  const data = imageData.data;
  const sampleSize = Math.min(10000, (width * height));
  const step = Math.floor((width * height) / sampleSize);

  let luminanceValues = [];
  let totalPixels = 0;

  for (let i = 0; i < data.length; i += step * 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // Calculate relative luminance
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    luminanceValues.push(luminance);
    totalPixels++;
  }

  // Calculate mean and standard deviation
  const mean = luminanceValues.reduce((a, b) => a + b, 0) / luminanceValues.length;
  const variance = luminanceValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / luminanceValues.length;
  const stdDev = Math.sqrt(variance);

  // Calculate histogram distribution
  const histogram = new Array(256).fill(0);
  luminanceValues.forEach(val => {
    histogram[Math.min(255, Math.max(0, Math.round(val)))]++;
  });

  // Check for overexposure (too many bright pixels)
  const brightPixels = luminanceValues.filter(v => v > 240).length / luminanceValues.length;
  const darkPixels = luminanceValues.filter(v => v < 15).length / luminanceValues.length;

  // Calculate quality score (0-100)
  let qualityScore = 100;

  // Penalize for overexposure
  if (brightPixels > 0.1) qualityScore -= brightPixels * 100;
  // Penalize for underexposure
  if (darkPixels > 0.1) qualityScore -= darkPixels * 100;
  // Penalize for very low contrast
  if (stdDev < 30) qualityScore -= (30 - stdDev);
  // Penalize for very high contrast (harsh lighting)
  if (stdDev > 80) qualityScore -= (stdDev - 80) * 0.5;
  // Penalize for extreme mean (too dark or too bright overall)
  if (mean < 50 || mean > 200) qualityScore -= 20;

  qualityScore = Math.max(0, Math.min(100, qualityScore));

  return {
    score: Math.round(qualityScore),
    mean: Math.round(mean),
    stdDev: Math.round(stdDev),
    isOverexposed: brightPixels > 0.15,
    isUnderexposed: darkPixels > 0.15,
    isLowContrast: stdDev < 30,
    guidance: getlightingGuidance(qualityScore, brightPixels, darkPixels, stdDev)
  };
}

function getlightingGuidance(score, brightPixels, darkPixels, stdDev) {
  if (score >= 70) return null;
  if (brightPixels > 0.15) return 'Move away from direct light to reduce glare';
  if (darkPixels > 0.15) return 'Move to a brighter area for better results';
  if (stdDev < 30) return 'Try to find more even lighting';
  return 'Adjust lighting for better analysis accuracy';
}

// ============================================
// TEXTURE ANALYSIS HELPERS
// ============================================

// Calculate local texture variance in a region
function analyzeTextureVariance(imageData, x, y, width, height, regionSize = 5) {
  const data = imageData.data;
  const halfSize = Math.floor(regionSize / 2);
  let values = [];

  for (let dy = -halfSize; dy <= halfSize; dy++) {
    for (let dx = -halfSize; dx <= halfSize; dx++) {
      const px = Math.max(0, Math.min(width - 1, x + dx));
      const py = Math.max(0, Math.min(height - 1, y + dy));
      const idx = (py * width + px) * 4;
      const luminance = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
      values.push(luminance);
    }
  }

  if (values.length === 0) return 0;

  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;

  return Math.sqrt(variance);
}

// Detect shine/specular highlights in a region (indicates oiliness)
function detectShine(imageData, landmarks, width, height, zone) {
  const data = imageData.data;
  let shineCount = 0;
  let totalSamples = 0;
  let brightnessValues = [];

  // Get zone-specific landmark indices
  const zoneIndices = getZoneIndices(zone);

  zoneIndices.forEach(index => {
    if (!landmarks[index]) return;
    const point = normalizePoint(landmarks[index], width, height);
    const x = Math.floor(point.x);
    const y = Math.floor(point.y);

    // Sample a small area around each point
    for (let dy = -3; dy <= 3; dy++) {
      for (let dx = -3; dx <= 3; dx++) {
        const px = Math.max(0, Math.min(width - 1, x + dx));
        const py = Math.max(0, Math.min(height - 1, y + dy));
        const idx = (py * width + px) * 4;

        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

        brightnessValues.push(luminance);
        totalSamples++;

        // High brightness with low color variance indicates specular highlight
        const colorVariance = Math.abs(r - g) + Math.abs(g - b) + Math.abs(r - b);
        if (luminance > 200 && colorVariance < 30) {
          shineCount++;
        }
      }
    }
  });

  if (totalSamples === 0) return { shineRatio: 0, avgBrightness: 128 };

  const avgBrightness = brightnessValues.reduce((a, b) => a + b, 0) / brightnessValues.length;
  const shineRatio = shineCount / totalSamples;

  return {
    shineRatio,
    avgBrightness,
    hasShine: shineRatio > 0.05
  };
}

// Get landmark indices for different face zones
function getZoneIndices(zone) {
  switch (zone) {
    case 'tzone':
      // Forehead and nose
      return [10, 151, 9, 8, 168, 6, 197, 195, 5, 4, 1];
    case 'forehead':
      return [10, 151, 9, 8, 168, 108, 69];
    case 'nose':
      return [6, 197, 195, 5, 4, 1, 2, 98, 327];
    case 'leftCheek':
      return [117, 118, 119, 120, 121, 128, 245, 193];
    case 'rightCheek':
      return [346, 347, 348, 349, 350, 357, 465, 417];
    case 'cheeks':
      return [117, 118, 119, 346, 347, 348, 50, 280];
    case 'chin':
      return [152, 175, 199, 200, 421, 418];
    default:
      return getSkinRegionIndices();
  }
}

// ============================================
// SKIN COLOR SAMPLING
// ============================================

// Sample skin color from image at landmark points
export function sampleSkinColor(imageData, landmarks, width, height) {
  if (!landmarks || !imageData) return null;

  const skinIndices = getSkinRegionIndices();
  const samples = [];

  skinIndices.forEach(index => {
    const point = normalizePoint(landmarks[index], width, height);
    const x = Math.floor(point.x);
    const y = Math.floor(point.y);

    if (x >= 0 && x < width && y >= 0 && y < height) {
      const pixelIndex = (y * width + x) * 4;
      samples.push({
        r: imageData.data[pixelIndex],
        g: imageData.data[pixelIndex + 1],
        b: imageData.data[pixelIndex + 2],
      });
    }
  });

  if (samples.length === 0) return null;

  // Calculate average color
  const avgColor = {
    r: Math.round(samples.reduce((sum, s) => sum + s.r, 0) / samples.length),
    g: Math.round(samples.reduce((sum, s) => sum + s.g, 0) / samples.length),
    b: Math.round(samples.reduce((sum, s) => sum + s.b, 0) / samples.length),
  };

  return avgColor;
}

// Extended skin sampling with multiple regions for better analysis
function sampleSkinRegions(imageData, landmarks, width, height) {
  const data = imageData.data;
  const regions = {
    forehead: [],
    leftCheek: [],
    rightCheek: [],
    nose: [],
    chin: [],
    tzone: [],
  };

  // Sample each region
  Object.keys(regions).forEach(zone => {
    const indices = getZoneIndices(zone);
    indices.forEach(index => {
      if (!landmarks[index]) return;
      const point = normalizePoint(landmarks[index], width, height);
      const x = Math.floor(point.x);
      const y = Math.floor(point.y);

      if (x >= 0 && x < width && y >= 0 && y < height) {
        const pixelIndex = (y * width + x) * 4;
        regions[zone].push({
          r: data[pixelIndex],
          g: data[pixelIndex + 1],
          b: data[pixelIndex + 2],
          x, y
        });
      }
    });
  });

  // Calculate average for each region
  const regionAverages = {};
  Object.keys(regions).forEach(zone => {
    if (regions[zone].length > 0) {
      regionAverages[zone] = {
        r: Math.round(regions[zone].reduce((sum, s) => sum + s.r, 0) / regions[zone].length),
        g: Math.round(regions[zone].reduce((sum, s) => sum + s.g, 0) / regions[zone].length),
        b: Math.round(regions[zone].reduce((sum, s) => sum + s.b, 0) / regions[zone].length),
        samples: regions[zone]
      };
    }
  });

  return regionAverages;
}

// ============================================
// FITZPATRICK SKIN TYPE DETECTION (IMPROVED)
// ============================================

// Determine Fitzpatrick skin type using ITA angle
export function determineFitzpatrickType(rgb) {
  if (!rgb) return { level: 3, confidence: 0 };

  const { r, g, b } = rgb;

  // Convert to LAB color space
  const lab = rgbToLab(r, g, b);

  // Calculate ITA angle
  const ita = calculateITA(lab);

  // Map ITA to Fitzpatrick scale
  // ITA ranges based on research:
  // Type I:   ITA > 55° (very light)
  // Type II:  41° < ITA <= 55° (light)
  // Type III: 28° < ITA <= 41° (intermediate)
  // Type IV:  10° < ITA <= 28° (tan)
  // Type V:   -30° < ITA <= 10° (brown)
  // Type VI:  ITA <= -30° (dark)

  let level;
  let confidence = 85; // Base confidence

  if (ita > 55) {
    level = 1;
    confidence = Math.min(95, 85 + (ita - 55) * 0.5);
  } else if (ita > 41) {
    level = 2;
    // Lower confidence near boundaries
    if (ita > 50 || ita < 44) confidence = 75;
  } else if (ita > 28) {
    level = 3;
    if (ita > 38 || ita < 31) confidence = 75;
  } else if (ita > 10) {
    level = 4;
    if (ita > 25 || ita < 13) confidence = 75;
  } else if (ita > -30) {
    level = 5;
    if (ita > 5 || ita < -25) confidence = 75;
  } else {
    level = 6;
    confidence = Math.min(95, 85 + Math.abs(ita + 30) * 0.5);
  }

  return {
    level,
    ita: Math.round(ita * 10) / 10,
    lab,
    confidence: Math.round(confidence)
  };
}

// ============================================
// UNDERTONE ANALYSIS
// ============================================

// Analyze skin undertone (warm/cool/neutral)
export function analyzeUndertone(rgb) {
  if (!rgb) return { type: 'neutral', confidence: 50 };

  const { r, g, b } = rgb;
  const lab = rgbToLab(r, g, b);

  // Use LAB color space for more accurate undertone detection
  // Positive 'a' = red/pink (cool undertones)
  // Positive 'b' = yellow (warm undertones)

  const warmScore = lab.b; // Yellow component
  const coolScore = lab.a; // Red/pink component

  let type;
  let confidence;

  // Determine undertone based on a/b relationship
  if (lab.b > 15 && lab.b > lab.a) {
    type = 'warm';
    confidence = Math.min(90, 60 + lab.b);
  } else if (lab.a > 10 && lab.a > lab.b * 0.8) {
    type = 'cool';
    confidence = Math.min(90, 60 + lab.a);
  } else {
    type = 'neutral';
    // Confidence is higher when a and b are both relatively low
    confidence = 70 - Math.abs(lab.a - lab.b);
  }

  return {
    type,
    confidence: Math.max(40, Math.min(95, Math.round(confidence))),
    warmScore: Math.round(warmScore),
    coolScore: Math.round(coolScore)
  };
}

// ============================================
// SKIN TYPE DETECTION (TEXTURE-BASED)
// ============================================

// Detect skin type based on texture and shine analysis
export function detectSkinType(imageData, landmarks, width, height) {
  if (!imageData || !landmarks) {
    return { type: 'Normal', confidence: 50 };
  }

  // Analyze T-zone shine (forehead, nose)
  const tzoneShine = detectShine(imageData, landmarks, width, height, 'tzone');
  const foreheadShine = detectShine(imageData, landmarks, width, height, 'forehead');
  const noseShine = detectShine(imageData, landmarks, width, height, 'nose');

  // Analyze cheek areas
  const leftCheekShine = detectShine(imageData, landmarks, width, height, 'leftCheek');
  const rightCheekShine = detectShine(imageData, landmarks, width, height, 'rightCheek');
  const cheekShineAvg = (leftCheekShine.shineRatio + rightCheekShine.shineRatio) / 2;

  // Analyze texture variance (roughness indicator for dryness)
  let textureVariances = [];
  const skinIndices = getSkinRegionIndices();

  skinIndices.forEach(index => {
    if (!landmarks[index]) return;
    const point = normalizePoint(landmarks[index], width, height);
    const variance = analyzeTextureVariance(
      imageData,
      Math.floor(point.x),
      Math.floor(point.y),
      width,
      height,
      7
    );
    textureVariances.push(variance);
  });

  const avgTextureVariance = textureVariances.length > 0
    ? textureVariances.reduce((a, b) => a + b, 0) / textureVariances.length
    : 0;

  // Determine skin type based on analysis
  const tzoneOily = tzoneShine.shineRatio > 0.08 || tzoneShine.avgBrightness > 180;
  const cheeksOily = cheekShineAvg > 0.06;
  const hasDryTexture = avgTextureVariance > 25;

  let type;
  let confidence = 70;
  const indicators = [];

  if (tzoneOily && cheeksOily) {
    type = 'Oily';
    confidence = Math.min(90, 70 + tzoneShine.shineRatio * 100);
    indicators.push('High shine in T-zone and cheeks');
  } else if (tzoneOily && !cheeksOily) {
    type = 'Combination';
    confidence = 75;
    indicators.push('T-zone shine with normal cheeks');
  } else if (hasDryTexture && !tzoneOily) {
    type = 'Dry';
    confidence = Math.min(85, 65 + avgTextureVariance);
    indicators.push('High texture variance indicates dryness');
  } else if (!tzoneOily && !hasDryTexture && avgTextureVariance < 15) {
    type = 'Normal';
    confidence = 80;
    indicators.push('Balanced oil and texture levels');
  } else {
    type = 'Normal';
    confidence = 60;
    indicators.push('No strong indicators detected');
  }

  return {
    type,
    confidence: Math.round(confidence),
    indicators,
    metrics: {
      tzoneShine: Math.round(tzoneShine.shineRatio * 100),
      cheekShine: Math.round(cheekShineAvg * 100),
      textureVariance: Math.round(avgTextureVariance)
    }
  };
}

// ============================================
// SKIN CONCERNS DETECTION
// ============================================

// Detect redness in skin samples
function detectRedness(samples) {
  if (!samples || samples.length === 0) return { detected: false, severity: 0 };

  let rednessScores = [];

  samples.forEach(sample => {
    // Calculate R/(G+B) ratio - higher means more redness
    const rRatio = sample.r / (sample.g + sample.b + 1);
    // Also check absolute redness
    const rDominance = sample.r - ((sample.g + sample.b) / 2);

    rednessScores.push({
      ratio: rRatio,
      dominance: rDominance
    });
  });

  const avgRatio = rednessScores.reduce((sum, s) => sum + s.ratio, 0) / rednessScores.length;
  const avgDominance = rednessScores.reduce((sum, s) => sum + s.dominance, 0) / rednessScores.length;

  // Threshold for redness detection (increased to reduce false positives)
  // Normal skin has some red, so threshold needs to be higher
  const detected = avgRatio > 0.62 || avgDominance > 35;
  const severity = detected ? Math.min(80, Math.round((avgRatio - 0.55) * 150)) : 0;

  return {
    detected,
    severity: Math.max(0, severity),
    avgRatio: Math.round(avgRatio * 100) / 100
  };
}

// Detect uneven skin tone
function detectUnevenTone(regionAverages) {
  if (!regionAverages || Object.keys(regionAverages).length < 2) {
    return { detected: false, severity: 0 };
  }

  const regions = Object.values(regionAverages);
  let colorDifferences = [];

  // Compare each region pair
  for (let i = 0; i < regions.length; i++) {
    for (let j = i + 1; j < regions.length; j++) {
      if (regions[i] && regions[j]) {
        const diff = Math.sqrt(
          Math.pow(regions[i].r - regions[j].r, 2) +
          Math.pow(regions[i].g - regions[j].g, 2) +
          Math.pow(regions[i].b - regions[j].b, 2)
        );
        colorDifferences.push(diff);
      }
    }
  }

  if (colorDifferences.length === 0) return { detected: false, severity: 0 };

  const maxDiff = Math.max(...colorDifferences);
  const avgDiff = colorDifferences.reduce((a, b) => a + b, 0) / colorDifferences.length;

  // Threshold for uneven tone (increased - some variation is normal)
  const detected = avgDiff > 35 || maxDiff > 55;
  const severity = detected ? Math.min(70, Math.round((avgDiff - 30) * 1.5)) : 0;

  return {
    detected,
    severity: Math.max(0, severity),
    maxVariation: Math.round(maxDiff),
    avgVariation: Math.round(avgDiff)
  };
}

// Detect dark spots
function detectDarkSpots(imageData, landmarks, width, height, avgSkinColor) {
  if (!imageData || !landmarks || !avgSkinColor) {
    return { detected: false, severity: 0 };
  }

  const data = imageData.data;
  const skinIndices = getSkinRegionIndices();
  let darkSpotCount = 0;
  let totalSamples = 0;

  // Calculate expected skin luminance
  const expectedLuminance = 0.299 * avgSkinColor.r + 0.587 * avgSkinColor.g + 0.114 * avgSkinColor.b;

  skinIndices.forEach(index => {
    if (!landmarks[index]) return;
    const point = normalizePoint(landmarks[index], width, height);

    // Sample around each landmark
    for (let dy = -5; dy <= 5; dy += 2) {
      for (let dx = -5; dx <= 5; dx += 2) {
        const x = Math.floor(point.x) + dx;
        const y = Math.floor(point.y) + dy;

        if (x >= 0 && x < width && y >= 0 && y < height) {
          const idx = (y * width + x) * 4;
          const luminance = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];

          totalSamples++;
          // Dark spot if significantly darker than average
          if (luminance < expectedLuminance * 0.75) {
            darkSpotCount++;
          }
        }
      }
    }
  });

  const darkSpotRatio = totalSamples > 0 ? darkSpotCount / totalSamples : 0;
  // Increased threshold - shadows and lighting can cause false positives
  const detected = darkSpotRatio > 0.12;
  const severity = detected ? Math.min(70, Math.round((darkSpotRatio - 0.10) * 300)) : 0;

  return {
    detected,
    severity: Math.max(0, severity),
    darkSpotRatio: Math.round(darkSpotRatio * 100)
  };
}

// Detect large pores (high-frequency texture variation)
function detectLargePores(imageData, landmarks, width, height) {
  if (!imageData || !landmarks) return { detected: false, severity: 0 };

  // Focus on nose and cheek areas where pores are most visible
  const poreZones = ['nose', 'leftCheek', 'rightCheek'];
  let highFreqVariances = [];

  poreZones.forEach(zone => {
    const indices = getZoneIndices(zone);
    indices.forEach(index => {
      if (!landmarks[index]) return;
      const point = normalizePoint(landmarks[index], width, height);

      // Use smaller region for high-frequency analysis
      const variance = analyzeTextureVariance(
        imageData,
        Math.floor(point.x),
        Math.floor(point.y),
        width,
        height,
        3
      );
      highFreqVariances.push(variance);
    });
  });

  if (highFreqVariances.length === 0) return { detected: false, severity: 0 };

  const avgVariance = highFreqVariances.reduce((a, b) => a + b, 0) / highFreqVariances.length;
  // Increased threshold - camera noise can cause texture detection
  const detected = avgVariance > 28;
  const severity = detected ? Math.min(60, Math.round((avgVariance - 25) * 2)) : 0;

  return {
    detected,
    severity: Math.max(0, severity),
    textureScore: Math.round(avgVariance)
  };
}

// Detect dullness (low saturation and contrast)
function detectDullness(regionAverages) {
  if (!regionAverages || Object.keys(regionAverages).length === 0) {
    return { detected: false, severity: 0 };
  }

  let saturationValues = [];
  let lightnessValues = [];

  Object.values(regionAverages).forEach(region => {
    if (region) {
      const hsl = rgbToHsl(region.r, region.g, region.b);
      saturationValues.push(hsl.s);
      lightnessValues.push(hsl.l);
    }
  });

  if (saturationValues.length === 0) return { detected: false, severity: 0 };

  const avgSaturation = saturationValues.reduce((a, b) => a + b, 0) / saturationValues.length;
  const avgLightness = lightnessValues.reduce((a, b) => a + b, 0) / lightnessValues.length;

  // Dull skin has low saturation and medium-low lightness
  // Lowered thresholds - skin naturally has lower saturation than other objects
  const detected = avgSaturation < 18 && avgLightness < 55;
  const severity = detected ? Math.min(60, Math.round((18 - avgSaturation) * 3)) : 0;

  return {
    detected,
    severity: Math.max(0, severity),
    saturation: Math.round(avgSaturation),
    lightness: Math.round(avgLightness)
  };
}

// Analyze all skin concerns
export function analyzeConcerns(imageData, landmarks, width, height) {
  if (!imageData || !landmarks) {
    return [];
  }

  const concerns = [];

  // Get skin samples for analysis
  const regionAverages = sampleSkinRegions(imageData, landmarks, width, height);
  const avgSkinColor = sampleSkinColor(imageData, landmarks, width, height);

  // Collect all samples for redness detection
  const allSamples = [];
  Object.values(regionAverages).forEach(region => {
    if (region && region.samples) {
      allSamples.push(...region.samples);
    }
  });

  // 1. Check for redness
  const redness = detectRedness(allSamples);
  if (redness.detected) {
    concerns.push({
      name: 'Redness',
      severity: redness.severity > 60 ? 'moderate' : 'mild',
      score: redness.severity,
      confidence: 75
    });
  }

  // 2. Check for uneven tone
  const unevenTone = detectUnevenTone(regionAverages);
  if (unevenTone.detected) {
    concerns.push({
      name: 'Uneven Tone',
      severity: unevenTone.severity > 50 ? 'moderate' : 'mild',
      score: unevenTone.severity,
      confidence: 70
    });
  }

  // 3. Check for dark spots
  const darkSpots = detectDarkSpots(imageData, landmarks, width, height, avgSkinColor);
  if (darkSpots.detected) {
    concerns.push({
      name: 'Dark Spots',
      severity: darkSpots.severity > 50 ? 'moderate' : 'mild',
      score: darkSpots.severity,
      confidence: 65
    });
  }

  // 4. Check for large pores
  const largePores = detectLargePores(imageData, landmarks, width, height);
  if (largePores.detected) {
    concerns.push({
      name: 'Large Pores',
      severity: largePores.severity > 50 ? 'moderate' : 'mild',
      score: largePores.severity,
      confidence: 60
    });
  }

  // 5. Check for dullness
  const dullness = detectDullness(regionAverages);
  if (dullness.detected) {
    concerns.push({
      name: 'Dullness',
      severity: dullness.severity > 50 ? 'moderate' : 'mild',
      score: dullness.severity,
      confidence: 70
    });
  }

  // 6. Check for oiliness (from skin type detection)
  const skinType = detectSkinType(imageData, landmarks, width, height);
  if (skinType.metrics && skinType.metrics.tzoneShine > 20) {
    concerns.push({
      name: 'Oiliness',
      severity: skinType.metrics.tzoneShine > 35 ? 'moderate' : 'mild',
      score: Math.min(60, (skinType.metrics.tzoneShine - 15) * 2),
      confidence: skinType.confidence
    });
  }

  // Sort by severity score (highest first)
  concerns.sort((a, b) => b.score - a.score);

  return concerns;
}

// ============================================
// OVERALL SCORING
// ============================================

// Calculate overall skin health score
export function calculateSkinScore(concerns, lightingQuality) {
  if (!concerns || concerns.length === 0) return { score: 85, confidence: 70 };

  // Calculate average severity of concerns (not sum)
  const avgSeverity = concerns.reduce((sum, c) => sum + c.score, 0) / concerns.length;

  // Base score minus average severity, with gentler scaling
  // Most people should score between 60-90
  let score = 100 - (avgSeverity * 0.5);

  // Small penalty for having many concerns (max 10 points)
  const concernCountPenalty = Math.min(10, (concerns.length - 1) * 2);
  score -= concernCountPenalty;

  // Ensure score stays in reasonable range (40-95)
  score = Math.max(40, Math.min(95, score));

  // Adjust confidence based on lighting quality
  let confidence = 70;
  if (lightingQuality && lightingQuality.score) {
    confidence = Math.min(90, (confidence + lightingQuality.score) / 2);
  }

  return {
    score: Math.round(score),
    confidence: Math.round(confidence)
  };
}

// ============================================
// MAIN ANALYSIS FUNCTION
// ============================================

// Analyze face using simplified region sampling
function analyzeWithFaceParsing(imageData, landmarks, width, height) {
  // Get samples from all face regions
  const skinData = getSkinSamples(imageData, landmarks, width, height);

  if (!skinData || !skinData.all || skinData.all.length === 0) {
    return null;
  }

  return {
    overallStats: skinData.overallStats,
    regionStats: skinData.regionStats,
    textureAnalysis: skinData.textureAnalysis,
    shineAnalysis: skinData.shineAnalysis,
    sampleCount: skinData.sampleCount,
    // Include all regions including eyes, lips, eyebrows
    allRegions: skinData.regions,
  };
}

// Detect skin type using face parsing data
function detectSkinTypeAdvanced(parsingData) {
  if (!parsingData) {
    return { type: 'Normal', confidence: 50, indicators: [], metrics: {} };
  }

  const { shineAnalysis, textureAnalysis } = parsingData;

  // Check T-zone shine (forehead + nose)
  const foreheadShine = shineAnalysis?.forehead?.shineRatio || 0;
  const noseShine = shineAnalysis?.nose?.shineRatio || 0;
  const tzoneShine = (foreheadShine + noseShine) / 2;

  // Check cheek shine
  const leftCheekShine = shineAnalysis?.leftCheek?.shineRatio || 0;
  const rightCheekShine = shineAnalysis?.rightCheek?.shineRatio || 0;
  const cheekShine = (leftCheekShine + rightCheekShine) / 2;

  // Check texture (roughness indicates dryness)
  const textureValues = Object.values(textureAnalysis || {})
    .map(t => t?.variance || 0)
    .filter(v => v > 0);
  const avgTexture = textureValues.length > 0
    ? textureValues.reduce((sum, v) => sum + v, 0) / textureValues.length
    : 0;

  // Determine skin type
  let type = 'Normal';
  let confidence = 70;
  const indicators = [];

  const tzoneOily = tzoneShine > 0.06;
  const cheeksOily = cheekShine > 0.04;
  const hasDryTexture = avgTexture > 15;

  if (tzoneOily && cheeksOily) {
    type = 'Oily';
    confidence = Math.min(90, 70 + tzoneShine * 200);
    indicators.push('High shine detected across face');
  } else if (tzoneOily && !cheeksOily) {
    type = 'Combination';
    confidence = 80;
    indicators.push('T-zone shine with normal cheeks');
  } else if (hasDryTexture && !tzoneOily) {
    type = 'Dry';
    confidence = Math.min(85, 65 + avgTexture * 2);
    indicators.push('Texture analysis indicates dryness');
  } else {
    type = 'Normal';
    confidence = 75;
    indicators.push('Balanced oil and texture levels');
  }

  return {
    type,
    confidence: Math.round(confidence),
    indicators,
    metrics: {
      tzoneShine: Math.round(tzoneShine * 100),
      cheekShine: Math.round(cheekShine * 100),
      textureVariance: Math.round(avgTexture),
    },
  };
}

// Analyze concerns using face parsing data
function analyzeConcernsAdvanced(parsingData, imageData, width, height) {
  if (!parsingData) return [];

  const concerns = [];
  const { overallStats, regionStats, textureAnalysis, shineAnalysis } = parsingData;

  // 1. Redness detection - using color stats
  if (overallStats && overallStats.color) {
    const rRatio = overallStats.color.r / (overallStats.color.g + overallStats.color.b + 1);
    if (rRatio > 0.58) {
      concerns.push({
        name: 'Redness',
        severity: rRatio > 0.65 ? 'moderate' : 'mild',
        score: Math.min(70, Math.round((rRatio - 0.52) * 200)),
        confidence: 80,
      });
    }
  }

  // 2. Uneven tone - compare skin region colors (not eyes/lips)
  const skinRegionNames = ['forehead', 'leftCheek', 'rightCheek', 'nose', 'chin'];
  const skinRegionColors = skinRegionNames
    .map(name => regionStats?.[name])
    .filter(s => s && s.color);

  if (skinRegionColors.length >= 2) {
    let maxDiff = 0;
    for (let i = 0; i < skinRegionColors.length; i++) {
      for (let j = i + 1; j < skinRegionColors.length; j++) {
        const diff = Math.sqrt(
          Math.pow(skinRegionColors[i].color.r - skinRegionColors[j].color.r, 2) +
          Math.pow(skinRegionColors[i].color.g - skinRegionColors[j].color.g, 2) +
          Math.pow(skinRegionColors[i].color.b - skinRegionColors[j].color.b, 2)
        );
        maxDiff = Math.max(maxDiff, diff);
      }
    }
    if (maxDiff > 40) {
      concerns.push({
        name: 'Uneven Tone',
        severity: maxDiff > 60 ? 'moderate' : 'mild',
        score: Math.min(65, Math.round((maxDiff - 35) * 1.2)),
        confidence: 75,
      });
    }
  }

  // 3. Dark spots - using luminance variance
  if (overallStats && overallStats.luminance && overallStats.luminance.range > 80) {
    concerns.push({
      name: 'Dark Spots',
      severity: overallStats.luminance.range > 120 ? 'moderate' : 'mild',
      score: Math.min(60, Math.round((overallStats.luminance.range - 70) * 0.5)),
      confidence: 65,
    });
  }

  // 4. Large pores - texture in nose/cheek areas
  const noseTexture = textureAnalysis?.nose?.variance || 0;
  const cheekTexture = ((textureAnalysis?.leftCheek?.variance || 0) +
                        (textureAnalysis?.rightCheek?.variance || 0)) / 2;
  const poreTexture = (noseTexture + cheekTexture) / 2;

  if (poreTexture > 18) {
    concerns.push({
      name: 'Large Pores',
      severity: poreTexture > 25 ? 'moderate' : 'mild',
      score: Math.min(55, Math.round((poreTexture - 15) * 2)),
      confidence: 65,
    });
  }

  // 5. Dullness - low saturation
  if (overallStats && overallStats.color) {
    const { r, g, b } = overallStats.color;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturation = max > 0 ? (max - min) / max * 100 : 0;

    if (saturation < 12) {
      concerns.push({
        name: 'Dullness',
        severity: saturation < 8 ? 'moderate' : 'mild',
        score: Math.min(55, Math.round((12 - saturation) * 3)),
        confidence: 70,
      });
    }
  }

  // 6. Oiliness - T-zone shine
  const tzoneShine = ((shineAnalysis?.forehead?.shineRatio || 0) +
                      (shineAnalysis?.nose?.shineRatio || 0)) / 2;
  if (tzoneShine > 0.08) {
    concerns.push({
      name: 'Oiliness',
      severity: tzoneShine > 0.15 ? 'moderate' : 'mild',
      score: Math.min(55, Math.round(tzoneShine * 300)),
      confidence: 75,
    });
  }

  // Sort by score
  concerns.sort((a, b) => b.score - a.score);

  return concerns;
}

// Full skin analysis function
export function performSkinAnalysis(imageData, landmarks, width, height) {
  if (!imageData || !landmarks) return null;

  // Assess lighting quality first
  const lightingQuality = assessLightingQuality(imageData, width, height);

  // Use face parsing for accurate skin analysis
  const parsingData = analyzeWithFaceParsing(imageData, landmarks, width, height);

  // Get skin color from parsed data or fallback to landmark sampling
  let skinColor;
  if (parsingData && parsingData.overallStats) {
    skinColor = parsingData.overallStats.color;
  } else {
    skinColor = sampleSkinColor(imageData, landmarks, width, height);
  }

  // Determine Fitzpatrick type using ITA calculation
  const fitzpatrickResult = determineFitzpatrickType(skinColor);
  const fitzpatrickLevel = fitzpatrickResult.level;
  const fitzpatrickInfo = fitzpatrickScale.find(f => f.level === fitzpatrickLevel);

  // Analyze undertone
  const undertoneResult = analyzeUndertone(skinColor);

  // Detect skin type using advanced parsing or fallback
  let skinTypeResult;
  if (parsingData) {
    skinTypeResult = detectSkinTypeAdvanced(parsingData);
  } else {
    skinTypeResult = detectSkinType(imageData, landmarks, width, height);
  }

  // Analyze concerns using advanced parsing or fallback
  let concerns;
  if (parsingData) {
    concerns = analyzeConcernsAdvanced(parsingData, imageData, width, height);
  } else {
    concerns = analyzeConcerns(imageData, landmarks, width, height);
  }

  // Calculate face metrics
  const faceMetrics = calculateFaceMetrics(landmarks, width, height);

  // Calculate overall score
  const scoreResult = calculateSkinScore(concerns, lightingQuality);

  // Get product recommendations
  const recommendations = getRecommendedProducts(skinTypeResult.type, fitzpatrickLevel, concerns);

  // Calculate overall confidence - boost if face parsing worked
  let confidenceBoost = parsingData ? 10 : 0;
  const overallConfidence = Math.min(95, Math.round(
    (fitzpatrickResult.confidence +
     undertoneResult.confidence +
     skinTypeResult.confidence +
     lightingQuality.score) / 4 + confidenceBoost
  ));

  return {
    skinColor,
    fitzpatrick: {
      level: fitzpatrickLevel,
      name: fitzpatrickInfo?.name || `Type ${fitzpatrickLevel}`,
      description: fitzpatrickInfo?.description || '',
      ita: fitzpatrickResult.ita,
      confidence: fitzpatrickResult.confidence
    },
    undertone: {
      type: undertoneResult.type,
      confidence: undertoneResult.confidence
    },
    skinType: {
      type: skinTypeResult.type,
      confidence: skinTypeResult.confidence,
      indicators: skinTypeResult.indicators,
      metrics: skinTypeResult.metrics
    },
    concerns,
    faceMetrics,
    overallScore: scoreResult.score,
    confidence: {
      overall: overallConfidence,
      lighting: lightingQuality.score,
      skinTone: fitzpatrickResult.confidence,
      skinType: skinTypeResult.confidence,
      concerns: concerns.length > 0
        ? Math.round(concerns.reduce((sum, c) => sum + c.confidence, 0) / concerns.length)
        : 70,
      usedFaceParsing: !!parsingData,
    },
    lightingQuality: {
      score: lightingQuality.score,
      guidance: lightingQuality.guidance
    },
    recommendations,
    analyzedAt: new Date().toISOString(),
    disclaimer: 'Results are estimates based on image analysis. Lighting conditions significantly affect accuracy. For skin health concerns, please consult a dermatologist.',
    // Debug info
    _debug: parsingData ? {
      skinPixelCount: parsingData.sampleCount,
      regionsAnalyzed: Object.keys(parsingData.regionStats),
    } : null,
  };
}

// ============================================
// TIPS AND RECOMMENDATIONS
// ============================================

// Generate personalized tips based on analysis
export function generateSkinTips(analysis) {
  if (!analysis) return [];

  const tips = [];
  const skinType = analysis.skinType?.type || analysis.skinType;
  const undertone = analysis.undertone?.type || analysis.undertone;

  // Tips based on skin type
  switch (skinType) {
    case 'Oily':
      tips.push('Use oil-free, matte-finish foundations');
      tips.push('Apply setting powder to control shine');
      tips.push('Choose gel-based or water-based products');
      break;
    case 'Dry':
      tips.push('Opt for hydrating, dewy foundations');
      tips.push('Use cream-based blushes and highlighters');
      tips.push('Skip powder products when possible');
      break;
    case 'Combination':
      tips.push('Use different products for different zones');
      tips.push('Apply mattifying products on T-zone only');
      tips.push('Hydrate dry areas before makeup');
      break;
    case 'Sensitive':
      tips.push('Choose fragrance-free, hypoallergenic products');
      tips.push('Patch test new products before full application');
      tips.push('Avoid harsh chemical ingredients');
      break;
    default:
      tips.push('Your skin is well-balanced!');
      tips.push('Most product formulas will work for you');
  }

  // Tips based on undertone
  if (undertone === 'warm') {
    tips.push('Warm-toned lipsticks (coral, peach) will complement you');
    tips.push('Gold-based highlighters suit your skin best');
  } else if (undertone === 'cool') {
    tips.push('Cool-toned lipsticks (berry, pink) will complement you');
    tips.push('Silver and pink highlighters suit your skin best');
  }

  // Tips based on concerns
  if (analysis.concerns && analysis.concerns.length > 0) {
    analysis.concerns.forEach(concern => {
      switch (concern.name) {
        case 'Redness':
          tips.push('Use green color-correcting primer to neutralize redness');
          break;
        case 'Dark Spots':
          tips.push('Consider using products with vitamin C or niacinamide');
          break;
        case 'Dullness':
          tips.push('Try illuminating primers for a radiant base');
          break;
        case 'Large Pores':
          tips.push('Use pore-minimizing primers before foundation');
          break;
      }
    });
  }

  // Add confidence-based tips
  if (analysis.lightingQuality?.guidance) {
    tips.unshift(analysis.lightingQuality.guidance);
  }

  return tips.slice(0, 6);
}

// Match foundation shade
export function matchFoundationShade(analysis, foundationProduct) {
  if (!analysis || !foundationProduct) return null;

  const fitzpatrickLevel = analysis.fitzpatrick?.level || analysis.fitzpatrick;
  const matchingShades = foundationProduct.shades.filter(
    shade => shade.fitzpatrick && Math.abs(shade.fitzpatrick - fitzpatrickLevel) <= 1
  );

  if (matchingShades.length === 0) return foundationProduct.shades[0];

  // Find closest match
  return matchingShades.reduce((best, shade) => {
    const currentDiff = Math.abs(shade.fitzpatrick - fitzpatrickLevel);
    const bestDiff = Math.abs(best.fitzpatrick - fitzpatrickLevel);
    return currentDiff < bestDiff ? shade : best;
  });
}

export default {
  sampleSkinColor,
  determineFitzpatrickType,
  analyzeUndertone,
  detectSkinType,
  analyzeConcerns,
  calculateSkinScore,
  performSkinAnalysis,
  generateSkinTips,
  matchFoundationShade,
  assessLightingQuality,
};
