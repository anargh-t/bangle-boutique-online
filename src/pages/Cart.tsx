import React, { useMemo, useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';
import { X, Minus, Plus, ShoppingBag, ArrowRight, AlertCircle } from 'lucide-react';

const Cart = () => {
  const { items, totalPrice, removeFromCart, updateQuantity, checkCartItemAvailability, removeOutOfStockItems, validateCart } = useCart();

  // Customer details for WhatsApp order
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');

  // Validate cart when page loads
  useEffect(() => {
    if (items.length > 0) {
      validateCart();
    }
  }, [items.length, validateCart]);

  const currency = (n: number) => `₹${n.toFixed(2)}`;

  const orderText = useMemo(() => {
    const lines = items.map((item, idx) => {
      const lineTotal = item.variation.price * item.quantity;
      return `${idx + 1}. ${item.product.name} - ${item.variation.color}, Size ${item.variation.size}, Qty ${item.quantity} x ${currency(item.variation.price)} = ${currency(lineTotal)}`;
    }).join('\n');

    const addressBlock = shippingAddress ? `\nAddress: ${shippingAddress}` : '';
    const notesBlock = notes ? `\nNotes: ${notes}` : '';

    return `Hello Kuppivala,\n\nNew order request:\n\nCustomer:\n- Name: ${customerName || '(not provided)'}\n- Phone: ${customerPhone || '(not provided)'}${addressBlock}${notesBlock}\n\nItems:\n${lines}\n\nSubtotal: ${currency(totalPrice)}\n\nPlease confirm availability, shipping charges, and payment details.`;
  }, [items, totalPrice, customerName, customerPhone, shippingAddress, notes]);

  const handleSendWhatsApp = () => {
    if (!customerName.trim() || !customerPhone.trim() || !shippingAddress.trim()) {
      toast.error('Please fill Name, Phone, and Address to continue.');
      return;
    }
    const phoneDigits = customerPhone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      toast.error('Please enter a valid phone number.');
      return;
    }
    const waLink = `https://wa.me/917012849883?text=${encodeURIComponent(orderText)}`;
    window.open(waLink, '_blank');
  };
  
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
                const availability = checkCartItemAvailability(item);
                return (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0">
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.variation.color}, Size {item.variation.size}"
                      </p>
                      <p className="text-sm font-medium">₹{item.variation.price}</p>
                      
                      {/* Stock Warning */}
                      {!availability.available && (
                        <div className="mt-2">
                          <Badge variant="destructive" className="text-xs">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {availability.message}
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                        disabled={item.quantity >= item.variation.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-medium">₹{(item.variation.price * item.quantity).toFixed(2)}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:w-1/3">
            <div className="border rounded-lg p-6 sticky top-24 space-y-4">
              <h2 className="font-semibold text-xl">Order Summary</h2>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{currency(totalPrice)}</span>
              </div>

              <Separator />

              {/* Customer Details */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number (WhatsApp)</label>
                  <Input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="e.g. 7012849883" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Shipping Address</label>
                  <Textarea value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} placeholder="House/Street, Area, City, Pincode" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Notes (optional)</label>
                  <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any special instructions" />
                </div>
              </div>

              <Separator />

              {/* Check if any items are out of stock */}
              {(() => {
                const unavailableItems = items.filter(item => !checkCartItemAvailability(item).available);
                if (unavailableItems.length > 0) {
                  return (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                      <div className="flex items-center gap-2 text-red-800 mb-2">
                        <AlertCircle className="h-5 w-5" />
                        <p className="font-medium">Some items in your cart are unavailable</p>
                      </div>
                      <p className="text-sm text-red-600 mb-3">
                        Please remove out-of-stock items before placing your order.
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={removeOutOfStockItems}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        Remove Out-of-Stock Items
                      </Button>
                    </div>
                  );
                }
                return null;
              })()}

              <Button 
                className="w-full bg-green-600 hover:bg-green-700" 
                onClick={handleSendWhatsApp}
                disabled={items.some(item => !checkCartItemAvailability(item).available)}
              >
                Send Order via WhatsApp
              </Button>
              <p className="text-xs text-muted-foreground">We will reply on WhatsApp to confirm availability, shipping charges, and payment details.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
