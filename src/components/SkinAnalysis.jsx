import { useState, useRef } from 'react';
import useStore from '../store/useStore';
import { performSkinAnalysis, generateSkinTips } from '../utils/skinAnalysis';
import { FiCamera, FiUpload, FiRefreshCw, FiCheck } from 'react-icons/fi';

const SkinAnalysis = ({ onClose }) => {
  const { skinAnalysis, setSkinAnalysis, faceLandmarks, setSelectedProduct, setSelectedShade } = useStore();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const fileInputRef = useRef(null);

  // Capture from video
  const handleCapture = async () => {
    const video = document.querySelector('video');
    if (!video || !faceLandmarks) {
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
    }, 1500);
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
    <div className="h-full flex flex-col bg-cream">
      {/* Header */}
      <div className="p-5 border-b border-neutral-100 bg-white">
        <h2 className="text-xl font-serif font-medium text-charcoal">Skin Analysis</h2>
        <p className="text-muted text-sm mt-1">AI-powered insights</p>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-luxury">
        {/* Capture section */}
        {!skinAnalysis && (
          <div className="p-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <FiCamera className="w-8 h-8 text-muted" />
              </div>
              <h3 className="text-lg font-serif font-medium text-charcoal mb-2">
                Analyze Your Skin
              </h3>
              <p className="text-muted text-sm leading-relaxed max-w-xs mx-auto">
                Get personalized recommendations based on your skin type and tone.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleCapture}
                disabled={isAnalyzing || !faceLandmarks}
                className={`w-full btn-luxury ${isAnalyzing || !faceLandmarks ? 'bg-neutral-200 text-muted cursor-not-allowed' : 'btn-primary'}`}
              >
                {isAnalyzing ? (
                  <>
                    <div className="spinner w-5 h-5" />
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
                  <div className="w-full border-t border-neutral-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-cream text-muted text-xs tracking-wide">OR</span>
                </div>
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalyzing}
                className="w-full btn-luxury btn-secondary"
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
              <p className="text-center text-muted text-sm mt-6 bg-neutral-100 p-4 rounded-xl">
                Position your face in the camera for live capture
              </p>
            )}
          </div>
        )}

        {/* Results section */}
        {skinAnalysis && (
          <div className="p-5 space-y-5">
            {/* Captured image */}
            {capturedImage && (
              <div className="relative rounded-2xl overflow-hidden">
                <img src={capturedImage} alt="Analyzed" className="w-full h-36 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-medium text-sm">Analysis Complete</p>
                  <p className="text-white/70 text-xs">
                    {new Date(skinAnalysis.analyzedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}

            {/* Overall Score */}
            <div className="bg-white rounded-xl p-5 border border-neutral-100">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-charcoal">Health Score</h4>
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-serif font-medium text-gold">{skinAnalysis.overallScore}</span>
                  <span className="text-muted text-sm">/100</span>
                </div>
              </div>
              <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold rounded-full transition-all duration-500"
                  style={{ width: `${skinAnalysis.overallScore}%` }}
                />
              </div>
            </div>

            {/* Skin Profile */}
            <div className="bg-white rounded-xl p-5 border border-neutral-100">
              <h4 className="font-medium text-charcoal mb-4">Your Profile</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-cream p-3 rounded-lg">
                  <p className="text-xs text-muted mb-1 tracking-wide uppercase">Skin Type</p>
                  <p className="font-medium text-charcoal text-sm">
                    {skinAnalysis.skinType?.type || skinAnalysis.skinType}
                  </p>
                </div>
                <div className="bg-cream p-3 rounded-lg">
                  <p className="text-xs text-muted mb-1 tracking-wide uppercase">Undertone</p>
                  <p className="font-medium text-charcoal text-sm capitalize">
                    {skinAnalysis.undertone?.type || skinAnalysis.undertone}
                  </p>
                </div>
                <div className="bg-cream p-3 rounded-lg">
                  <p className="text-xs text-muted mb-1 tracking-wide uppercase">Tone</p>
                  <p className="font-medium text-charcoal text-sm">{skinAnalysis.fitzpatrick.name}</p>
                </div>
                <div className="bg-cream p-3 rounded-lg">
                  <p className="text-xs text-muted mb-1 tracking-wide uppercase">Match</p>
                  <div
                    className="w-7 h-7 rounded-full shadow-soft"
                    style={{
                      backgroundColor: `rgb(${skinAnalysis.skinColor?.r || 200}, ${skinAnalysis.skinColor?.g || 180}, ${skinAnalysis.skinColor?.b || 160})`
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Concerns */}
            {skinAnalysis.concerns.length > 0 && (
              <div className="bg-white rounded-xl p-5 border border-neutral-100">
                <h4 className="font-medium text-charcoal mb-4">Focus Areas</h4>
                <div className="space-y-2">
                  {skinAnalysis.concerns.map((concern, i) => (
                    <div key={i} className="flex items-center justify-between bg-cream p-3 rounded-lg">
                      <span className="text-charcoal text-sm">{concern.name}</span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        concern.severity === 'mild' ? 'bg-neutral-100 text-muted' :
                        concern.severity === 'moderate' ? 'bg-gold/10 text-gold-dark' :
                        'bg-charcoal/10 text-charcoal'
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
              <div className="bg-white rounded-xl p-5 border border-neutral-100">
                <h4 className="font-medium text-charcoal mb-4">Recommendations</h4>
                <ul className="space-y-3">
                  {tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted">
                      <FiCheck className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Product Recommendations */}
            {skinAnalysis.recommendations.length > 0 && (
              <div className="bg-white rounded-xl p-5 border border-neutral-100">
                <h4 className="font-medium text-charcoal mb-4">Suggested Products</h4>
                <div className="space-y-3">
                  {skinAnalysis.recommendations.slice(0, 4).map((rec, i) => (
                    <div
                      key={i}
                      className="bg-cream p-4 rounded-xl flex items-center gap-4"
                    >
                      <div
                        className="w-12 h-12 rounded-lg flex-shrink-0 shadow-soft"
                        style={{ backgroundColor: rec.recommendedShade?.hex || '#f0f0f0' }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-charcoal text-sm truncate">{rec.product.name}</p>
                        <p className="text-xs text-muted">{rec.recommendedShade?.name}</p>
                      </div>
                      <button
                        onClick={() => handleApplyRecommendation(rec)}
                        className="px-4 py-2 bg-charcoal text-cream text-xs font-medium rounded-full hover:bg-neutral-800 transition-colors"
                      >
                        Try
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reanalyze button */}
            <button
              onClick={() => {
                setSkinAnalysis(null);
                setCapturedImage(null);
              }}
              className="w-full btn-luxury btn-secondary"
            >
              <FiRefreshCw className="w-4 h-4" />
              Analyze Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkinAnalysis;
