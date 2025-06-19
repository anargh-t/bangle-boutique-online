import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-muted pt-12 pb-8">
      <div className="container mx-auto px-4">
        {/* Top section with columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex flex-col items-center text-2xl font-serif font-bold text-primary mb-2">
              <img
                src="/logo_symbol.png"
                alt="Kuppivala Logo Symbol"
                className="h-10 w-auto object-contain mb-1"
                style={{ background: 'transparent' }}
              />
              Kuppivala
            </Link>
            <div className="flex items-center justify-center space-x-4 mb-4">
              <a 
                href="https://www.instagram.com/kuppivala_by_gg?igsh=MXh4andyOTc5Y200Nw==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Follow us on Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Follow us on Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          {/* Shopping */}
          <div>
            <h3 className="font-medium text-lg mb-4">Shopping</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/catalog" className="text-muted-foreground hover:text-primary transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=traditional" className="text-muted-foreground hover:text-primary transition-colors">
                  Traditional
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=contemporary" className="text-muted-foreground hover:text-primary transition-colors">
                  Contemporary
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=luxury" className="text-muted-foreground hover:text-primary transition-colors">
                  Luxury
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Customer Service */}
          <div>
            <h3 className="font-medium text-lg mb-4">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-muted-foreground hover:text-primary transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/size-guide" className="text-muted-foreground hover:text-primary transition-colors">
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom section with copyright */}
        <div className="border-t border-border pt-8">
          <p className="text-center text-muted-foreground">
            &copy; {currentYear} Kuppivala. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
