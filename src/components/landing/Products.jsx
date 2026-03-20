import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const products = [
  {
    id: 1,
    name: 'Rouge Signature',
    brand: "L'Oréal Paris",
    type: 'Lipstick',
    color: '#B22222',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'True Match',
    brand: "L'Oréal Paris",
    type: 'Foundation',
    color: '#DEB887',
    image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'Lash Paradise',
    brand: "L'Oréal Paris",
    type: 'Mascara',
    color: '#1A1A1A',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 4,
    name: 'Paradise Palette',
    brand: "L'Oréal Paris",
    type: 'Eyeshadow',
    color: '#FF8C00',
    image: 'https://images.unsplash.com/photo-1583241800698-e8ab01c85a8f?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 5,
    name: 'True Match Blush',
    brand: "L'Oréal Paris",
    type: 'Blush',
    color: '#FFB6C1',
    image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=600&auto=format&fit=crop',
  },
];

const ProductCard = ({ product, index }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="flex-shrink-0 w-[320px] md:w-[380px] group cursor-pointer"
    >
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.4 }}
        className="relative"
      >
        {/* Product Image */}
        <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-100 mb-6">
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6 }}
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />

          {/* Color Swatch Overlay */}
          <div className="absolute bottom-4 right-4">
            <div
              className="w-12 h-12 rounded-full shadow-elevated border-4 border-white"
              style={{ backgroundColor: product.color }}
            />
          </div>
        </div>

        {/* Product Info */}
        <div>
          <p className="text-sm text-muted tracking-wide uppercase mb-2">
            {product.brand}
          </p>
          <h3 className="font-serif text-2xl text-charcoal mb-1 group-hover:text-gold transition-colors duration-300">
            {product.name}
          </h3>
          <p className="text-muted">{product.type}</p>
        </div>

        {/* Try Button - appears on hover */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-charcoal text-sm font-medium rounded-full shadow-soft">
            Try On
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const Products = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const scrollRef = useRef(null);

  return (
    <section ref={sectionRef} className="py-32 bg-cream overflow-hidden">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <span className="text-sm font-medium tracking-[0.3em] text-gold uppercase mb-4 block">
              Collection
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-medium text-charcoal">
              Explore our products
            </h2>
          </div>

          {/* Scroll Hint */}
          <div className="flex items-center gap-3 text-muted">
            <span className="text-sm tracking-wide">Scroll to explore</span>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Horizontal Scroll Container */}
      <div
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto scrollbar-hide px-6 pb-4"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {/* Left Padding */}
        <div className="flex-shrink-0 w-[calc((100vw-1280px)/2)] max-w-0 md:max-w-none" />

        {products.map((product, index) => (
          <div key={product.id} style={{ scrollSnapAlign: 'start' }}>
            <ProductCard product={product} index={index} />
          </div>
        ))}

        {/* Right Padding */}
        <div className="flex-shrink-0 w-6" />
      </div>
    </section>
  );
};

export default Products;
