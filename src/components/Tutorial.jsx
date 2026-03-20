import { useState } from 'react';
import useStore from '../store/useStore';
import { FiChevronRight, FiX } from 'react-icons/fi';

const steps = [
  {
    title: 'Welcome to Beauty Try-On',
    description: 'Experience virtual makeup powered by AI. Try on lipsticks, eyeshadow, foundation and more in real-time!',
    icon: '✨',
  },
  {
    title: 'Position Your Face',
    description: 'Make sure your face is well-lit and centered in the camera. Our AI will automatically detect your facial features.',
    icon: '📷',
  },
  {
    title: 'Choose Products',
    description: 'Browse our catalog of 50+ products. Tap any product to see shade options, then tap a shade to try it on instantly.',
    icon: '💄',
  },
  {
    title: 'Adjust & Perfect',
    description: 'Use the intensity slider to adjust how bold your makeup looks. Mix and match products to create your perfect look!',
    icon: '🎨',
  },
  {
    title: 'Analyze Your Skin',
    description: 'Use our Skin Genius feature to get personalized product recommendations based on your skin type and tone.',
    icon: '🔬',
  },
  {
    title: 'Save & Share',
    description: 'Love your look? Save it to favorites, capture a photo, or share directly to social media!',
    icon: '💖',
  },
];

const Tutorial = () => {
  const { showTutorial, setShowTutorial } = useStore();
  const [currentStep, setCurrentStep] = useState(0);

  if (!showTutorial) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowTutorial(false);
    }
  };

  const handleSkip = () => {
    setShowTutorial(false);
  };

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="modal-overlay" onClick={handleSkip}>
      <div
        className="modal-content p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <FiX className="w-5 h-5 text-gray-500" />
        </button>

        {/* Step content */}
        <div className="text-center pt-4">
          <div className="text-6xl mb-4">{step.icon}</div>
          <h3 className="text-2xl font-display font-semibold text-gray-800 mb-3">
            {step.title}
          </h3>
          <p className="text-gray-600 mb-8 max-w-sm mx-auto">
            {step.description}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentStep
                  ? 'w-6 bg-pink-500'
                  : i < currentStep
                  ? 'bg-pink-300'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleSkip}
            className="flex-1 py-3 text-gray-500 font-medium hover:text-gray-700 transition-colors"
          >
            Skip
          </button>
          <button
            onClick={handleNext}
            className="flex-1 btn-primary flex items-center justify-center gap-2"
          >
            {isLastStep ? 'Get Started' : 'Next'}
            {!isLastStep && <FiChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
