import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const CTA = ({ onTryNow }) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative py-40 bg-charcoal overflow-hidden"
    >
      {/* Subtle Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Gold Accent Lines */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-sm font-medium tracking-[0.3em] text-gold uppercase mb-8 block"
        >
          Begin Your Journey
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-4xl md:text-6xl lg:text-7xl font-medium text-white mb-8 leading-[1.1]"
        >
          Find your signature look
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg text-cream mb-12 max-w-xl mx-auto"
        >
          Join thousands discovering their perfect beauty matches with our AI-powered virtual try-on experience.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={onTryNow}
          className="px-16 py-5 bg-gold text-charcoal font-medium text-sm tracking-widest uppercase transition-all duration-300 hover:bg-gold-light"
        >
          Start Now
        </motion.button>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-20 flex items-center justify-center gap-12"
        >
          <div className="text-center">
            <p className="font-serif text-3xl text-gold mb-2">50+</p>
            <p className="text-sm tracking-wide text-cream">Products</p>
          </div>
          <div className="w-px h-12 bg-gold/50" />
          <div className="text-center">
            <p className="font-serif text-3xl text-gold mb-2">100%</p>
            <p className="text-sm tracking-wide text-cream">Real-time</p>
          </div>
          <div className="w-px h-12 bg-gold/50" />
          <div className="text-center">
            <p className="font-serif text-3xl text-gold mb-2">AI</p>
            <p className="text-sm tracking-wide text-cream">Powered</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
