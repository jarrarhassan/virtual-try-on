// Makeup rendering utilities using Canvas 2D
// Provides realistic makeup application with proper blending

import { LIPS, EYES, EYEBROWS, FACE, normalizePoint, getPolygonPath } from './landmarks';

// Blend modes for realistic makeup
const BLEND_MODES = {
  lipstick: 'multiply',
  lipgloss: 'soft-light',
  foundation: 'multiply',
  blush: 'multiply',
  contour: 'multiply',
  highlighter: 'screen',
  eyeshadow: 'multiply',
  eyeliner: 'source-over',
  mascara: 'source-over',
  brow: 'multiply',
};

// Apply Gaussian blur for soft edges
function applyGaussianBlur(ctx, amount) {
  ctx.filter = `blur(${amount}px)`;
}

function resetFilter(ctx) {
  ctx.filter = 'none';
}

// Draw filled polygon with gradient
function drawFilledPolygon(ctx, points, color, alpha = 1) {
  if (points.length < 3) return;

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();

  ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
  ctx.fill();
}

// Draw smooth curve through points
function drawSmoothCurve(ctx, points, color, lineWidth, alpha = 1) {
  if (points.length < 2) return;

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length - 1; i++) {
    const xc = (points[i].x + points[i + 1].x) / 2;
    const yc = (points[i].y + points[i + 1].y) / 2;
    ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
  }

  // Last point
  ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);

  ctx.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
}

// Render lipstick
export function renderLipstick(ctx, landmarks, width, height, shade, intensity, finish = 'matte') {
  if (!landmarks || !shade) return;

  const alpha = (intensity / 100) * (finish === 'gloss' ? 0.6 : 0.75);

  // Get lip points
  const outerPoints = getPolygonPath(landmarks, LIPS.outer, width, height);
  const innerPoints = getPolygonPath(landmarks, LIPS.inner, width, height);

  ctx.save();

  // Set blend mode based on finish
  ctx.globalCompositeOperation = finish === 'gloss' ? 'soft-light' : 'multiply';

  // Apply blur for soft edges
  applyGaussianBlur(ctx, 2);

  // Draw outer lip fill
  drawFilledPolygon(ctx, outerPoints, shade.rgb, alpha);

  // For glossy finish, add highlight
  if (finish === 'gloss' || finish === 'vinyl') {
    resetFilter(ctx);
    ctx.globalCompositeOperation = 'screen';

    // Add specular highlight
    const highlightColor = [255, 255, 255];
    const upperLipCenter = normalizePoint(landmarks[0], width, height);
    const lowerLipCenter = normalizePoint(landmarks[17], width, height);

    const gradient = ctx.createLinearGradient(
      upperLipCenter.x, upperLipCenter.y,
      lowerLipCenter.x, lowerLipCenter.y
    );
    gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.4})`);
    gradient.addColorStop(0.5, `rgba(255, 255, 255, ${alpha * 0.1})`);
    gradient.addColorStop(1, `rgba(255, 255, 255, ${alpha * 0.2})`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(outerPoints[0].x, outerPoints[0].y);
    outerPoints.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

// Render foundation
export function renderFoundation(ctx, landmarks, width, height, shade, intensity) {
  if (!landmarks || !shade) return;

  const alpha = (intensity / 100) * 0.3; // Foundation should be subtle

  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  applyGaussianBlur(ctx, 8);

  // Get face oval points
  const facePoints = getPolygonPath(landmarks, FACE.oval, width, height);

  drawFilledPolygon(ctx, facePoints, shade.rgb, alpha);

  ctx.restore();
}

// Render blush
export function renderBlush(ctx, landmarks, width, height, shade, intensity) {
  if (!landmarks || !shade) return;

  const alpha = (intensity / 100) * 0.45;

  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  applyGaussianBlur(ctx, 15);

  // Left cheek
  const leftCheekPoints = getPolygonPath(landmarks, FACE.leftCheek, width, height);
  drawFilledPolygon(ctx, leftCheekPoints, shade.rgb, alpha);

  // Right cheek
  const rightCheekPoints = getPolygonPath(landmarks, FACE.rightCheek, width, height);
  drawFilledPolygon(ctx, rightCheekPoints, shade.rgb, alpha);

  ctx.restore();
}

// Render contour
export function renderContour(ctx, landmarks, width, height, shade, intensity) {
  if (!landmarks || !shade) return;

  const alpha = (intensity / 100) * 0.35;

  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  applyGaussianBlur(ctx, 12);

  // Cheekbone contour - left
  const leftContourPoints = getPolygonPath(landmarks, FACE.leftCheekbone, width, height);
  drawFilledPolygon(ctx, leftContourPoints, shade.rgb, alpha);

  // Cheekbone contour - right
  const rightContourPoints = getPolygonPath(landmarks, FACE.rightCheekbone, width, height);
  drawFilledPolygon(ctx, rightContourPoints, shade.rgb, alpha);

  // Jawline contour
  const jawlinePoints = getPolygonPath(landmarks, FACE.jawline, width, height);
  drawFilledPolygon(ctx, jawlinePoints, shade.rgb, alpha * 0.5);

  ctx.restore();
}

// Render highlighter
export function renderHighlighter(ctx, landmarks, width, height, shade, intensity) {
  if (!landmarks || !shade) return;

  const alpha = (intensity / 100) * 0.4;

  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  applyGaussianBlur(ctx, 10);

  // Nose bridge highlight
  const noseBridgePoints = getPolygonPath(landmarks, FACE.noseBridge, width, height);
  drawSmoothCurve(ctx, noseBridgePoints, shade.rgb, 8, alpha);

  // Cheekbone highlights
  const leftTemplePoints = getPolygonPath(landmarks, FACE.leftTemple, width, height);
  drawFilledPolygon(ctx, leftTemplePoints, shade.rgb, alpha * 0.7);

  const rightTemplePoints = getPolygonPath(landmarks, FACE.rightTemple, width, height);
  drawFilledPolygon(ctx, rightTemplePoints, shade.rgb, alpha * 0.7);

  ctx.restore();
}

// Render eyeshadow
export function renderEyeshadow(ctx, landmarks, width, height, shade, intensity) {
  if (!landmarks || !shade) return;

  const alpha = (intensity / 100) * 0.55;

  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  applyGaussianBlur(ctx, 6);

  // Left eye
  const leftLidPoints = getPolygonPath(landmarks, EYES.left.upperLid, width, height);
  const leftCreasePoints = getPolygonPath(landmarks, EYES.left.crease, width, height);

  // Main lid color
  drawFilledPolygon(ctx, leftLidPoints, shade.rgb, alpha);

  // Crease (darker shade)
  const darkerShade = shade.rgb.map(c => Math.max(0, c - 40));
  applyGaussianBlur(ctx, 8);
  drawFilledPolygon(ctx, leftCreasePoints, darkerShade, alpha * 0.5);

  // Right eye
  resetFilter(ctx);
  applyGaussianBlur(ctx, 6);

  const rightLidPoints = getPolygonPath(landmarks, EYES.right.upperLid, width, height);
  const rightCreasePoints = getPolygonPath(landmarks, EYES.right.crease, width, height);

  drawFilledPolygon(ctx, rightLidPoints, shade.rgb, alpha);

  applyGaussianBlur(ctx, 8);
  drawFilledPolygon(ctx, rightCreasePoints, darkerShade, alpha * 0.5);

  ctx.restore();
}

// Render eyeliner
export function renderEyeliner(ctx, landmarks, width, height, shade, intensity) {
  if (!landmarks || !shade) return;

  const alpha = (intensity / 100) * 0.9;

  ctx.save();
  ctx.globalCompositeOperation = 'source-over';

  // Left eye liner
  const leftLinerPoints = getPolygonPath(landmarks, EYES.left.linerUpper, width, height);
  drawSmoothCurve(ctx, leftLinerPoints, shade.rgb, 2, alpha);

  // Right eye liner
  const rightLinerPoints = getPolygonPath(landmarks, EYES.right.linerUpper, width, height);
  drawSmoothCurve(ctx, rightLinerPoints, shade.rgb, 2, alpha);

  // Wing effect (optional based on intensity)
  if (intensity > 70) {
    const leftOuter = normalizePoint(landmarks[EYES.left.outerCorner], width, height);
    const rightOuter = normalizePoint(landmarks[EYES.right.outerCorner], width, height);

    ctx.beginPath();
    ctx.moveTo(leftOuter.x, leftOuter.y);
    ctx.lineTo(leftOuter.x - 8, leftOuter.y - 6);
    ctx.strokeStyle = `rgba(${shade.rgb[0]}, ${shade.rgb[1]}, ${shade.rgb[2]}, ${alpha})`;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(rightOuter.x, rightOuter.y);
    ctx.lineTo(rightOuter.x + 8, rightOuter.y - 6);
    ctx.stroke();
  }

  ctx.restore();
}

// Render mascara effect
export function renderMascara(ctx, landmarks, width, height, shade, intensity) {
  if (!landmarks || !shade) return;

  const alpha = (intensity / 100) * 0.85;

  ctx.save();
  ctx.globalCompositeOperation = 'source-over';

  // Thicken the lash line
  const leftLashPoints = getPolygonPath(landmarks, EYES.left.linerUpper, width, height);
  const rightLashPoints = getPolygonPath(landmarks, EYES.right.linerUpper, width, height);

  // Draw thicker lines for lash effect
  drawSmoothCurve(ctx, leftLashPoints, shade.rgb, 3, alpha);
  drawSmoothCurve(ctx, rightLashPoints, shade.rgb, 3, alpha);

  // Add individual lash strokes
  for (let i = 0; i < leftLashPoints.length; i += 2) {
    const p = leftLashPoints[i];
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x, p.y - 4 - Math.random() * 3);
    ctx.strokeStyle = `rgba(${shade.rgb[0]}, ${shade.rgb[1]}, ${shade.rgb[2]}, ${alpha})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  for (let i = 0; i < rightLashPoints.length; i += 2) {
    const p = rightLashPoints[i];
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x, p.y - 4 - Math.random() * 3);
    ctx.stroke();
  }

  ctx.restore();
}

// Render eyebrow fill
export function renderBrows(ctx, landmarks, width, height, shade, intensity) {
  if (!landmarks || !shade) return;

  const alpha = (intensity / 100) * 0.6;

  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  applyGaussianBlur(ctx, 2);

  // Left brow
  const leftBrowPoints = getPolygonPath(landmarks, EYEBROWS.left.full, width, height);
  drawFilledPolygon(ctx, leftBrowPoints, shade.rgb, alpha);

  // Right brow
  const rightBrowPoints = getPolygonPath(landmarks, EYEBROWS.right.full, width, height);
  drawFilledPolygon(ctx, rightBrowPoints, shade.rgb, alpha);

  ctx.restore();
}

// Main render function - applies all active makeup
export function renderAllMakeup(ctx, landmarks, width, height, products, shades, intensities) {
  if (!landmarks) return;

  // Clear the canvas
  ctx.clearRect(0, 0, width, height);

  // Apply makeup in order (back to front)
  // 1. Foundation (base layer)
  if (products.foundation && shades.foundation) {
    renderFoundation(ctx, landmarks, width, height, shades.foundation, intensities.foundation);
  }

  // 2. Contour
  if (products.contour && shades.contour) {
    renderContour(ctx, landmarks, width, height, shades.contour, intensities.contour);
  }

  // 3. Highlighter
  if (products.highlighter && shades.highlighter) {
    renderHighlighter(ctx, landmarks, width, height, shades.highlighter, intensities.highlighter);
  }

  // 4. Blush
  if (products.blush && shades.blush) {
    renderBlush(ctx, landmarks, width, height, shades.blush, intensities.blush);
  }

  // 5. Eyebrows
  if (products.brow && shades.brow) {
    renderBrows(ctx, landmarks, width, height, shades.brow, intensities.brow);
  }

  // 6. Eyeshadow
  if (products.eyeshadow && shades.eyeshadow) {
    renderEyeshadow(ctx, landmarks, width, height, shades.eyeshadow, intensities.eyeshadow);
  }

  // 7. Eyeliner
  if (products.eyeliner && shades.eyeliner) {
    renderEyeliner(ctx, landmarks, width, height, shades.eyeliner, intensities.eyeliner);
  }

  // 8. Mascara
  if (products.mascara && shades.mascara) {
    renderMascara(ctx, landmarks, width, height, shades.mascara, intensities.mascara);
  }

  // 9. Lipstick (top layer)
  if (products.lips && shades.lips) {
    const finish = products.lips.finish || 'matte';
    renderLipstick(ctx, landmarks, width, height, shades.lips, intensities.lips, finish);
  }
}

export default {
  renderLipstick,
  renderFoundation,
  renderBlush,
  renderContour,
  renderHighlighter,
  renderEyeshadow,
  renderEyeliner,
  renderMascara,
  renderBrows,
  renderAllMakeup,
};
