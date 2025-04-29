
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const OrderSuccess = () => {
  const location = useLocation();
  const orderNumber = location.state?.orderNumber || 'N/A';

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="mb-6 flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        
        <h1 className="font-serif text-3xl font-bold mb-4">Thank You For Your Order!</h1>
        
        <p className="text-lg mb-2">Your order has been placed successfully.</p>
        <p className="text-muted-foreground mb-6">
          Order Number: <span className="font-medium">{orderNumber}</span>
        </p>
        
        <div className="bg-muted/30 p-6 rounded-lg mb-8">
          <h2 className="font-medium text-lg mb-4">What's Next?</h2>
          <ul className="text-left space-y-3 text-muted-foreground">
            <li className="flex gap-2">
              <span className="font-medium text-foreground">1.</span>
              <span>You will receive an order confirmation email shortly.</span>
            </li>
            <li className="flex gap-2">
              <span className="font-medium text-foreground">2.</span>
              <span>Your order will be processed within 1-2 business days.</span>
            </li>
            <li className="flex gap-2">
              <span className="font-medium text-foreground">3.</span>
              <span>You will receive another email once your order has shipped.</span>
            </li>
            <li className="flex gap-2">
              <span className="font-medium text-foreground">4.</span>
              <span>For any questions, please contact our customer support.</span>
            </li>
          </ul>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link to="/catalog">Continue Shopping</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
