import React from 'react';
import { Instagram, Facebook, Youtube } from 'lucide-react';

const Contact = () => (
  <section className="py-16 bg-white min-h-screen flex items-center">
    <div className="container mx-auto px-4 text-center max-w-xl">
      <h1 className="font-serif text-4xl font-bold mb-6 text-primary">Contact Us</h1>
      <div className="mb-6 text-lg text-muted-foreground">
        <div className="mb-2">Phone: <a href="tel:+919876543210" className="text-primary hover:underline">+91 98765 43210</a></div>
        <div className="mb-2">Email: <a href="mailto:kuppivalagng@gmail.com" className="text-primary hover:underline">kuppivalagng@gmail.com</a></div>
      </div>
      <div className="flex justify-center gap-6 mt-8">
        <a href="https://www.instagram.com/kuppivala_by_gg?igsh=MXh4andyOTc5Y200Nw==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors">
          <Instagram size={32} />
        </a>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors">
          <Facebook size={32} />
        </a>
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-muted-foreground hover:text-primary transition-colors">
          <Youtube size={32} />
        </a>
      </div>
    </div>
  </section>
);

export default Contact; 