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
      
      {/* Newsletter Section */}
      <section className="py-16 bg-primary/10">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="font-serif text-3xl font-bold mb-4">Stay Connected</h2>
          <p className="text-muted-foreground mb-8">
            Subscribe to our newsletter for exclusive offers, early access to new collections, and style inspiration.
          </p>
          <form className="flex flex-col sm:flex-row gap-2">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-1"
              required
            />
            <Button type="submit">Subscribe</Button>
          </form>
          <p className="text-xs text-muted-foreground mt-4">
            By subscribing, you agree to our Privacy Policy and consent to receive updates from Kuppivala.
          </p>
        </div>
      </section>

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
