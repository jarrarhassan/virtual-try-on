import { useState } from 'react';
import useStore from '../store/useStore';
import { FiChevronRight, FiX } from 'react-icons/fi';

const steps = [
  {
    title: 'Welcome',
    description: 'Experience virtual makeup powered by AI. Try on lipsticks, eyeshadow, foundation and more in real-time.',
  },
  {
    title: 'Position Your Face',
    description: 'Ensure your face is well-lit and centered in the camera. Our AI will detect your facial features automatically.',
  },
  {
    title: 'Browse Collection',
    description: 'Explore our curated catalog of products. Select any item to see shade options, then tap a shade to try it instantly.',
  },
  {
    title: 'Perfect Your Look',
    description: 'Use the intensity slider to adjust the boldness of your makeup. Mix and match products to create your signature look.',
  },
  {
    title: 'Save & Share',
    description: 'Save your favorite looks, capture photos, or share directly with friends.',
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
        className="modal-content p-8 max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-5 right-5 p-2 hover:bg-neutral-100 rounded-full transition-luxury"
        >
          <FiX className="w-4 h-4 text-muted" />
        </button>

        {/* Step content */}
        <div className="text-center pt-4">
          {/* Step indicator */}
          <p className="text-xs text-gold font-medium tracking-widest uppercase mb-6">
            Step {currentStep + 1} of {steps.length}
          </p>

          <h3 className="text-2xl font-serif font-medium text-charcoal mb-4">
            {step.title}
          </h3>
          <p className="text-muted leading-relaxed mb-10 max-w-sm mx-auto">
            {step.description}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentStep
                  ? 'w-8 bg-gold'
                  : i < currentStep
                  ? 'w-1.5 bg-gold/40'
                  : 'w-1.5 bg-neutral-200'
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleSkip}
            className="flex-1 py-3 text-muted font-medium text-sm hover:text-charcoal transition-colors"
          >
            Skip
          </button>
          <button
            onClick={handleNext}
            className="flex-1 btn-luxury btn-primary"
          >
            {isLastStep ? 'Get Started' : 'Continue'}
            {!isLastStep && <FiChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
