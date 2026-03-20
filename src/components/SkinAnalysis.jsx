import { useState, useRef } from 'react';
import useStore from '../store/useStore';
import { performSkinAnalysis, generateSkinTips } from '../utils/skinAnalysis';
import { FiCamera, FiUpload, FiRefreshCw, FiCheck, FiStar } from 'react-icons/fi';

const SkinAnalysis = ({ onClose }) => {
  const { skinAnalysis, setSkinAnalysis, faceLandmarks, setSelectedProduct, setSelectedShade } = useStore();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  // Capture from video
  const handleCapture = async () => {
    const video = document.querySelector('video');
    if (!video || !faceLandmarks) {
      alert('Please ensure your face is visible in the camera');
      return;
    }

    setIsAnalyzing(true);

    // Create canvas from video
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Perform analysis
    setTimeout(() => {
      const analysis = performSkinAnalysis(imageData, faceLandmarks, canvas.width, canvas.height);
      setSkinAnalysis(analysis);
      setCapturedImage(canvas.toDataURL());
      setIsAnalyzing(false);
    }, 1500); // Simulated processing time
  };

  // Upload image
  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Simulated landmarks for uploaded image
        const mockLandmarks = Array(468).fill(null).map((_, i) => ({
          x: 0.5 + (Math.random() - 0.5) * 0.3,
          y: 0.5 + (Math.random() - 0.5) * 0.3,
          z: 0
        }));

        setTimeout(() => {
          const analysis = performSkinAnalysis(imageData, mockLandmarks, canvas.width, canvas.height);
          setSkinAnalysis(analysis);
          setCapturedImage(event.target.result);
          setIsAnalyzing(false);
        }, 1500);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Apply recommended product
  const handleApplyRecommendation = (recommendation) => {
    const { product, recommendedShade } = recommendation;
    const typeMap = {
      'lipstick': 'lips',
      'foundation': 'foundation',
      'blush': 'blush',
    };
    const key = typeMap[product.type] || product.category;
    setSelectedProduct(key, product);
    setSelectedShade(key, recommendedShade);
    onClose?.();
  };

  const tips = skinAnalysis ? generateSkinTips(skinAnalysis) : [];

  return (
    <div className="h-full flex flex-col bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-pink-100 bg-gradient-to-r from-pink-500 to-rose-500">
        <h2 className="text-xl font-display font-semibold text-white">Skin Genius</h2>
        <p className="text-pink-100 text-sm">AI-powered skin analysis</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Capture section */}
        {!skinAnalysis && (
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCamera className="w-10 h-10 text-pink-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Analyze Your Skin</h3>
              <p className="text-gray-600 text-sm">
                Get personalized product recommendations based on your skin type, tone, and concerns.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleCapture}
                disabled={isAnalyzing || !faceLandmarks}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <FiRefreshCw className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FiCamera className="w-5 h-5" />
                    Capture & Analyze
                  </>
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white text-gray-500 text-sm">or</span>
                </div>
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalyzing}
                className="w-full btn-secondary flex items-center justify-center gap-2"
              >
                <FiUpload className="w-5 h-5" />
                Upload Photo
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
              />
            </div>

            {!faceLandmarks && (
              <p className="text-center text-amber-600 text-sm mt-4 bg-amber-50 p-3 rounded-lg">
                Please position your face in the camera for live capture
              </p>
            )}
          </div>
        )}

        {/* Results section */}
        {skinAnalysis && (
          <div className="p-4 space-y-4">
            {/* Captured image */}
            {capturedImage && (
              <div className="relative rounded-2xl overflow-hidden mb-4">
                <img src={capturedImage} alt="Analyzed" className="w-full h-40 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white font-medium">Analysis Complete</p>
                  <p className="text-white/80 text-sm">
                    {new Date(skinAnalysis.analyzedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}

            {/* Overall Score */}
            <div className="analysis-card">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-800">Skin Health Score</h4>
                <div className="flex items-center gap-1">
                  <FiStar className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-2xl font-bold text-pink-600">{skinAnalysis.overallScore}</span>
                  <span className="text-gray-500">/100</span>
                </div>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-500"
                  style={{ width: `${skinAnalysis.overallScore}%` }}
                />
              </div>
            </div>

            {/* Confidence Indicator */}
            {skinAnalysis.confidence && (
              <div className="analysis-card">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">Analysis Confidence</h4>
                  <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                    skinAnalysis.confidence.overall >= 70 ? 'bg-green-100 text-green-700' :
                    skinAnalysis.confidence.overall >= 50 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {skinAnalysis.confidence.overall}%
                  </span>
                </div>
                {skinAnalysis.lightingQuality?.guidance && (
                  <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded-lg">
                    {skinAnalysis.lightingQuality.guidance}
                  </p>
                )}
              </div>
            )}

            {/* Skin Profile */}
            <div className="analysis-card">
              <h4 className="font-semibold text-gray-800 mb-3">Your Skin Profile</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Skin Type</p>
                  <p className="font-medium text-gray-800">
                    {skinAnalysis.skinType?.type || skinAnalysis.skinType}
                  </p>
                  {skinAnalysis.skinType?.confidence && (
                    <p className="text-xs text-gray-400">{skinAnalysis.skinType.confidence}% confident</p>
                  )}
                </div>
                <div className="bg-white p-3 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Undertone</p>
                  <p className="font-medium text-gray-800 capitalize">
                    {skinAnalysis.undertone?.type || skinAnalysis.undertone}
                  </p>
                  {skinAnalysis.undertone?.confidence && (
                    <p className="text-xs text-gray-400">{skinAnalysis.undertone.confidence}% confident</p>
                  )}
                </div>
                <div className="bg-white p-3 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Skin Tone</p>
                  <p className="font-medium text-gray-800">{skinAnalysis.fitzpatrick.name}</p>
                  {skinAnalysis.fitzpatrick?.confidence && (
                    <p className="text-xs text-gray-400">{skinAnalysis.fitzpatrick.confidence}% confident</p>
                  )}
                </div>
                <div className="bg-white p-3 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Color Match</p>
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white shadow"
                    style={{
                      backgroundColor: `rgb(${skinAnalysis.skinColor?.r || 200}, ${skinAnalysis.skinColor?.g || 180}, ${skinAnalysis.skinColor?.b || 160})`
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Concerns */}
            {skinAnalysis.concerns.length > 0 && (
              <div className="analysis-card">
                <h4 className="font-semibold text-gray-800 mb-3">Areas of Focus</h4>
                <div className="space-y-2">
                  {skinAnalysis.concerns.map((concern, i) => (
                    <div key={i} className="flex items-center justify-between bg-white p-3 rounded-xl">
                      <span className="text-gray-700">{concern.name}</span>
                      <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                        concern.severity === 'mild' ? 'bg-green-100 text-green-700' :
                        concern.severity === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {concern.severity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            {tips.length > 0 && (
              <div className="analysis-card">
                <h4 className="font-semibold text-gray-800 mb-3">Beauty Tips</h4>
                <ul className="space-y-2">
                  {tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <FiCheck className="w-4 h-4 text-pink-500 flex-shrink-0 mt-0.5" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {skinAnalysis.recommendations.length > 0 && (
              <div className="analysis-card">
                <h4 className="font-semibold text-gray-800 mb-3">Recommended Products</h4>
                <div className="space-y-3">
                  {skinAnalysis.recommendations.slice(0, 4).map((rec, i) => (
                    <div
                      key={i}
                      className="bg-white p-3 rounded-xl flex items-center gap-3"
                    >
                      <div
                        className="w-12 h-12 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: rec.recommendedShade?.hex || '#f0f0f0' }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 text-sm truncate">{rec.product.name}</p>
                        <p className="text-xs text-gray-500">{rec.recommendedShade?.name}</p>
                        <p className="text-xs text-pink-600">{rec.reason}</p>
                      </div>
                      <button
                        onClick={() => handleApplyRecommendation(rec)}
                        className="px-3 py-1.5 bg-pink-500 text-white text-sm rounded-full hover:bg-pink-600 transition-colors"
                      >
                        Try
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            {skinAnalysis.disclaimer && (
              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                {skinAnalysis.disclaimer}
              </div>
            )}

            {/* Reanalyze button */}
            <button
              onClick={() => {
                setSkinAnalysis(null);
                setCapturedImage(null);
              }}
              className="w-full btn-secondary flex items-center justify-center gap-2"
            >
              <FiRefreshCw className="w-5 h-5" />
              Analyze Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkinAnalysis;
