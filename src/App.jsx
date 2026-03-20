import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LandingPage } from './components/landing';
import Camera from './components/Camera';
import ProductCatalog from './components/ProductCatalog';
import SkinAnalysis from './components/SkinAnalysis';
import Favorites from './components/Favorites';
import Tutorial from './components/Tutorial';
import Toolbar from './components/Toolbar';
import useStore from './store/useStore';
import { FiMenu, FiX, FiArrowLeft } from 'react-icons/fi';

function TryOnApp({ onBack }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePanel, setActivePanel] = useState('collection');
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
    setActivePanel('saved');
    if (isMobile) setSidebarOpen(true);
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Tutorial overlay */}
      <Tutorial />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-cream/90 backdrop-blur-lg border-b border-neutral-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Back button */}
            <button
              onClick={onBack}
              className="p-2 hover:bg-neutral-100 rounded-full transition-luxury"
            >
              <FiArrowLeft className="w-5 h-5 text-charcoal" />
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-neutral-100 rounded-lg transition-luxury"
            >
              {sidebarOpen ? (
                <FiX className="w-5 h-5 text-charcoal" />
              ) : (
                <FiMenu className="w-5 h-5 text-charcoal" />
              )}
            </button>

            {/* Logo */}
            <h1 className="text-2xl font-serif font-medium text-charcoal tracking-tight">
              Beauty Try-On
            </h1>
          </div>

          {/* Status badges */}
          <div className="flex items-center gap-3">
            {appliedCount > 0 && (
              <span className="status-badge bg-gold/10 text-gold-dark">
                {appliedCount} applied
              </span>
            )}
            <span className={`status-badge ${
              isFaceDetected ? 'status-ready' : 'status-waiting'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                isFaceDetected ? 'bg-gold' : 'bg-muted animate-pulse'
              }`} />
              {isFaceDetected ? 'Ready' : 'Detecting'}
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-[73px] min-h-screen flex">
        {/* Camera section */}
        <div className={`flex-1 p-6 transition-all duration-300 ${
          sidebarOpen && !isMobile ? 'mr-[400px]' : ''
        }`}>
          <div className="max-w-3xl mx-auto">
            {/* Video container */}
            <div className="video-container mb-6">
              <Camera />
            </div>

            {/* Toolbar */}
            <Toolbar
              onShowFavorites={handleShowFavorites}
              onShowAnalysis={handleShowAnalysis}
            />

            {/* Applied products summary */}
            {appliedCount > 0 && (
              <div className="mt-6 p-5 bg-white rounded-2xl border border-neutral-100 animate-slide-up">
                <h3 className="text-sm font-medium text-muted mb-3 tracking-wide uppercase">
                  Current Look
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(selectedProducts)
                    .filter(([_, product]) => product !== null)
                    .map(([key, product]) => {
                      const shade = useStore.getState().selectedShades[key];
                      return (
                        <div
                          key={key}
                          className="flex items-center gap-2 px-4 py-2 bg-cream rounded-full transition-luxury hover:bg-neutral-100"
                        >
                          <div
                            className="w-4 h-4 rounded-full shadow-soft"
                            style={{ backgroundColor: shade?.hex || '#f0f0f0' }}
                          />
                          <span className="text-sm text-charcoal font-medium">
                            {product.name}
                          </span>
                          <button
                            onClick={() => useStore.getState().clearProduct(key)}
                            className="ml-1 text-muted hover:text-charcoal transition-colors"
                          >
                            <FiX className="w-3.5 h-3.5" />
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
        <aside className={`fixed top-[73px] right-0 bottom-0 w-[400px] bg-white border-l border-neutral-100 transform transition-transform duration-300 z-30 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {/* Panel tabs */}
          <div className="flex border-b border-neutral-100">
            <button
              onClick={() => setActivePanel('collection')}
              className={`flex-1 py-4 px-4 text-sm font-medium tracking-wide transition-luxury ${
                activePanel === 'collection'
                  ? 'text-charcoal border-b-2 border-charcoal'
                  : 'text-muted hover:text-charcoal'
              }`}
            >
              Collection
            </button>
            <button
              onClick={() => setActivePanel('analysis')}
              className={`flex-1 py-4 px-4 text-sm font-medium tracking-wide transition-luxury ${
                activePanel === 'analysis'
                  ? 'text-charcoal border-b-2 border-charcoal'
                  : 'text-muted hover:text-charcoal'
              }`}
            >
              Analysis
            </button>
            <button
              onClick={() => setActivePanel('saved')}
              className={`flex-1 py-4 px-4 text-sm font-medium tracking-wide transition-luxury ${
                activePanel === 'saved'
                  ? 'text-charcoal border-b-2 border-charcoal'
                  : 'text-muted hover:text-charcoal'
              }`}
            >
              Saved
            </button>
          </div>

          {/* Panel content */}
          <div className="h-[calc(100%-57px)] overflow-hidden">
            {activePanel === 'collection' && <ProductCatalog />}
            {activePanel === 'analysis' && (
              <SkinAnalysis onClose={() => setActivePanel('collection')} />
            )}
            {activePanel === 'saved' && (
              <Favorites onClose={() => setActivePanel('collection')} />
            )}
          </div>
        </aside>

        {/* Mobile overlay */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </main>

      {/* Mobile bottom nav */}
      {isMobile && !sidebarOpen && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100 z-30">
          <div className="flex justify-around py-3">
            <button
              onClick={() => {
                setActivePanel('collection');
                setSidebarOpen(true);
              }}
              className="flex flex-col items-center py-2 px-4"
            >
              <span className="text-xs text-muted font-medium tracking-wide">Collection</span>
            </button>
            <button
              onClick={() => {
                setActivePanel('analysis');
                setSidebarOpen(true);
              }}
              className="flex flex-col items-center py-2 px-4"
            >
              <span className="text-xs text-muted font-medium tracking-wide">Analysis</span>
            </button>
            <button
              onClick={() => {
                setActivePanel('saved');
                setSidebarOpen(true);
              }}
              className="flex flex-col items-center py-2 px-4"
            >
              <span className="text-xs text-muted font-medium tracking-wide">Saved</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}

function App() {
  const [view, setView] = useState('landing'); // 'landing' or 'app'

  return (
    <AnimatePresence mode="wait">
      {view === 'landing' ? (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LandingPage onEnterApp={() => setView('app')} />
        </motion.div>
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TryOnApp onBack={() => setView('landing')} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
