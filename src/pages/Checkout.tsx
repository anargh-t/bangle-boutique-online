
import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';
import { ArrowLeft, Info } from 'lucide-react';

// Mock payment statuses
enum PaymentStatus {
  IDLE,
  PROCESSING,
  SUCCESS,
  FAILED
}

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  
  // Form states
  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(PaymentStatus.IDLE);
  
  // Handle form input changes
  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingInfo({ ...billingInfo, [name]: value });
  };
  
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentInfo({ ...paymentInfo, [name]: value });
  };
  
  // Handle form submission - mock payment process
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const requiredFields = [
      { name: 'firstName', label: 'First Name' },
      { name: 'lastName', label: 'Last Name' },
      { name: 'email', label: 'Email' },
      { name: 'address', label: 'Address' },
      { name: 'city', label: 'City' },
      { name: 'zipCode', label: 'ZIP Code' },
      { name: 'cardName', label: 'Name on Card' },
      { name: 'cardNumber', label: 'Card Number' },
      { name: 'expiryDate', label: 'Expiry Date' },
      { name: 'cvv', label: 'CVV' }
    ];
    
    const missingFields = requiredFields.filter(field => {
      const value = field.name.startsWith('card') ? 
        paymentInfo[field.name as keyof typeof paymentInfo] : 
        billingInfo[field.name as keyof typeof billingInfo];
      return !value;
    });
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in the following fields: ${missingFields.map(f => f.label).join(', ')}`);
      return;
    }
    
    // Mock payment process
    setPaymentStatus(PaymentStatus.PROCESSING);
    
    // Simulate API call
    setTimeout(() => {
      // Randomly succeed or fail (80% success rate)
      const isSuccess = Math.random() < 0.8;
      
      if (isSuccess) {
        setPaymentStatus(PaymentStatus.SUCCESS);
        
        toast.success('Payment successful! Your order has been placed.', {
          duration: 5000
        });
        
        // Clear cart and navigate to success page after a delay
        setTimeout(() => {
          clearCart();
          navigate('/order-success', { state: { orderNumber: Math.floor(100000 + Math.random() * 900000) } });
        }, 1500);
      } else {
        setPaymentStatus(PaymentStatus.FAILED);
        toast.error('Payment failed. Please try again with a different payment method.', {
          duration: 5000
        });
      }
    }, 2000);
  };
  
  // Check if cart is empty and redirect if needed
  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="font-serif text-2xl font-bold mb-2">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-6">
            You need to add items to your cart before checking out.
          </p>
          <Button asChild>
            <Link to="/catalog">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/cart" className="text-sm flex items-center text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Cart
          </Link>
        </div>
        
        <h1 className="font-serif text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Checkout Form */}
          <div className="lg:w-2/3">
            <form onSubmit={handleSubmit}>
              {/* Billing Information */}
              <div className="bg-muted/30 rounded-lg p-6 mb-8">
                <h2 className="font-serif text-xl font-bold mb-6">Billing Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      name="firstName" 
                      value={billingInfo.firstName}
                      onChange={handleBillingChange}
                      className="mt-1"
                    />
                  </div>
                  
                  {/* Last Name */}
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      name="lastName" 
                      value={billingInfo.lastName}
                      onChange={handleBillingChange}
                      className="mt-1"
                    />
                  </div>
                  
                  {/* Email */}
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email"
                      value={billingInfo.email}
                      onChange={handleBillingChange}
                      className="mt-1"
                    />
                  </div>
                  
                  {/* Phone */}
                  <div>
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      type="tel"
                      value={billingInfo.phone}
                      onChange={handleBillingChange}
                      className="mt-1"
                    />
                  </div>
                  
                  {/* Address */}
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      id="address" 
                      name="address" 
                      value={billingInfo.address}
                      onChange={handleBillingChange}
                      className="mt-1"
                    />
                  </div>
                  
                  {/* City */}
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city" 
                      name="city" 
                      value={billingInfo.city}
                      onChange={handleBillingChange}
                      className="mt-1"
                    />
                  </div>
                  
                  {/* State */}
                  <div>
                    <Label htmlFor="state">State/Province</Label>
                    <Input 
                      id="state" 
                      name="state" 
                      value={billingInfo.state}
                      onChange={handleBillingChange}
                      className="mt-1"
                    />
                  </div>
                  
                  {/* ZIP Code */}
                  <div>
                    <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                    <Input 
                      id="zipCode" 
                      name="zipCode" 
                      value={billingInfo.zipCode}
                      onChange={handleBillingChange}
                      className="mt-1"
                    />
                  </div>
                  
                  {/* Country */}
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Select 
                      value={billingInfo.country}
                      onValueChange={(value) => setBillingInfo({...billingInfo, country: value})}
                    >
                      <SelectTrigger id="country">
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="United States">United States</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                        <SelectItem value="Australia">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              {/* Payment Information */}
              <div className="bg-muted/30 rounded-lg p-6 mb-8">
                <h2 className="font-serif text-xl font-bold mb-6">Payment Method</h2>
                
                <div>
                  <div className="flex items-center gap-2 p-4 border rounded-lg bg-background mb-6">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-white"></div>
                    </div>
                    <span>Credit / Debit Card</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name on Card */}
                    <div className="md:col-span-2">
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input 
                        id="cardName" 
                        name="cardName" 
                        value={paymentInfo.cardName}
                        onChange={handlePaymentChange}
                        className="mt-1"
                      />
                    </div>
                    
                    {/* Card Number */}
                    <div className="md:col-span-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input 
                        id="cardNumber" 
                        name="cardNumber" 
                        placeholder="1234 5678 9012 3456"
                        value={paymentInfo.cardNumber}
                        onChange={handlePaymentChange}
                        className="mt-1"
                      />
                    </div>
                    
                    {/* Expiry Date */}
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input 
                        id="expiryDate" 
                        name="expiryDate" 
                        placeholder="MM/YY"
                        value={paymentInfo.expiryDate}
                        onChange={handlePaymentChange}
                        className="mt-1"
                      />
                    </div>
                    
                    {/* CVV */}
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input 
                        id="cvv" 
                        name="cvv" 
                        type="text"
                        placeholder="123"
                        maxLength={4}
                        value={paymentInfo.cvv}
                        onChange={handlePaymentChange}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Test Card Info */}
                <div className="mt-6 bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="flex gap-2 text-sm">
                    <Info className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-primary">Test Card Information</p>
                      <p className="mt-1 text-muted-foreground">
                        For successful payment, use card number 4242 4242 4242 4242, any future expiry date, and any 3-digit CVV.
                        <br />
                        For failed payment, use card number 4000 0000 0000 0002.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="border rounded-lg p-6 bg-muted/30 sticky top-24">
              <h2 className="font-serif text-xl font-bold mb-6">Order Summary</h2>
              
              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {items.map((item, index) => {
                  const discountFactor = item.product.offer.type === 'discount' ? 1 - item.product.offer.value : 1;
                  const itemPrice = item.variation.price * discountFactor;
                  
                  return (
                    <div key={index} className="flex gap-3">
                      <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden bg-muted">
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Color: {item.variation.color}, Size: {item.variation.size}
                        </p>
                        <div className="flex justify-between mt-1">
                          <p className="text-sm">{item.quantity} × ${itemPrice.toFixed(2)}</p>
                          <p className="font-medium">${(itemPrice * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Summary Calculations */}
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>$9.99</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${(totalPrice * 0.08).toFixed(2)}</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              {/* Total */}
              <div className="flex justify-between font-medium text-lg mb-6">
                <span>Total</span>
                <span>${(totalPrice + 9.99 + (totalPrice * 0.08)).toFixed(2)}</span>
              </div>
              
              {/* Place Order Button */}
              <Button 
                type="submit"
                className="w-full" 
                onClick={handleSubmit}
                disabled={paymentStatus === PaymentStatus.PROCESSING}
              >
                {paymentStatus === PaymentStatus.PROCESSING ? 'Processing...' : 'Place Order'}
              </Button>
              
              <p className="text-xs text-center text-muted-foreground mt-4">
                By placing your order, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
