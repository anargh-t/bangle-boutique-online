import React, { useMemo, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';

const Cart = () => {
  const { items, totalPrice, removeFromCart, updateQuantity } = useCart();

  // Customer details for WhatsApp order
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');

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
                const itemPrice = item.variation.price;
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
                              Price: <span className="font-medium">{currency(itemPrice)}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Desktop Price */}
                      <div className="hidden md:block md:col-span-2 text-center">
                        <p>{currency(itemPrice)}</p>
                      </div>
                      
                      {/* Quantity */}
                      <div className="md:col-span-2 flex items-center justify-center gap-2">
                        <button 
                          className="p-2 rounded-md border"
                          onClick={() => updateQuantity(index, Math.max(1, item.quantity - 1))}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <input 
                          type="number" 
                          value={item.quantity}
                          onChange={(e) => updateQuantity(index, Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-14 text-center border rounded-md h-9"
                          min={1}
                        />
                        <button 
                          className="p-2 rounded-md border"
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {/* Total */}
                      <div className="md:col-span-2 text-right font-medium">
                        {currency(totalItemPrice)}
                      </div>
                      
                      {/* Remove */}
                      <button 
                        className="absolute top-2 right-2 p-1 rounded-md hover:bg-muted"
                        onClick={() => removeFromCart(index)}
                        aria-label="Remove item"
                      >
                        <X className="h-4 w-4" />
                      </button>
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

              <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleSendWhatsApp}>
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
