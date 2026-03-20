# 💄 Beauty Try-On - Virtual Makeup Experience

A production-ready web application for virtual cosmetics try-on, inspired by L'Oréal Paris Beauty Genius. Built with React, Vite, MediaPipe Face Mesh, and Tailwind CSS.

## ✨ Features

### 🎨 Live Camera Try-On
- **Real-time AR makeup overlay** using MediaPipe Face Mesh (468 landmarks)
- **Lipstick**: 20+ shades with matte, gloss, and vinyl finishes
- **Eyeshadow**: Multiple palettes with realistic lid/crease application
- **Eyeliner & Mascara**: Precise lash line tracking
- **Foundation**: Auto skin tone matching with 10+ tones
- **Blush & Contour**: Cheekbone-aware application
- **Brows**: Fill and shape enhancement
- **Adjustable intensity** for all products (0-100%)

### 🔬 Skin Genius Analysis
- **Skin type detection** (Oily, Dry, Combination, Normal, Sensitive)
- **Fitzpatrick scale** skin tone classification
- **Undertone analysis** (Warm, Cool, Neutral)
- **Personalized product recommendations**
- **Beauty tips** based on your skin profile

### 📦 Product Catalog
- **50+ demo products** from L'Oréal, Maybelline, and more
- **Filter by category**: Lips, Face, Eyes, Brows
- **Shade swatches** with quick preview
- **Product details**: Brand, finish, description

### 🔄 Before/After Compare
- **Slider-based comparison** of original vs. made-up face
- **Toggle mode** for quick switching

### 💖 Favorites & Sharing
- **Save complete looks** to local storage
- **Apply saved looks** instantly
- **Download images** of your makeup
- **Share to social media** (Web Share API)

### 📱 Mobile Responsive
- **Optimized for mobile** devices
- **Bottom navigation** for touch-friendly access
- **Collapsible sidebar** for more camera space

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Modern browser (Chrome/Safari recommended)
- Webcam access

### Installation

```bash
# Navigate to the project
cd virtual-try-on

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

### Build for Production

```bash
# Build optimized bundle
npm run build

# Preview production build
npm run preview
```

## 🌐 Deploy to Vercel/Netlify

### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify
```bash
# Build first
npm run build

# Drag & drop the 'dist' folder to Netlify
# Or use Netlify CLI:
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Styling |
| **MediaPipe Face Mesh** | Face landmark detection (468 points) |
| **Zustand** | State management |
| **html2canvas** | Screenshot capture |
| **react-icons** | Icon library |

## 📁 Project Structure

```
virtual-try-on/
├── src/
│   ├── components/
│   │   ├── Camera.jsx         # Camera & face mesh rendering
│   │   ├── ProductCatalog.jsx # Product browsing & selection
│   │   ├── SkinAnalysis.jsx   # AI skin analysis
│   │   ├── Toolbar.jsx        # Controls & actions
│   │   ├── Favorites.jsx      # Saved looks
│   │   └── Tutorial.jsx       # Onboarding wizard
│   ├── data/
│   │   └── products.js        # 50+ product catalog
│   ├── store/
│   │   └── useStore.js        # Zustand state management
│   ├── utils/
│   │   ├── landmarks.js       # Face landmark indices
│   │   ├── makeupRenderer.js  # Canvas 2D makeup rendering
│   │   └── skinAnalysis.js    # Skin analysis algorithms
│   ├── App.jsx                # Main application
│   ├── main.jsx               # Entry point
│   └── index.css              # Tailwind styles
├── index.html                 # HTML template
├── tailwind.config.js         # Tailwind configuration
├── vite.config.js             # Vite configuration
└── package.json
```

## 🎨 Customization

### Adding New Products

Edit `src/data/products.js`:

```javascript
{
  id: 'unique-id',
  name: 'Product Name',
  brand: 'Brand Name',
  category: 'lips', // lips, face, eyes, brows
  type: 'lipstick', // lipstick, foundation, blush, etc.
  finish: 'matte', // matte, gloss, satin, etc.
  description: 'Product description',
  shades: [
    { id: 'shade-1', name: 'Shade Name', rgb: [255, 0, 0], hex: '#FF0000' },
    // More shades...
  ],
}
```

### Adjusting Makeup Rendering

Edit `src/utils/makeupRenderer.js` to customize:
- Blend modes
- Alpha/opacity values
- Blur amounts
- Rendering order

### Modifying Face Landmarks

Edit `src/utils/landmarks.js` to adjust:
- Lip contour points
- Eye region indices
- Cheek/contour areas
- Brow positions

## 📝 Browser Support

| Browser | Support |
|---------|---------|
| Chrome 80+ | ✅ Full |
| Safari 14+ | ✅ Full |
| Firefox 80+ | ✅ Full |
| Edge 80+ | ✅ Full |

**Note**: Requires HTTPS for camera access in production.

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🙏 Acknowledgments

- [MediaPipe](https://mediapipe.dev/) for face mesh technology
- [L'Oréal Paris Beauty Genius](https://www.lorealparisusa.com/beauty-genius) for inspiration
- [Tailwind CSS](https://tailwindcss.com/) for styling utilities

---

Built with ❤️ using AI assistance
