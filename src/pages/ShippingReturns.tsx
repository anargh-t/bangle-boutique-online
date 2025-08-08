import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Truck, MapPin, Clock, AlertCircle, MessageCircle } from 'lucide-react';

const ShippingReturns = () => {
  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl font-bold text-primary mb-4">
            Shipping & Returns
          </h1>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about our shipping and return policies
          </p>
        </div>

        <Separator className="mb-8" />

        {/* Shipping Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-serif flex items-center gap-3">
              <Truck className="h-6 w-6 text-primary" />
              Shipping Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Shipping Coverage</h3>
                    <p className="text-muted-foreground">
                      We offer shipping services across all of India. No matter where you are located, 
                      we can deliver our beautiful glass bangles to your doorstep.
                    </p>
                  </div>
                </div>
                
                                 <div className="flex items-start gap-3">
                   <Clock className="h-5 w-5 text-primary mt-1" />
                   <div>
                     <h3 className="font-semibold text-lg mb-2">Delivery Time</h3>
                     <p className="text-muted-foreground">
                       Standard delivery typically takes 14 business days within India. 
                       Delivery times may vary based on your location and current order volume.
                     </p>
                   </div>
                 </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-accent rounded-lg">
                  <h3 className="font-semibold mb-2">Ordering Process</h3>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Browse our collection and select your favorite bangles</li>
                    <li>Contact us via WhatsApp or Instagram DM</li>
                    <li>Provide your size and color preferences</li>
                    <li>Share your shipping address and contact details</li>
                    <li>We'll confirm your order and provide payment details</li>
                  </ol>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Returns Policy */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-serif flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-primary" />
              Returns & Refunds Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-red-800">Important Notice</h3>
                  <p className="text-red-700">
                    Due to the delicate nature of our glass bangles and to ensure product quality, 
                    we do not accept returns or offer refunds. Please carefully review your order 
                    before confirming your purchase.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">Before You Order</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Use our size guide to find your perfect fit</li>
                  <li>• Check product images carefully for color and design</li>
                  <li>• Review all product details and descriptions</li>
                  <li>• Contact us if you have any questions before ordering</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3">Quality Assurance</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• All bangles are carefully inspected before shipping</li>
                  <li>• Products are securely packaged to prevent damage</li>
                  <li>• We use high-quality materials and craftsmanship</li>
                  <li>• Each piece is handcrafted with attention to detail</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Opening Video Requirement */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-serif flex items-center gap-3">
              <MessageCircle className="h-6 w-6 text-primary" />
              Opening Video Requirement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-lg mb-2 text-blue-800">Why Opening Videos?</h3>
              <p className="text-blue-700 mb-3">
                To ensure transparency and protect both you and us, we require an opening video 
                when you receive your order. This helps us verify the condition of the product 
                upon delivery and address any concerns immediately.
              </p>
              <div className="space-y-2 text-blue-700">
                <p className="font-medium">What to include in your opening video:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Show the unopened package clearly</li>
                  <li>Open the package in one continuous video</li>
                  <li>Display all items received</li>
                  <li>Show any packaging or damage issues if present</li>
                </ul>
              </div>
            </div>
          </CardContent>
                 </Card>
       </div>
     </div>
   );
 };

export default ShippingReturns; 