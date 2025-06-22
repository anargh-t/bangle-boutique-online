import React from 'react';
import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedProducts />
      
      {/* Instagram Feed Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-bold mb-8">Follow us on Instagram</h2>
          <div className="flex justify-center mb-6">
            <a
              href="https://www.instagram.com/kuppivala_by_gg?igsh=MXh4andyOTc5Y200Nw=="
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition"
            >
              @kuppivala_by_gg
            </a>
          </div>
          {/* Instagram Embed */}
          <div className="flex justify-center">
            <iframe
              src="https://www.instagram.com/kuppivala_by_gg/embed"
              width="400"
              height="480"
              frameBorder="0"
              scrolling="no"
              allowTransparency={true}
              title="Kuppivala Instagram Feed"
              className="rounded-lg shadow-lg"
              style={{ border: 'none', overflow: 'hidden' }}
            ></iframe>
          </div>
        </div>
      </section>

      {/* Kuppivala by Greeshma N Gopika Logo Section */}
      <section className="py-12 bg-transparent">
        <div className="container mx-auto px-4 text-center">
          <img
            src="/kupp-gng.png"
            alt="Kuppivala by Greeshma N Gopika Logo"
            className="mx-auto h-40 w-auto mb-4"
            style={{ background: 'transparent' }}
          />
        </div>
      </section>
    </div>
  );
};

export default Index;
