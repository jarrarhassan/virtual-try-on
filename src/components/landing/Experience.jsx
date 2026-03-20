import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const features = [
  {
    title: 'Try in real time',
    description: 'Instant AR makeup application',
  },
  {
    title: 'See every shade',
    description: '50+ products, endless possibilities',
  },
  {
    title: 'Designed for you',
    description: 'AI-matched to your skin tone',
  },
  {
    title: 'Share your look',
    description: 'Capture and inspire others',
  },
];

const FeatureBlock = ({ feature, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15 }}
      className="group"
    >
      <div className="border-t border-neutral-200 pt-8 pb-16">
        <div className="flex items-start justify-between">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
              className="text-gold text-sm font-medium tracking-widest"
            >
              0{index + 1}
            </motion.span>
            <h3 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal mt-4 mb-4 group-hover:text-gold transition-colors duration-500">
              {feature.title}
            </h3>
            <p className="text-muted text-lg max-w-md">
              {feature.description}
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.15 + 0.4 }}
            className="hidden md:block"
          >
            <svg
              className="w-12 h-12 text-neutral-300 group-hover:text-gold transition-colors duration-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const Experience = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-32 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <span className="text-sm font-medium tracking-[0.3em] text-gold uppercase mb-4 block">
            The Experience
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-medium text-charcoal max-w-2xl mx-auto">
            Beauty technology that understands you
          </h2>
        </motion.div>

        {/* Feature Blocks */}
        <div className="space-y-0">
          {features.map((feature, index) => (
            <FeatureBlock key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
