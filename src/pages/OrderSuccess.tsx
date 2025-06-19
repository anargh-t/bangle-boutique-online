import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const OrderSuccess = () => (
  <div className="min-h-screen pt-20 flex items-center justify-center">
    <div className="max-w-md mx-auto px-4 text-center">
      <h1 className="font-serif text-3xl font-bold mb-4">Order Success Page Disabled</h1>
      <p className="text-lg mb-6">Orders are now handled via WhatsApp. Please use the WhatsApp button on product pages to buy or enquire.</p>
      <Button asChild>
        <Link to="/catalog">Continue Shopping</Link>
      </Button>
    </div>
  </div>
);

export default OrderSuccess;
