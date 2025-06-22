import React from 'react';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';

const Cart = () => {
  const { items, totalPrice, removeFromCart, updateQuantity } = useCart();
  
  // Check if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h1 className="font-serif text-2xl font-bold mb-2">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-6">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Button asChild>
            <Link to="/catalog">Start Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-serif text-3xl font-bold mb-8">Your Shopping Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            {/* Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 font-medium text-sm text-muted-foreground mb-4">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>
            
            {/* Cart Items */}
            <div className="space-y-4">
              {items.map((item, index) => {
                const discountFactor = item.product.offer.type === 'discount' ? 1 - item.product.offer.value : 1;
                const itemPrice = item.variation.price * discountFactor;
                const totalItemPrice = itemPrice * item.quantity;
                
                return (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      {/* Mobile Display: Product + Price + Quantity + Total */}
                      <div className="md:col-span-6 flex gap-4">
                        {/* Product Image */}
                        <Link to={`/product/${item.product.id}`} className="flex-shrink-0 w-20 h-20 overflow-hidden rounded-md">
                          <img 
                            src={item.product.images[0]} 
                            alt={item.product.name} 
                            className="w-full h-full object-cover"
                          />
                        </Link>
                        
                        {/* Product Info */}
                        <div className="flex-1">
                          <Link to={`/product/${item.product.id}`} className="font-medium hover:text-primary">
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-muted-foreground mt-1">
                            Color: {item.variation.color}, Size: {item.variation.size}
                          </p>
                          
                          {/* Mobile Price */}
                          <div className="md:hidden mt-2">
                            <p className="text-sm">
                              Price: <span className="font-medium">₹{itemPrice.toFixed(2)}</span>
                              {item.product.offer.type === 'discount' && (
                                <span className="text-xs text-destructive ml-1">
                                  ({(item.product.offer.value * 100).toFixed(0)}% OFF)
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Desktop Price */}
                      <div className="hidden md:block md:col-span-2 text-center">
                        <p>
                          ₹{itemPrice.toFixed(2)}
                          {item.product.offer.type === 'discount' && (
                            <span className="block text-xs text-destructive">
                              ({(item.product.offer.value * 100).toFixed(0)}% OFF)
                            </span>
                          )}
                        </p>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="md:col-span-2">
                        <div className="flex items-center justify-center border rounded-md">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => updateQuantity(index, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          
                          <input 
                            type="text" 
                            value={item.quantity} 
                            readOnly 
                            className="w-10 text-center border-y-0 border-x focus:ring-0 focus:outline-none" 
                          />
                          
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Total Price */}
                      <div className="md:col-span-2 flex items-center justify-between md:justify-end">
                        <span className="md:hidden">Total:</span>
                        <span className="font-medium">₹{totalItemPrice.toFixed(2)}</span>
                      </div>
                      
                      {/* Remove Button */}
                      <div className="col-span-1 flex justify-end">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeFromCart(index)} 
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Continue Shopping Button */}
            <div className="mt-8">
              <Button variant="outline" asChild>
                <Link to="/catalog">Continue Shopping</Link>
              </Button>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="border rounded-lg p-6 bg-muted/30 sticky top-24">
              <h2 className="font-serif text-xl font-bold mb-6">Order Summary</h2>
              
              {/* Summary Items */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                  <span className="font-medium">₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              {/* Total */}
              <div className="flex justify-between font-medium text-lg mb-6">
                <span>Estimated Total</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              
              {/* Checkout Button */}
              {/* <Button asChild className="w-full">
                <Link to="/checkout">
                  Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button> */}
              
              {/* Payment Methods */}
              {/*
                <p className="mb-2">We accept:</p>
                <div className="flex justify-center space-x-2">
                  <div className="h-6 w-10 bg-muted rounded">Visa</div>
                  <div className="h-6 w-10 bg-muted rounded">MC</div>
                  <div className="h-6 w-10 bg-muted rounded">Amex</div>
                  <div className="h-6 w-10 bg-muted rounded">PayPal</div>
                </div>
              */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
