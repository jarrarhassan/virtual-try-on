import { useEffect } from 'react';
import Hero from './Hero';
import ModelShowcase from './ModelShowcase';
import Experience from './Experience';
import Products from './Products';
import CTA from './CTA';
import Footer from './Footer';

const LandingPage = ({ onEnterApp }) => {
  // Smooth scroll behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      <Hero onTryNow={onEnterApp} />
      <ModelShowcase />
      <Experience />
      <Products />
      <CTA onTryNow={onEnterApp} />
      <Footer />
    </div>
  );
};

export default LandingPage;
