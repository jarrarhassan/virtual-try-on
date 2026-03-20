import { useRef, useState } from 'react';
import useStore from '../store/useStore';
import html2canvas from 'html2canvas';
import {
  FiCamera,
  FiHeart,
  FiSliders,
  FiMoreHorizontal,
  FiDownload,
  FiShare2,
  FiRefreshCw,
  FiX,
} from 'react-icons/fi';

const Toolbar = ({ onShowFavorites, onShowAnalysis }) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [saveConfirm, setSaveConfirm] = useState(false);

  const {
    isCompareMode,
    setCompareMode,
    comparePosition,
    setComparePosition,
    selectedProducts,
    selectedShades,
    makeupIntensity,
    addFavorite,
    getCurrentLook,
    clearAllProducts,
    setCapturedImage,
  } = useStore();

  const compareSliderRef = useRef(null);

  // Check if any makeup is applied
  const hasMakeup = Object.values(selectedProducts).some(p => p !== null);

  // Capture current look as image
  const handleCapture = async () => {
    const videoContainer = document.querySelector('.video-container');
    if (!videoContainer) return;

    try {
      const canvas = await html2canvas(videoContainer, {
        useCORS: true,
        scale: 2,
      });
      const imageData = canvas.toDataURL('image/png');
      setCapturedImage(imageData);

      // Download image
      const link = document.createElement('a');
      link.download = `beauty-look-${Date.now()}.png`;
      link.href = imageData;
      link.click();
    } catch (err) {
      console.error('Capture failed:', err);
    }
  };

  // Save current look to favorites
  const handleSaveFavorite = () => {
    if (!hasMakeup) return;

    const look = getCurrentLook();
    addFavorite({
      ...look,
      name: `Look ${Date.now()}`,
      preview: null,
    });

    // Show feedback
    setSaveConfirm(true);
    setTimeout(() => setSaveConfirm(false), 2000);
  };

  // Share look
  const handleShare = async () => {
    const videoContainer = document.querySelector('.video-container');
    if (!videoContainer) return;

    try {
      const canvas = await html2canvas(videoContainer, { useCORS: true, scale: 2 });
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));

      if (navigator.share && blob) {
        await navigator.share({
          title: 'My Beauty Look',
          text: 'Check out my virtual makeup look!',
          files: [new File([blob], 'beauty-look.png', { type: 'image/png' })],
        });
      } else {
        // Fallback: download
        handleCapture();
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
    setShowMoreMenu(false);
  };

  // Handle compare slider drag
  const handleCompareSliderChange = (e) => {
    setComparePosition(parseInt(e.target.value));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main toolbar - 3 core actions */}
      <div className="flex items-center justify-center gap-3 p-4 bg-white rounded-2xl shadow-soft border border-neutral-100">
        {/* Capture button */}
        <button
          onClick={handleCapture}
          className="btn-icon"
          title="Capture"
        >
          <FiCamera className="w-5 h-5" />
        </button>

        {/* Compare toggle */}
        <button
          onClick={() => setCompareMode(!isCompareMode)}
          className={`btn-icon ${isCompareMode ? 'active' : ''}`}
          title="Compare Before/After"
        >
          <FiSliders className="w-5 h-5" />
        </button>

        {/* Save to favorites */}
        <div className="relative">
          <button
            onClick={handleSaveFavorite}
            disabled={!hasMakeup}
            className={`btn-icon ${!hasMakeup ? 'opacity-40 cursor-not-allowed' : ''} ${
              saveConfirm ? 'bg-gold text-charcoal border-gold' : ''
            }`}
            title="Save Look"
          >
            <FiHeart className={`w-5 h-5 ${saveConfirm ? 'fill-current' : ''}`} />
          </button>

          {/* Save confirmation tooltip */}
          {saveConfirm && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-charcoal text-cream text-xs font-medium rounded-lg whitespace-nowrap animate-fade-in">
              Saved
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-neutral-200 mx-1" />

        {/* More options */}
        <div className="relative">
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className={`btn-icon ${showMoreMenu ? 'active' : ''}`}
            title="More options"
          >
            <FiMoreHorizontal className="w-5 h-5" />
          </button>

          {/* More menu dropdown */}
          {showMoreMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowMoreMenu(false)}
              />
              <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-xl shadow-elevated border border-neutral-100 overflow-hidden z-50 animate-scale-in">
                <button
                  onClick={handleShare}
                  disabled={!hasMakeup}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-charcoal hover:bg-neutral-50 transition-colors ${
                    !hasMakeup ? 'opacity-40 cursor-not-allowed' : ''
                  }`}
                >
                  <FiShare2 className="w-4 h-4 text-muted" />
                  Share Look
                </button>
                <button
                  onClick={() => {
                    handleCapture();
                    setShowMoreMenu(false);
                  }}
                  disabled={!hasMakeup}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-charcoal hover:bg-neutral-50 transition-colors ${
                    !hasMakeup ? 'opacity-40 cursor-not-allowed' : ''
                  }`}
                >
                  <FiDownload className="w-4 h-4 text-muted" />
                  Download
                </button>
                <div className="border-t border-neutral-100" />
                <button
                  onClick={onShowAnalysis}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-charcoal hover:bg-neutral-50 transition-colors"
                >
                  <span className="w-4 h-4 flex items-center justify-center text-muted">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </span>
                  Skin Analysis
                </button>
                {hasMakeup && (
                  <>
                    <div className="border-t border-neutral-100" />
                    <button
                      onClick={() => {
                        clearAllProducts();
                        setShowMoreMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-muted hover:bg-neutral-50 transition-colors"
                    >
                      <FiRefreshCw className="w-4 h-4" />
                      Clear All
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Compare slider (when compare mode is active) */}
      {isCompareMode && (
        <div className="p-4 bg-white rounded-2xl shadow-soft border border-neutral-100 animate-slide-up">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted font-medium w-14">Before</span>
            <input
              ref={compareSliderRef}
              type="range"
              min="0"
              max="100"
              value={comparePosition}
              onChange={handleCompareSliderChange}
              className="flex-1"
            />
            <span className="text-sm text-muted font-medium w-14 text-right">After</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Toolbar;
