import { useRef } from 'react';
import useStore from '../store/useStore';
import html2canvas from 'html2canvas';
import {
  FiCamera,
  FiHeart,
  FiShare2,
  FiSliders,
  FiDownload,
  FiRefreshCw,
  FiMaximize2,
} from 'react-icons/fi';

const Toolbar = ({ onShowFavorites, onShowAnalysis }) => {
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
      preview: null, // Could capture preview image
    });

    // Show feedback
    alert('Look saved to favorites!');
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
        // Fallback: copy to clipboard
        const imageData = canvas.toDataURL('image/png');
        await navigator.clipboard.writeText(imageData);
        alert('Image copied to clipboard!');
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  // Handle compare slider drag
  const handleCompareSliderChange = (e) => {
    setComparePosition(parseInt(e.target.value));
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Main toolbar */}
      <div className="flex items-center justify-center gap-2 p-3 bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg">
        {/* Capture button */}
        <button
          onClick={handleCapture}
          className="btn-icon"
          title="Capture photo"
        >
          <FiCamera className="w-5 h-5 text-gray-700" />
        </button>

        {/* Save to favorites */}
        <button
          onClick={handleSaveFavorite}
          disabled={!hasMakeup}
          className={`btn-icon ${!hasMakeup ? 'opacity-50 cursor-not-allowed' : ''}`}
          title="Save to favorites"
        >
          <FiHeart className="w-5 h-5 text-pink-500" />
        </button>

        {/* Compare toggle */}
        <button
          onClick={() => setCompareMode(!isCompareMode)}
          className={`btn-icon ${isCompareMode ? 'bg-pink-100 ring-2 ring-pink-500' : ''}`}
          title="Before/After compare"
        >
          <FiSliders className="w-5 h-5 text-gray-700" />
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          disabled={!hasMakeup}
          className={`btn-icon ${!hasMakeup ? 'opacity-50 cursor-not-allowed' : ''}`}
          title="Share look"
        >
          <FiShare2 className="w-5 h-5 text-gray-700" />
        </button>

        {/* Download */}
        <button
          onClick={handleCapture}
          disabled={!hasMakeup}
          className={`btn-icon ${!hasMakeup ? 'opacity-50 cursor-not-allowed' : ''}`}
          title="Download image"
        >
          <FiDownload className="w-5 h-5 text-gray-700" />
        </button>

        {/* View favorites */}
        <button
          onClick={onShowFavorites}
          className="btn-icon"
          title="View favorites"
        >
          <FiMaximize2 className="w-5 h-5 text-gray-700" />
        </button>

        {/* Clear all */}
        {hasMakeup && (
          <button
            onClick={clearAllProducts}
            className="btn-icon"
            title="Clear all makeup"
          >
            <FiRefreshCw className="w-5 h-5 text-gray-700" />
          </button>
        )}
      </div>

      {/* Compare slider (when compare mode is active) */}
      {isCompareMode && (
        <div className="p-3 bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 w-16">Before</span>
            <input
              ref={compareSliderRef}
              type="range"
              min="0"
              max="100"
              value={comparePosition}
              onChange={handleCompareSliderChange}
              className="flex-1"
            />
            <span className="text-sm text-gray-600 w-16 text-right">After</span>
          </div>
        </div>
      )}

      {/* Quick skin analysis button */}
      <button
        onClick={onShowAnalysis}
        className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
      >
        ✨ Analyze My Skin
      </button>
    </div>
  );
};

export default Toolbar;
