// Face Parsing Utility
// Creates face region masks for comprehensive facial analysis

import { normalizePoint, FACE, EYES, EYEBROWS, LIPS } from './landmarks';

/**
 * Face region definitions using MediaPipe landmark indices
 */
export const FACE_REGIONS = {
  forehead: [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109],
  leftCheek: [117, 118, 119, 120, 121, 128, 245, 193, 55, 65, 52, 53, 46, 124, 35, 111, 117],
  rightCheek: [346, 347, 348, 349, 350, 357, 465, 417, 285, 295, 282, 283, 276, 353, 265, 340, 346],
  nose: [168, 6, 197, 195, 5, 4, 1, 19, 94, 2, 164, 168],
  chin: [152, 175, 199, 200, 175, 152],
  leftEye: [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246, 33],
  rightEye: [263, 249, 390, 373, 374, 380, 381, 382, 362, 398, 384, 385, 386, 387, 388, 466, 263],
  lips: [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 409, 270, 269, 267, 0, 37, 39, 40, 185, 61],
  leftEyebrow: [70, 63, 105, 66, 107, 55, 65, 52, 53, 46, 70],
  rightEyebrow: [300, 293, 334, 296, 336, 285, 295, 282, 283, 276, 300],
};

/**
 * Get polygon points from landmark indices
 */
function getPolygonFromIndices(landmarks, indices, width, height) {
  return indices.map(idx => {
    if (!landmarks[idx]) return null;
    return normalizePoint(landmarks[idx], width, height);
  }).filter(p => p !== null);
}

/**
 * Check if a point is inside a polygon
 */
function isPointInPolygon(x, y, polygon) {
  if (!polygon || polygon.length < 3) return false;

  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;

    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  return inside;
}

/**
 * Simple and fast: sample pixels from face regions using landmarks directly
 * No complex masking - just sample around landmark points
 */
export function sampleFaceRegions(imageData, landmarks, width, height) {
  if (!landmarks || landmarks.length < 468 || !imageData) {
    return null;
  }

  const data = imageData.data;
  const regions = {};

  // Define which landmarks to sample for each region
  const regionSamplePoints = {
    forehead: [10, 151, 9, 8, 168, 108, 69, 104, 68, 71],
    leftCheek: [117, 118, 119, 120, 121, 50, 36, 47, 126],
    rightCheek: [346, 347, 348, 349, 350, 280, 266, 277, 355],
    nose: [6, 197, 195, 5, 4, 1, 2, 94, 19],
    chin: [152, 175, 199, 200, 421, 396, 171, 140, 170],
    leftEye: [33, 133, 159, 145, 153, 154, 155, 157, 158, 160, 161],
    rightEye: [263, 362, 386, 374, 380, 381, 382, 384, 385, 387, 388],
    lips: [0, 17, 61, 291, 13, 14, 78, 308, 82, 312, 87, 317],
    leftEyebrow: [70, 63, 105, 66, 107, 55, 52, 53],
    rightEyebrow: [300, 293, 334, 296, 336, 285, 282, 283],
  };

  // Sample each region
  for (const [regionName, pointIndices] of Object.entries(regionSamplePoints)) {
    const samples = [];

    pointIndices.forEach(idx => {
      if (!landmarks[idx]) return;

      const point = normalizePoint(landmarks[idx], width, height);
      const cx = Math.floor(point.x);
      const cy = Math.floor(point.y);

      // Sample a 5x5 area around each point
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const x = cx + dx;
          const y = cy + dy;

          if (x >= 0 && x < width && y >= 0 && y < height) {
            const pixelIdx = (y * width + x) * 4;
            samples.push({
              r: data[pixelIdx],
              g: data[pixelIdx + 1],
              b: data[pixelIdx + 2],
              x, y
            });
          }
        }
      }
    });

    if (samples.length > 0) {
      regions[regionName] = samples;
    }
  }

  return regions;
}

/**
 * Calculate statistics for a set of pixel samples
 */
export function calculateSampleStats(samples) {
  if (!samples || samples.length === 0) {
    return null;
  }

  const n = samples.length;

  // Calculate means
  const meanR = samples.reduce((s, p) => s + p.r, 0) / n;
  const meanG = samples.reduce((s, p) => s + p.g, 0) / n;
  const meanB = samples.reduce((s, p) => s + p.b, 0) / n;

  // Calculate standard deviations
  const stdR = Math.sqrt(samples.reduce((s, p) => s + Math.pow(p.r - meanR, 2), 0) / n);
  const stdG = Math.sqrt(samples.reduce((s, p) => s + Math.pow(p.g - meanG, 2), 0) / n);
  const stdB = Math.sqrt(samples.reduce((s, p) => s + Math.pow(p.b - meanB, 2), 0) / n);

  // Calculate luminance
  const luminances = samples.map(p => 0.299 * p.r + 0.587 * p.g + 0.114 * p.b);
  const meanLum = luminances.reduce((s, l) => s + l, 0) / n;
  const stdLum = Math.sqrt(luminances.reduce((s, l) => s + Math.pow(l - meanLum, 2), 0) / n);

  return {
    count: n,
    color: {
      r: Math.round(meanR),
      g: Math.round(meanG),
      b: Math.round(meanB),
    },
    std: {
      r: Math.round(stdR * 10) / 10,
      g: Math.round(stdG * 10) / 10,
      b: Math.round(stdB * 10) / 10,
    },
    luminance: {
      mean: Math.round(meanLum),
      std: Math.round(stdLum * 10) / 10,
      min: Math.round(Math.min(...luminances)),
      max: Math.round(Math.max(...luminances)),
      range: Math.round(Math.max(...luminances) - Math.min(...luminances)),
    },
  };
}

/**
 * Detect shine in samples (for oiliness)
 */
export function detectShineInSamples(samples, threshold = 200) {
  if (!samples || samples.length === 0) {
    return { shineRatio: 0, avgBrightness: 128 };
  }

  let shineCount = 0;
  let totalBrightness = 0;

  samples.forEach(({ r, g, b }) => {
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    totalBrightness += lum;

    // High brightness + low color variance = shine
    const colorVar = Math.abs(r - g) + Math.abs(g - b) + Math.abs(r - b);
    if (lum > threshold && colorVar < 40) {
      shineCount++;
    }
  });

  return {
    shineRatio: shineCount / samples.length,
    avgBrightness: totalBrightness / samples.length,
  };
}

/**
 * Calculate texture variance from samples
 */
export function calculateTextureFromSamples(samples) {
  if (!samples || samples.length < 9) {
    return { variance: 0 };
  }

  // Calculate luminance variance as texture indicator
  const luminances = samples.map(p => 0.299 * p.r + 0.587 * p.g + 0.114 * p.b);
  const mean = luminances.reduce((s, l) => s + l, 0) / luminances.length;
  const variance = luminances.reduce((s, l) => s + Math.pow(l - mean, 2), 0) / luminances.length;

  return {
    variance: Math.sqrt(variance),
  };
}

/**
 * Get comprehensive face analysis data
 */
export function getSkinSamples(imageData, landmarks, width, height) {
  const regions = sampleFaceRegions(imageData, landmarks, width, height);

  if (!regions) {
    return null;
  }

  // Combine all skin regions (excluding eyes, lips, eyebrows for skin color)
  const skinRegions = ['forehead', 'leftCheek', 'rightCheek', 'nose', 'chin'];
  const allSkinSamples = [];

  skinRegions.forEach(name => {
    if (regions[name]) {
      allSkinSamples.push(...regions[name]);
    }
  });

  // Calculate stats for each region
  const regionStats = {};
  for (const [name, samples] of Object.entries(regions)) {
    regionStats[name] = calculateSampleStats(samples);
  }

  // Calculate shine for T-zone
  const shineAnalysis = {
    forehead: detectShineInSamples(regions.forehead),
    nose: detectShineInSamples(regions.nose),
    leftCheek: detectShineInSamples(regions.leftCheek),
    rightCheek: detectShineInSamples(regions.rightCheek),
  };

  // Calculate texture
  const textureAnalysis = {
    forehead: calculateTextureFromSamples(regions.forehead),
    nose: calculateTextureFromSamples(regions.nose),
    leftCheek: calculateTextureFromSamples(regions.leftCheek),
    rightCheek: calculateTextureFromSamples(regions.rightCheek),
  };

  return {
    all: allSkinSamples,
    regions,
    regionStats,
    shineAnalysis,
    textureAnalysis,
    overallStats: calculateSampleStats(allSkinSamples),
    sampleCount: allSkinSamples.length,
  };
}

// Legacy exports for compatibility
export function createSkinMask() { return null; }
export function getRegionMasks() { return {}; }
export function sampleRegionPixels() { return []; }
export function analyzeRegionTexture() { return { averageVariance: 0 }; }
export function detectRegionShine() { return { shineRatio: 0, avgBrightness: 128 }; }

export default {
  sampleFaceRegions,
  getSkinSamples,
  calculateSampleStats,
  detectShineInSamples,
  calculateTextureFromSamples,
  FACE_REGIONS,
};
