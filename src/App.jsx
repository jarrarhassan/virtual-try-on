import { useState, useEffect } from 'react';
import Camera from './components/Camera';
import ProductCatalog from './components/ProductCatalog';
import SkinAnalysis from './components/SkinAnalysis';
import Toolbar from './components/Toolbar';
import Favorites from './components/Favorites';
import Tutorial from './components/Tutorial';
import useStore from './store/useStore';
import { FiMenu, FiX, FiHeart, FiGrid, FiZap } from 'react-icons/fi';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePanel, setActivePanel] = useState('products'); // 'products', 'analysis', 'favorites'
  const [isMobile, setIsMobile] = useState(false);

  const { selectedProducts, isFaceDetected } = useStore();

  // Check if any makeup is applied
  const appliedCount = Object.values(selectedProducts).filter(p => p !== null).length;

  // Handle responsive design
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleShowAnalysis = () => {
    setActivePanel('analysis');
    if (isMobile) setSidebarOpen(true);
  };

  const handleShowFavorites = () => {
    setActivePanel('favorites');
    if (isMobile) setSidebarOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Tutorial overlay */}
      <Tutorial />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-pink-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? (
                <FiX className="w-6 h-6 text-gray-700" />
              ) : (
                <FiMenu className="w-6 h-6 text-gray-700" />
              )}
            </button>

            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className="text-2xl">💄</span>
              <h1 className="text-xl font-display font-bold text-gradient">
                Beauty Try-On
              </h1>
            </div>
          </div>

          {/* Status badges */}
          <div className="flex items-center gap-2">
            {appliedCount > 0 && (
              <span className="px-3 py-1 bg-pink-100 text-pink-700 text-sm font-medium rounded-full">
                {appliedCount} applied
              </span>
            )}
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
              isFaceDetected
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {isFaceDetected ? '✓ Ready' : '○ No face'}
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-16 min-h-screen flex">
        {/* Camera section */}
        <div className={`flex-1 p-4 transition-all duration-300 ${
          sidebarOpen && !isMobile ? 'mr-[380px]' : ''
        }`}>
          <div className="max-w-3xl mx-auto">
            {/* Video container */}
            <div className="video-container mb-4">
              <Camera />
            </div>

            {/* Toolbar */}
            <Toolbar
              onShowFavorites={handleShowFavorites}
              onShowAnalysis={handleShowAnalysis}
            />

            {/* Applied products summary */}
            {appliedCount > 0 && (
              <div className="mt-4 p-4 bg-white/80 backdrop-blur rounded-2xl">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Applied Makeup</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(selectedProducts)
                    .filter(([_, product]) => product !== null)
                    .map(([key, product]) => {
                      const shade = useStore.getState().selectedShades[key];
                      return (
                        <div
                          key={key}
                          className="flex items-center gap-2 px-3 py-1.5 bg-pink-50 rounded-full"
                        >
                          <div
                            className="w-4 h-4 rounded-full border border-white shadow-sm"
                            style={{ backgroundColor: shade?.hex || '#f0f0f0' }}
                          />
                          <span className="text-sm text-gray-700">{product.name}</span>
                          <button
                            onClick={() => useStore.getState().clearProduct(key)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className={`fixed top-16 right-0 bottom-0 w-[380px] border-l border-pink-100 bg-white/50 backdrop-blur-sm transform transition-transform duration-300 z-30 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {/* Panel tabs */}
          <div className="flex border-b border-pink-100 bg-white">
            <button
              onClick={() => setActivePanel('products')}
              className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 font-medium transition-colors ${
                activePanel === 'products'
                  ? 'text-pink-600 border-b-2 border-pink-500 bg-pink-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FiGrid className="w-4 h-4" />
              Products
            </button>
            <button
              onClick={() => setActivePanel('analysis')}
              className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 font-medium transition-colors ${
                activePanel === 'analysis'
                  ? 'text-pink-600 border-b-2 border-pink-500 bg-pink-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FiZap className="w-4 h-4" />
              Skin Genius
            </button>
            <button
              onClick={() => setActivePanel('favorites')}
              className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 font-medium transition-colors ${
                activePanel === 'favorites'
                  ? 'text-pink-600 border-b-2 border-pink-500 bg-pink-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FiHeart className="w-4 h-4" />
              Saved
            </button>
          </div>

          {/* Panel content */}
          <div className="h-[calc(100%-49px)] overflow-hidden">
            {activePanel === 'products' && <ProductCatalog />}
            {activePanel === 'analysis' && (
              <SkinAnalysis onClose={() => setActivePanel('products')} />
            )}
            {activePanel === 'favorites' && (
              <Favorites onClose={() => setActivePanel('products')} />
            )}
          </div>
        </aside>

        {/* Mobile overlay */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </main>

      {/* Mobile bottom nav */}
      {isMobile && !sidebarOpen && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-pink-100 z-30">
          <div className="flex justify-around py-2">
            <button
              onClick={() => {
                setActivePanel('products');
                setSidebarOpen(true);
              }}
              className="flex flex-col items-center py-2 px-4"
            >
              <FiGrid className="w-6 h-6 text-pink-500" />
              <span className="text-xs text-gray-600 mt-1">Products</span>
            </button>
            <button
              onClick={() => {
                setActivePanel('analysis');
                setSidebarOpen(true);
              }}
              className="flex flex-col items-center py-2 px-4"
            >
              <FiZap className="w-6 h-6 text-gray-500" />
              <span className="text-xs text-gray-600 mt-1">Analyze</span>
            </button>
            <button
              onClick={() => {
                setActivePanel('favorites');
                setSidebarOpen(true);
              }}
              className="flex flex-col items-center py-2 px-4"
            >
              <FiHeart className="w-6 h-6 text-gray-500" />
              <span className="text-xs text-gray-600 mt-1">Saved</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}

export default App;
