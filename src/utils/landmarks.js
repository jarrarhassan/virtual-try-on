// MediaPipe Face Mesh landmark indices for makeup application
// Total: 468 landmarks

// Lip landmarks for lipstick application
export const LIPS = {
  // Outer lips
  outer: [
    61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291,
    409, 270, 269, 267, 0, 37, 39, 40, 185
  ],
  // Inner lips
  inner: [
    78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308,
    415, 310, 311, 312, 13, 82, 81, 80, 191
  ],
  // Upper lip
  upperOuter: [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291],
  upperInner: [78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308],
  // Lower lip
  lowerOuter: [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291],
  lowerInner: [78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308],
  // Center points
  upperCenter: 0,
  lowerCenter: 17,
  leftCorner: 61,
  rightCorner: 291,
};

// Eye landmarks for eyeshadow, eyeliner, mascara
export const EYES = {
  // Left eye
  left: {
    // Full eye contour
    contour: [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246],
    // Upper eyelid (for eyeshadow)
    upperLid: [246, 161, 160, 159, 158, 157, 173, 133, 155, 154, 153, 145, 144, 163, 7, 33],
    // Lower eyelid
    lowerLid: [33, 7, 163, 144, 145, 153, 154, 155, 133],
    // Eyeliner path (upper lash line)
    linerUpper: [33, 246, 161, 160, 159, 158, 157, 173, 133],
    // Eyeliner path (lower lash line)
    linerLower: [33, 7, 163, 144, 145, 153, 154, 155, 133],
    // Inner corner
    innerCorner: 133,
    // Outer corner
    outerCorner: 33,
    // Pupil center (approximate)
    pupil: 468, // iris center
    // Eyelid crease area for eyeshadow
    crease: [247, 30, 29, 27, 28, 56, 190, 243, 112, 26, 22, 23, 24, 110, 25],
    // Extended area above eye for eyeshadow blending
    browBone: [156, 70, 63, 105, 66, 107, 55, 193],
  },
  // Right eye (mirrored)
  right: {
    contour: [263, 249, 390, 373, 374, 380, 381, 382, 362, 398, 384, 385, 386, 387, 388, 466],
    upperLid: [466, 388, 387, 386, 385, 384, 398, 362, 382, 381, 380, 374, 373, 390, 249, 263],
    lowerLid: [263, 249, 390, 373, 374, 380, 381, 382, 362],
    linerUpper: [263, 466, 388, 387, 386, 385, 384, 398, 362],
    linerLower: [263, 249, 390, 373, 374, 380, 381, 382, 362],
    innerCorner: 362,
    outerCorner: 263,
    pupil: 473,
    crease: [467, 260, 259, 257, 258, 286, 414, 463, 341, 256, 252, 253, 254, 339, 255],
    browBone: [383, 300, 293, 334, 296, 336, 285, 417],
  },
};

// Eyebrow landmarks
export const EYEBROWS = {
  left: {
    full: [70, 63, 105, 66, 107, 55, 65, 52, 53, 46],
    upper: [70, 63, 105, 66, 107],
    lower: [55, 65, 52, 53, 46],
    innerEnd: 107,
    outerEnd: 70,
    arch: 105,
  },
  right: {
    full: [300, 293, 334, 296, 336, 285, 295, 282, 283, 276],
    upper: [300, 293, 334, 296, 336],
    lower: [285, 295, 282, 283, 276],
    innerEnd: 336,
    outerEnd: 300,
    arch: 334,
  },
};

// Face contour for foundation, blush, contour, highlight
export const FACE = {
  // Full face oval
  oval: [
    10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288,
    397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136,
    172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109
  ],
  // Cheek areas for blush
  leftCheek: [117, 118, 119, 120, 121, 128, 245, 193, 55, 65, 52, 53, 46],
  rightCheek: [346, 347, 348, 349, 350, 357, 465, 417, 285, 295, 282, 283, 276],
  // Cheekbone area for contour/highlight
  leftCheekbone: [234, 127, 162, 21, 54, 103, 67, 109, 10],
  rightCheekbone: [454, 356, 389, 251, 284, 332, 297, 338, 10],
  // Forehead
  forehead: [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152],
  // Nose
  nose: [168, 6, 197, 195, 5, 4, 1, 19, 94, 2],
  noseBridge: [168, 6, 197, 195, 5],
  noseTip: [1, 2, 98, 327],
  // Jawline
  jawline: [172, 136, 150, 149, 176, 148, 152, 377, 400, 378, 379, 365, 397, 288, 361, 323],
  // Chin
  chin: [152, 148, 176, 149, 150, 136, 172, 58],
  // Temple areas
  leftTemple: [21, 54, 103, 67, 109],
  rightTemple: [251, 284, 332, 297, 338],
};

// Get normalized coordinates from landmarks
export function normalizePoint(landmark, width, height) {
  return {
    x: landmark.x * width,
    y: landmark.y * height,
    z: landmark.z * width, // depth
  };
}

// Get bounding box for a set of landmarks
export function getBoundingBox(landmarks, indices, width, height) {
  const points = indices.map(i => normalizePoint(landmarks[i], width, height));

  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);

  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys),
    centerX: (Math.min(...xs) + Math.max(...xs)) / 2,
    centerY: (Math.min(...ys) + Math.max(...ys)) / 2,
  };
}

// Get polygon path from landmarks
export function getPolygonPath(landmarks, indices, width, height) {
  return indices.map(i => normalizePoint(landmarks[i], width, height));
}

// Calculate face metrics for skin analysis
export function calculateFaceMetrics(landmarks, width, height) {
  if (!landmarks || landmarks.length < 468) return null;

  // Face width (temple to temple)
  const leftTemple = normalizePoint(landmarks[234], width, height);
  const rightTemple = normalizePoint(landmarks[454], width, height);
  const faceWidth = Math.abs(rightTemple.x - leftTemple.x);

  // Face height (forehead to chin)
  const forehead = normalizePoint(landmarks[10], width, height);
  const chin = normalizePoint(landmarks[152], width, height);
  const faceHeight = Math.abs(chin.y - forehead.y);

  // Eye distance
  const leftEye = normalizePoint(landmarks[33], width, height);
  const rightEye = normalizePoint(landmarks[263], width, height);
  const eyeDistance = Math.abs(rightEye.x - leftEye.x);

  // Nose length
  const noseBridge = normalizePoint(landmarks[6], width, height);
  const noseTip = normalizePoint(landmarks[1], width, height);
  const noseLength = Math.abs(noseTip.y - noseBridge.y);

  // Lip thickness
  const upperLip = normalizePoint(landmarks[0], width, height);
  const lowerLip = normalizePoint(landmarks[17], width, height);
  const lipThickness = Math.abs(lowerLip.y - upperLip.y);

  return {
    faceWidth,
    faceHeight,
    faceRatio: faceWidth / faceHeight,
    eyeDistance,
    noseLength,
    lipThickness,
    symmetryScore: calculateSymmetry(landmarks, width, height),
  };
}

// Calculate facial symmetry
function calculateSymmetry(landmarks, width, height) {
  // Compare left and right side distances from center
  const nose = normalizePoint(landmarks[1], width, height);
  const centerX = nose.x;

  const leftEye = normalizePoint(landmarks[33], width, height);
  const rightEye = normalizePoint(landmarks[263], width, height);

  const leftDist = Math.abs(leftEye.x - centerX);
  const rightDist = Math.abs(rightEye.x - centerX);

  const symmetryRatio = Math.min(leftDist, rightDist) / Math.max(leftDist, rightDist);
  return symmetryRatio * 100; // Return as percentage
}

// Detect skin tone from face region
export function getSkinRegionIndices() {
  // Return indices for sampling skin color (avoiding eyes, lips, brows)
  return [
    // Forehead samples
    10, 151, 9, 8, 168,
    // Cheek samples
    117, 118, 119, 346, 347, 348,
    // Nose bridge
    6, 197,
    // Chin
    152, 175, 199,
  ];
}

export default {
  LIPS,
  EYES,
  EYEBROWS,
  FACE,
  normalizePoint,
  getBoundingBox,
  getPolygonPath,
  calculateFaceMetrics,
  getSkinRegionIndices,
};
