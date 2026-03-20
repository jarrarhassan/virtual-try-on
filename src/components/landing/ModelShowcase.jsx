import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const models = [
  {
    id: 1,
    name: 'Sophia',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1200&auto=format&fit=crop',
    imageAfter: 'https://images.unsplash.com/photo-1588599376442-3ade47b98e07?q=80&w=1200&auto=format&fit=crop',
    tone: 'Fair',
  },
  {
    id: 2,
    name: 'Amara',
    image: 'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?q=80&w=1200&auto=format&fit=crop',
    imageAfter: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1200&auto=format&fit=crop',
    tone: 'Deep',
  },
  {
    id: 3,
    name: 'Maya',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop',
    imageAfter: 'https://images.unsplash.com/photo-1560087637-bf797bc7a24d?q=80&w=1200&auto=format&fit=crop',
    tone: 'Medium',
  },
];

const ModelShowcase = () => {
  const [activeModel, setActiveModel] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    setSliderPosition(percentage);
  };

  return (
    <section ref={sectionRef} className="py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-sm font-medium tracking-[0.3em] text-gold uppercase mb-4 block">
            Discover
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-charcoal">
            Every Shade, Every Tone
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Before/After Slider */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            ref={containerRef}
            className="relative aspect-[3/4] rounded-2xl overflow-hidden cursor-ew-resize select-none"
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
          >
            {/* After Image (Bottom Layer) */}
            <div className="absolute inset-0">
              <img
                src={models[activeModel].imageAfter}
                alt="After makeup"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Before Image (Top Layer with Clip) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <img
                src={models[activeModel].image}
                alt="Before makeup"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Slider Line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10"
              style={{ left: `${sliderPosition}%` }}
            >
              {/* Slider Handle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-elevated flex items-center justify-center">
                <svg className="w-6 h-6 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
              </div>
            </div>

            {/* Labels */}
            <div className="absolute top-6 left-6 px-4 py-2 bg-black/40 backdrop-blur-sm rounded-full">
              <span className="text-white text-xs tracking-wider uppercase">Before</span>
            </div>
            <div className="absolute top-6 right-6 px-4 py-2 bg-gold/90 backdrop-blur-sm rounded-full">
              <span className="text-charcoal text-xs tracking-wider uppercase">After</span>
            </div>
          </motion.div>

          {/* Model Selection */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            <div>
              <h3 className="font-serif text-3xl text-charcoal mb-4">
                See yourself in every look
              </h3>
              <p className="text-muted leading-relaxed">
                Our AI-powered technology adapts to your unique features, ensuring
                every shade looks perfect on you. Drag the slider to see the transformation.
              </p>
            </div>

            {/* Model Thumbnails */}
            <div className="flex gap-4">
              {models.map((model, index) => (
                <motion.button
                  key={model.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveModel(index)}
                  className={`relative w-20 h-20 rounded-full overflow-hidden transition-all duration-300 ${
                    activeModel === index
                      ? 'ring-2 ring-gold ring-offset-4 ring-offset-cream'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={model.image}
                    alt={model.name}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>

            {/* Active Model Info */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeModel}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="pt-4 border-t border-neutral-200"
              >
                <p className="text-sm text-muted mb-1">{models[activeModel].tone} Skin Tone</p>
                <p className="font-serif text-2xl text-charcoal">{models[activeModel].name}</p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ModelShowcase;
