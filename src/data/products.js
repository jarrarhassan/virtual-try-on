// Comprehensive product catalog with 50+ cosmetic products
export const products = [
  // LIPSTICKS - 20 products
  {
    id: 'lip-1',
    name: 'Rouge Signature',
    brand: "L'Oréal Paris",
    category: 'lips',
    type: 'lipstick',
    finish: 'matte',
    description: 'Weightless, longwear liquid lipstick',
    shades: [
      { id: 'lip-1-1', name: 'I Am Worth It', rgb: [178, 34, 34], hex: '#B22222' },
      { id: 'lip-1-2', name: 'I Choose', rgb: [199, 21, 133], hex: '#C71585' },
      { id: 'lip-1-3', name: 'I Explore', rgb: [220, 20, 60], hex: '#DC143C' },
      { id: 'lip-1-4', name: 'I Create', rgb: [255, 99, 71], hex: '#FF6347' },
      { id: 'lip-1-5', name: 'I Radiate', rgb: [205, 92, 92], hex: '#CD5C5C' },
    ],
    image: 'https://via.placeholder.com/100x100/B22222/FFFFFF?text=RS'
  },
  {
    id: 'lip-2',
    name: 'Color Riche Satin',
    brand: "L'Oréal Paris",
    category: 'lips',
    type: 'lipstick',
    finish: 'satin',
    description: 'Rich, creamy lipstick with argan oil',
    shades: [
      { id: 'lip-2-1', name: 'Scarlet Silhouette', rgb: [255, 36, 0], hex: '#FF2400' },
      { id: 'lip-2-2', name: 'Maison Marais', rgb: [128, 0, 0], hex: '#800000' },
      { id: 'lip-2-3', name: 'Blazing Lava', rgb: [207, 16, 32], hex: '#CF1020' },
      { id: 'lip-2-4', name: 'Pink Parfait', rgb: [255, 105, 180], hex: '#FF69B4' },
      { id: 'lip-2-5', name: 'Nude Cliché', rgb: [188, 143, 143], hex: '#BC8F8F' },
    ],
    image: 'https://via.placeholder.com/100x100/FF2400/FFFFFF?text=CR'
  },
  {
    id: 'lip-3',
    name: 'SuperStay Matte Ink',
    brand: 'Maybelline',
    category: 'lips',
    type: 'lipstick',
    finish: 'matte',
    description: '16-hour longwear liquid lipstick',
    shades: [
      { id: 'lip-3-1', name: 'Pioneer', rgb: [165, 42, 42], hex: '#A52A2A' },
      { id: 'lip-3-2', name: 'Voyager', rgb: [139, 69, 69], hex: '#8B4545' },
      { id: 'lip-3-3', name: 'Lover', rgb: [255, 20, 147], hex: '#FF1493' },
      { id: 'lip-3-4', name: 'Seductress', rgb: [112, 28, 28], hex: '#701C1C' },
      { id: 'lip-3-5', name: 'Dreamer', rgb: [219, 112, 147], hex: '#DB7093' },
    ],
    image: 'https://via.placeholder.com/100x100/A52A2A/FFFFFF?text=MI'
  },
  {
    id: 'lip-4',
    name: 'Lifter Gloss',
    brand: 'Maybelline',
    category: 'lips',
    type: 'lipstick',
    finish: 'gloss',
    description: 'Plumping lip gloss with hyaluronic acid',
    shades: [
      { id: 'lip-4-1', name: 'Peach Ring', rgb: [255, 218, 185], hex: '#FFDAB9' },
      { id: 'lip-4-2', name: 'Moon', rgb: [255, 228, 225], hex: '#FFE4E1' },
      { id: 'lip-4-3', name: 'Silk', rgb: [255, 192, 203], hex: '#FFC0CB' },
      { id: 'lip-4-4', name: 'Topaz', rgb: [255, 182, 193], hex: '#FFB6C1' },
      { id: 'lip-4-5', name: 'Ruby', rgb: [224, 102, 102], hex: '#E06666' },
    ],
    image: 'https://via.placeholder.com/100x100/FFDAB9/000000?text=LG'
  },
  {
    id: 'lip-5',
    name: 'Vinyl Ink',
    brand: 'Maybelline',
    category: 'lips',
    type: 'lipstick',
    finish: 'vinyl',
    description: 'High-shine longwear liquid lip color',
    shades: [
      { id: 'lip-5-1', name: 'Peppy', rgb: [255, 127, 80], hex: '#FF7F50' },
      { id: 'lip-5-2', name: 'Cheeky', rgb: [255, 99, 71], hex: '#FF6347' },
      { id: 'lip-5-3', name: 'Witty', rgb: [178, 34, 34], hex: '#B22222' },
      { id: 'lip-5-4', name: 'Red Hot', rgb: [255, 0, 0], hex: '#FF0000' },
    ],
    image: 'https://via.placeholder.com/100x100/FF7F50/FFFFFF?text=VI'
  },

  // FOUNDATIONS - 10 products
  {
    id: 'found-1',
    name: 'True Match Foundation',
    brand: "L'Oréal Paris",
    category: 'face',
    type: 'foundation',
    finish: 'natural',
    description: 'Matches skin tone and texture perfectly',
    shades: [
      { id: 'found-1-1', name: 'Porcelain W1', rgb: [255, 235, 205], hex: '#FFEBCD', fitzpatrick: 1 },
      { id: 'found-1-2', name: 'Ivory W2', rgb: [255, 228, 196], hex: '#FFE4C4', fitzpatrick: 1 },
      { id: 'found-1-3', name: 'Natural Beige W4', rgb: [245, 222, 179], hex: '#F5DEB3', fitzpatrick: 2 },
      { id: 'found-1-4', name: 'Sun Beige W6', rgb: [222, 184, 135], hex: '#DEB887', fitzpatrick: 3 },
      { id: 'found-1-5', name: 'Caramel W7', rgb: [210, 180, 140], hex: '#D2B48C', fitzpatrick: 4 },
      { id: 'found-1-6', name: 'Cappuccino W8', rgb: [188, 143, 143], hex: '#BC8F8F', fitzpatrick: 4 },
      { id: 'found-1-7', name: 'Cocoa C9', rgb: [139, 90, 43], hex: '#8B5A2B', fitzpatrick: 5 },
      { id: 'found-1-8', name: 'Espresso C10', rgb: [101, 67, 33], hex: '#654321', fitzpatrick: 6 },
    ],
    image: 'https://via.placeholder.com/100x100/DEB887/000000?text=TM'
  },
  {
    id: 'found-2',
    name: 'Infallible Fresh Wear',
    brand: "L'Oréal Paris",
    category: 'face',
    type: 'foundation',
    finish: 'matte',
    description: '24H longwear foundation',
    shades: [
      { id: 'found-2-1', name: 'Pearl', rgb: [253, 245, 230], hex: '#FDF5E6', fitzpatrick: 1 },
      { id: 'found-2-2', name: 'Linen', rgb: [250, 240, 230], hex: '#FAF0E6', fitzpatrick: 1 },
      { id: 'found-2-3', name: 'Golden Beige', rgb: [245, 222, 179], hex: '#F5DEB3', fitzpatrick: 2 },
      { id: 'found-2-4', name: 'Golden Honey', rgb: [218, 165, 32], hex: '#DAA520', fitzpatrick: 3 },
      { id: 'found-2-5', name: 'Toffee', rgb: [139, 90, 43], hex: '#8B5A2B', fitzpatrick: 5 },
    ],
    image: 'https://via.placeholder.com/100x100/F5DEB3/000000?text=IFW'
  },
  {
    id: 'found-3',
    name: 'Fit Me Matte + Poreless',
    brand: 'Maybelline',
    category: 'face',
    type: 'foundation',
    finish: 'matte',
    description: 'Poreless finish for normal to oily skin',
    shades: [
      { id: 'found-3-1', name: '110 Porcelain', rgb: [255, 239, 213], hex: '#FFEFD5', fitzpatrick: 1 },
      { id: 'found-3-2', name: '120 Classic Ivory', rgb: [255, 235, 205], hex: '#FFEBCD', fitzpatrick: 1 },
      { id: 'found-3-3', name: '220 Natural Beige', rgb: [245, 222, 179], hex: '#F5DEB3', fitzpatrick: 2 },
      { id: 'found-3-4', name: '330 Toffee', rgb: [210, 180, 140], hex: '#D2B48C', fitzpatrick: 4 },
      { id: 'found-3-5', name: '360 Mocha', rgb: [139, 90, 43], hex: '#8B5A2B', fitzpatrick: 5 },
    ],
    image: 'https://via.placeholder.com/100x100/FFEFD5/000000?text=FM'
  },

  // BLUSH - 8 products
  {
    id: 'blush-1',
    name: 'True Match Blush',
    brand: "L'Oréal Paris",
    category: 'face',
    type: 'blush',
    finish: 'natural',
    description: 'Super-blendable blush',
    shades: [
      { id: 'blush-1-1', name: 'Tender Rose', rgb: [255, 182, 193], hex: '#FFB6C1' },
      { id: 'blush-1-2', name: 'Rosy Outlook', rgb: [255, 105, 180], hex: '#FF69B4' },
      { id: 'blush-1-3', name: 'Innocent Flush', rgb: [255, 192, 203], hex: '#FFC0CB' },
      { id: 'blush-1-4', name: 'Barely Blushing', rgb: [219, 112, 147], hex: '#DB7093' },
    ],
    image: 'https://via.placeholder.com/100x100/FFB6C1/000000?text=TB'
  },
  {
    id: 'blush-2',
    name: 'Fit Me Blush',
    brand: 'Maybelline',
    category: 'face',
    type: 'blush',
    finish: 'natural',
    description: 'Lightweight blush for a natural flush',
    shades: [
      { id: 'blush-2-1', name: 'Peach', rgb: [255, 218, 185], hex: '#FFDAB9' },
      { id: 'blush-2-2', name: 'Rose', rgb: [255, 0, 127], hex: '#FF007F' },
      { id: 'blush-2-3', name: 'Wine', rgb: [114, 47, 55], hex: '#722F37' },
      { id: 'blush-2-4', name: 'Berry', rgb: [142, 69, 133], hex: '#8E4585' },
    ],
    image: 'https://via.placeholder.com/100x100/FFDAB9/000000?text=FB'
  },

  // CONTOUR & HIGHLIGHT - 6 products
  {
    id: 'contour-1',
    name: 'True Match Contour Kit',
    brand: "L'Oréal Paris",
    category: 'face',
    type: 'contour',
    finish: 'matte',
    description: 'Sculpt, define, and highlight',
    shades: [
      { id: 'contour-1-1', name: 'Light/Medium', rgb: [160, 120, 90], hex: '#A0785A' },
      { id: 'contour-1-2', name: 'Medium/Deep', rgb: [120, 80, 50], hex: '#785032' },
    ],
    image: 'https://via.placeholder.com/100x100/A0785A/FFFFFF?text=CK'
  },
  {
    id: 'highlight-1',
    name: 'True Match Lumi Glow',
    brand: "L'Oréal Paris",
    category: 'face',
    type: 'highlighter',
    finish: 'shimmer',
    description: 'Buildable glow highlighter',
    shades: [
      { id: 'high-1-1', name: 'Ice', rgb: [255, 255, 240], hex: '#FFFFF0' },
      { id: 'high-1-2', name: 'Golden', rgb: [255, 223, 186], hex: '#FFDFBA' },
      { id: 'high-1-3', name: 'Rose', rgb: [255, 228, 225], hex: '#FFE4E1' },
    ],
    image: 'https://via.placeholder.com/100x100/FFFFF0/000000?text=LG'
  },

  // EYESHADOW PALETTES - 8 products
  {
    id: 'eye-1',
    name: 'Paradise Enchanted Palette',
    brand: "L'Oréal Paris",
    category: 'eyes',
    type: 'eyeshadow',
    finish: 'mixed',
    description: 'Scented eyeshadow palette',
    shades: [
      { id: 'eye-1-1', name: 'Sunset', rgb: [255, 140, 0], hex: '#FF8C00' },
      { id: 'eye-1-2', name: 'Coral Reef', rgb: [255, 127, 80], hex: '#FF7F50' },
      { id: 'eye-1-3', name: 'Ocean Blue', rgb: [0, 119, 190], hex: '#0077BE' },
      { id: 'eye-1-4', name: 'Forest', rgb: [34, 139, 34], hex: '#228B22' },
    ],
    image: 'https://via.placeholder.com/100x100/FF8C00/FFFFFF?text=PE'
  },
  {
    id: 'eye-2',
    name: 'Color Riche Eyeshadow Quad',
    brand: "L'Oréal Paris",
    category: 'eyes',
    type: 'eyeshadow',
    finish: 'satin',
    description: 'Harmonized color quad',
    shades: [
      { id: 'eye-2-1', name: 'Rose Nude', rgb: [188, 143, 143], hex: '#BC8F8F' },
      { id: 'eye-2-2', name: 'Chocolate Lover', rgb: [139, 69, 19], hex: '#8B4513' },
      { id: 'eye-2-3', name: 'Smoky Eyes', rgb: [105, 105, 105], hex: '#696969' },
      { id: 'eye-2-4', name: 'Golden Hour', rgb: [218, 165, 32], hex: '#DAA520' },
    ],
    image: 'https://via.placeholder.com/100x100/BC8F8F/FFFFFF?text=CR'
  },
  {
    id: 'eye-3',
    name: 'The Nudes Palette',
    brand: 'Maybelline',
    category: 'eyes',
    type: 'eyeshadow',
    finish: 'mixed',
    description: '12-pan nude eyeshadow palette',
    shades: [
      { id: 'eye-3-1', name: 'Champagne', rgb: [247, 231, 206], hex: '#F7E7CE' },
      { id: 'eye-3-2', name: 'Mauve', rgb: [224, 176, 255], hex: '#E0B0FF' },
      { id: 'eye-3-3', name: 'Taupe', rgb: [72, 60, 50], hex: '#483C32' },
      { id: 'eye-3-4', name: 'Copper', rgb: [184, 115, 51], hex: '#B87333' },
    ],
    image: 'https://via.placeholder.com/100x100/F7E7CE/000000?text=TN'
  },
  {
    id: 'eye-4',
    name: 'City Mini Palette',
    brand: 'Maybelline',
    category: 'eyes',
    type: 'eyeshadow',
    finish: 'matte',
    description: 'Travel-friendly mini palette',
    shades: [
      { id: 'eye-4-1', name: 'Rooftop Bronzes', rgb: [205, 127, 50], hex: '#CD7F32' },
      { id: 'eye-4-2', name: 'Urban Jungle', rgb: [107, 142, 35], hex: '#6B8E23' },
      { id: 'eye-4-3', name: 'Chill Brunch', rgb: [255, 218, 185], hex: '#FFDAB9' },
      { id: 'eye-4-4', name: 'Downtown Sunrise', rgb: [255, 99, 71], hex: '#FF6347' },
    ],
    image: 'https://via.placeholder.com/100x100/CD7F32/FFFFFF?text=CM'
  },

  // EYELINER - 6 products
  {
    id: 'liner-1',
    name: 'Infallible Grip Liner',
    brand: "L'Oréal Paris",
    category: 'eyes',
    type: 'eyeliner',
    finish: 'matte',
    description: '36HR precision felt tip liner',
    shades: [
      { id: 'liner-1-1', name: 'Black', rgb: [0, 0, 0], hex: '#000000' },
      { id: 'liner-1-2', name: 'Brown', rgb: [101, 67, 33], hex: '#654321' },
      { id: 'liner-1-3', name: 'Blue', rgb: [0, 0, 128], hex: '#000080' },
    ],
    image: 'https://via.placeholder.com/100x100/000000/FFFFFF?text=IG'
  },
  {
    id: 'liner-2',
    name: 'Tattoo Studio Liner',
    brand: 'Maybelline',
    category: 'eyes',
    type: 'eyeliner',
    finish: 'matte',
    description: '36HR waterproof gel pencil',
    shades: [
      { id: 'liner-2-1', name: 'Intense Charcoal', rgb: [54, 69, 79], hex: '#36454F' },
      { id: 'liner-2-2', name: 'Deep Onyx', rgb: [0, 0, 0], hex: '#000000' },
      { id: 'liner-2-3', name: 'Smokey Grey', rgb: [128, 128, 128], hex: '#808080' },
    ],
    image: 'https://via.placeholder.com/100x100/36454F/FFFFFF?text=TS'
  },

  // MASCARA - 5 products
  {
    id: 'mascara-1',
    name: 'Lash Paradise',
    brand: "L'Oréal Paris",
    category: 'eyes',
    type: 'mascara',
    finish: 'voluminous',
    description: 'Voluminous lash paradise',
    shades: [
      { id: 'mascara-1-1', name: 'Blackest Black', rgb: [0, 0, 0], hex: '#000000' },
      { id: 'mascara-1-2', name: 'Black Brown', rgb: [59, 47, 47], hex: '#3B2F2F' },
    ],
    image: 'https://via.placeholder.com/100x100/000000/FFFFFF?text=LP'
  },
  {
    id: 'mascara-2',
    name: 'Sky High Mascara',
    brand: 'Maybelline',
    category: 'eyes',
    type: 'mascara',
    finish: 'lengthening',
    description: 'Limitless length & definition',
    shades: [
      { id: 'mascara-2-1', name: 'Blackest Black', rgb: [0, 0, 0], hex: '#000000' },
      { id: 'mascara-2-2', name: 'Waterproof Black', rgb: [28, 28, 28], hex: '#1C1C1C' },
    ],
    image: 'https://via.placeholder.com/100x100/1C1C1C/FFFFFF?text=SH'
  },

  // BROWS - 4 products
  {
    id: 'brow-1',
    name: 'Brow Stylist Definer',
    brand: "L'Oréal Paris",
    category: 'brows',
    type: 'brow',
    finish: 'precise',
    description: 'Ultra-fine tip brow pencil',
    shades: [
      { id: 'brow-1-1', name: 'Blonde', rgb: [150, 113, 23], hex: '#967117' },
      { id: 'brow-1-2', name: 'Light Brunette', rgb: [101, 67, 33], hex: '#654321' },
      { id: 'brow-1-3', name: 'Brunette', rgb: [77, 51, 25], hex: '#4D3319' },
      { id: 'brow-1-4', name: 'Dark Brunette', rgb: [54, 36, 18], hex: '#362412' },
    ],
    image: 'https://via.placeholder.com/100x100/654321/FFFFFF?text=BS'
  },
  {
    id: 'brow-2',
    name: 'TattooStudio Brow Gel',
    brand: 'Maybelline',
    category: 'brows',
    type: 'brow',
    finish: 'tinted',
    description: 'Waterproof brow gel',
    shades: [
      { id: 'brow-2-1', name: 'Blonde', rgb: [196, 164, 132], hex: '#C4A484' },
      { id: 'brow-2-2', name: 'Soft Brown', rgb: [145, 100, 62], hex: '#91643E' },
      { id: 'brow-2-3', name: 'Medium Brown', rgb: [101, 67, 33], hex: '#654321' },
      { id: 'brow-2-4', name: 'Deep Brown', rgb: [59, 47, 47], hex: '#3B2F2F' },
      { id: 'brow-2-5', name: 'Black Brown', rgb: [36, 36, 36], hex: '#242424' },
    ],
    image: 'https://via.placeholder.com/100x100/91643E/FFFFFF?text=TB'
  },
];

// Product categories for filtering
export const categories = [
  { id: 'all', name: 'All', icon: '✨' },
  { id: 'lips', name: 'Lips', icon: '💋' },
  { id: 'face', name: 'Face', icon: '🌸' },
  { id: 'eyes', name: 'Eyes', icon: '👁️' },
  { id: 'brows', name: 'Brows', icon: '🖌️' },
];

// Product types for sub-filtering
export const productTypes = {
  lips: ['lipstick', 'lip gloss', 'lip liner'],
  face: ['foundation', 'blush', 'contour', 'highlighter', 'concealer'],
  eyes: ['eyeshadow', 'eyeliner', 'mascara'],
  brows: ['brow pencil', 'brow gel', 'brow powder'],
};

// Skin type definitions
export const skinTypes = ['Oily', 'Dry', 'Combination', 'Normal', 'Sensitive'];

// Fitzpatrick scale skin tones
export const fitzpatrickScale = [
  { level: 1, name: 'Type I', description: 'Very fair, always burns', rgb: [255, 224, 189] },
  { level: 2, name: 'Type II', description: 'Fair, burns easily', rgb: [255, 205, 148] },
  { level: 3, name: 'Type III', description: 'Medium, sometimes burns', rgb: [234, 192, 134] },
  { level: 4, name: 'Type IV', description: 'Olive, rarely burns', rgb: [190, 136, 85] },
  { level: 5, name: 'Type V', description: 'Brown, very rarely burns', rgb: [139, 90, 43] },
  { level: 6, name: 'Type VI', description: 'Dark brown, never burns', rgb: [89, 47, 29] },
];

// Skin concerns for analysis with metadata
export const skinConcerns = [
  { name: 'Fine Lines', category: 'aging', severity: ['mild', 'moderate', 'severe'] },
  { name: 'Wrinkles', category: 'aging', severity: ['mild', 'moderate', 'severe'] },
  { name: 'Dark Spots', category: 'pigmentation', severity: ['mild', 'moderate', 'severe'] },
  { name: 'Acne', category: 'texture', severity: ['mild', 'moderate', 'severe'] },
  { name: 'Redness', category: 'sensitivity', severity: ['mild', 'moderate', 'severe'] },
  { name: 'Dryness', category: 'hydration', severity: ['mild', 'moderate', 'severe'] },
  { name: 'Oiliness', category: 'sebum', severity: ['mild', 'moderate', 'severe'] },
  { name: 'Large Pores', category: 'texture', severity: ['mild', 'moderate', 'severe'] },
  { name: 'Uneven Tone', category: 'pigmentation', severity: ['mild', 'moderate', 'severe'] },
  { name: 'Dullness', category: 'radiance', severity: ['mild', 'moderate', 'severe'] }
];

// Concern names for backward compatibility
export const skinConcernNames = skinConcerns.map(c => c.name);

// Product recommendations based on skin concerns
export const concernRecommendations = {
  'Redness': {
    primerType: 'color-correcting',
    foundationFinish: ['natural', 'satin'],
    avoidFinish: ['shimmer'],
    tip: 'Green color-correcting primers help neutralize redness'
  },
  'Dark Spots': {
    primerType: 'illuminating',
    foundationFinish: ['natural', 'matte'],
    avoidFinish: [],
    tip: 'Look for products with brightening ingredients'
  },
  'Large Pores': {
    primerType: 'pore-minimizing',
    foundationFinish: ['matte', 'natural'],
    avoidFinish: ['dewy', 'shimmer'],
    tip: 'Pore-filling primers create a smoother base'
  },
  'Dullness': {
    primerType: 'illuminating',
    foundationFinish: ['natural', 'satin'],
    avoidFinish: ['matte'],
    tip: 'Luminous products add healthy radiance'
  },
  'Oiliness': {
    primerType: 'mattifying',
    foundationFinish: ['matte'],
    avoidFinish: ['dewy', 'shimmer'],
    tip: 'Oil-free formulas help control shine'
  },
  'Dryness': {
    primerType: 'hydrating',
    foundationFinish: ['dewy', 'satin'],
    avoidFinish: ['matte'],
    tip: 'Cream-based products add moisture'
  },
  'Uneven Tone': {
    primerType: 'color-correcting',
    foundationFinish: ['natural', 'satin'],
    avoidFinish: [],
    tip: 'Full-coverage foundations help even out skin tone'
  }
};

// Get recommended products based on skin analysis
export function getRecommendedProducts(skinType, fitzpatrickLevel, concerns) {
  const recommendations = [];

  // Get concern names for filtering
  const concernNames = concerns ? concerns.map(c => c.name || c) : [];

  // Determine preferred foundation finish based on skin type and concerns
  let preferredFinishes = ['natural'];
  let avoidFinishes = [];

  // Adjust finish preferences based on skin type
  switch (skinType) {
    case 'Oily':
      preferredFinishes = ['matte'];
      avoidFinishes = ['dewy', 'shimmer'];
      break;
    case 'Dry':
      preferredFinishes = ['dewy', 'satin', 'natural'];
      avoidFinishes = ['matte'];
      break;
    case 'Combination':
      preferredFinishes = ['natural', 'satin'];
      break;
    case 'Sensitive':
      preferredFinishes = ['natural', 'satin'];
      break;
  }

  // Further adjust based on concerns
  concernNames.forEach(concern => {
    const rec = concernRecommendations[concern];
    if (rec) {
      // Add preferred finishes from concerns
      rec.foundationFinish.forEach(finish => {
        if (!preferredFinishes.includes(finish)) {
          preferredFinishes.push(finish);
        }
      });
      // Add finishes to avoid
      rec.avoidFinish.forEach(finish => {
        if (!avoidFinishes.includes(finish)) {
          avoidFinishes.push(finish);
        }
      });
    }
  });

  // Foundation recommendations based on skin type, tone, and concerns
  const foundations = products.filter(p => p.type === 'foundation');

  // Score and sort foundations by suitability
  const scoredFoundations = foundations.map(foundation => {
    let score = 50; // Base score

    // Check finish compatibility
    if (preferredFinishes.includes(foundation.finish)) score += 30;
    if (avoidFinishes.includes(foundation.finish)) score -= 40;

    // Check for matching shades
    const matchingShades = foundation.shades.filter(s =>
      s.fitzpatrick && Math.abs(s.fitzpatrick - fitzpatrickLevel) <= 1
    );
    if (matchingShades.length > 0) score += 20;

    return { foundation, score, matchingShades };
  }).filter(f => f.score > 30 && f.matchingShades.length > 0)
    .sort((a, b) => b.score - a.score);

  // Add top foundation recommendations
  scoredFoundations.slice(0, 2).forEach(({ foundation, matchingShades }) => {
    const reasons = [];
    reasons.push(`${foundation.finish} finish suits ${skinType.toLowerCase()} skin`);
    if (concernNames.length > 0) {
      const relevantConcerns = concernNames.filter(c =>
        concernRecommendations[c]?.foundationFinish.includes(foundation.finish)
      );
      if (relevantConcerns.length > 0) {
        reasons.push(`helps with ${relevantConcerns[0].toLowerCase()}`);
      }
    }

    recommendations.push({
      product: foundation,
      recommendedShade: matchingShades[0],
      reason: reasons.join(', '),
      matchScore: Math.round((matchingShades.length / foundation.shades.length) * 100)
    });
  });

  // Blush recommendations - consider redness concern
  const blushes = products.filter(p => p.type === 'blush');
  if (blushes.length > 0 && !concernNames.includes('Redness')) {
    recommendations.push({
      product: blushes[0],
      recommendedShade: blushes[0].shades[0],
      reason: 'Natural flush for a healthy glow'
    });
  } else if (blushes.length > 0) {
    // For redness concerns, recommend a softer shade
    const softShade = blushes[0].shades.find(s =>
      s.name.toLowerCase().includes('soft') || s.name.toLowerCase().includes('nude')
    ) || blushes[0].shades[blushes[0].shades.length - 1];
    recommendations.push({
      product: blushes[0],
      recommendedShade: softShade,
      reason: 'Soft shade that won\'t emphasize redness'
    });
  }

  // Lipstick recommendations
  const lipsticks = products.filter(p => p.category === 'lips').slice(0, 3);
  lipsticks.forEach(lip => {
    recommendations.push({
      product: lip,
      recommendedShade: lip.shades[0],
      reason: `${lip.finish} finish, long-wearing formula`
    });
  });

  return recommendations.slice(0, 6);
}

export default products;
