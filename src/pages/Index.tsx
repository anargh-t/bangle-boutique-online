
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
      
      {/* Categories Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Traditional Category */}
            <div className="relative overflow-hidden rounded-lg aspect-[4/5] group">
              <img 
                src="https://via.placeholder.com/600x750?text=Traditional" 
                alt="Traditional Bangles" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white font-serif text-2xl mb-2">Traditional</h3>
                <p className="text-white/80 mb-4">Timeless classics for every occasion</p>
                <Button asChild variant="outline" className="bg-white/20 backdrop-blur-sm border-white text-white hover:bg-white/30 w-fit">
                  <Link to="/catalog?category=traditional">
                    Explore <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Contemporary Category */}
            <div className="relative overflow-hidden rounded-lg aspect-[4/5] group">
              <img 
                src="https://via.placeholder.com/600x750?text=Contemporary" 
                alt="Contemporary Bangles" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white font-serif text-2xl mb-2">Contemporary</h3>
                <p className="text-white/80 mb-4">Modern designs for the fashion-forward</p>
                <Button asChild variant="outline" className="bg-white/20 backdrop-blur-sm border-white text-white hover:bg-white/30 w-fit">
                  <Link to="/catalog?category=contemporary">
                    Explore <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Luxury Category */}
            <div className="relative overflow-hidden rounded-lg aspect-[4/5] group">
              <img 
                src="https://via.placeholder.com/600x750?text=Luxury" 
                alt="Luxury Bangles" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white font-serif text-2xl mb-2">Luxury</h3>
                <p className="text-white/80 mb-4">Premium pieces for special moments</p>
                <Button asChild variant="outline" className="bg-white/20 backdrop-blur-sm border-white text-white hover:bg-white/30 w-fit">
                  <Link to="/catalog?category=luxury">
                    Explore <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Brand Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img 
                src="https://via.placeholder.com/800x600?text=Our+Story" 
                alt="Our Story" 
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="font-serif text-3xl font-bold mb-4">Our Story</h2>
              <p className="text-muted-foreground mb-6">
                Kuppivala was born out of a passion for traditional craftsmanship combined with modern design. 
                Our journey began in a small workshop where each piece was handcrafted with love and attention to detail.
              </p>
              <p className="text-muted-foreground mb-6">
                Today, we continue this tradition, creating exquisite bangles that blend cultural heritage with contemporary style. 
                Each piece tells a story and is designed to be cherished for generations.
              </p>
              <Button asChild variant="outline">
                <Link to="/about">
                  Read More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
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
    </div>
  );
};

export default Index;
