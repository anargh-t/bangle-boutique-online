import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const backgroundImages = [
    '/BANGLES/bg1.jpg',
    '/BANGLES/bg2.jpg',
    '/BANGLES/bg3.jpg',
    '/BANGLES/bg4.jpg',
    '/BANGLES/bg5.jpg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <section className="relative overflow-hidden bg-accent/20 py-24 md:py-32 pt-32 md:pt-40">
      {/* Auto-scrolling Background Images */}
      <div className="absolute inset-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-50' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${image})`,
            }}
          />
        ))}
      </div>

      {/* Brand Logo and Name */}
      <div className="flex flex-col items-center mb-8 z-20 relative">
        <img
          src="/logo_symbol.png"
          alt="Kuppivala Logo Symbol"
          className="h-40 w-auto object-contain mb-2"
          style={{ background: 'transparent' }}
        />
        <h1 className="font-serif text-4xl md:text-6xl font-bold text-white mb-1 tracking-wide drop-shadow-lg" style={{ letterSpacing: '0.05em' }}>Kuppivala</h1>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white drop-shadow-lg">
            <span className="block">Elegance on Your </span>
            <span className="text-yellow-300">Wrist</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-xl mx-auto drop-shadow-md">
            Discover our exquisite collection of handcrafted glass bangles, designed to elevate every outfit and occasion.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="px-8 bg-yellow-500 hover:bg-yellow-600 text-white border-0">
              <Link to="/catalog">
                Shop Collection <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Image Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-2">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'bg-primary scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      {/* Decorative element */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default Hero;
