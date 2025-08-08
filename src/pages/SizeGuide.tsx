import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const SizeGuide = () => {
  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl font-bold text-primary mb-4">
            Bangle Size Guide
          </h1>
          <p className="text-lg text-muted-foreground">
            Find your perfect bangle size with our comprehensive size chart
          </p>
        </div>

        <Separator className="mb-8" />

        {/* Size Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-serif text-center">
              Check Your Bangle Size
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex justify-center">
                             <img
                 src="/Size_chart.jpg"
                 alt="Bangle Size Chart - Check Your Bangle Size"
                 className="max-w-full h-auto rounded-lg shadow-lg"
                 style={{ maxHeight: '600px' }}
               />
            </div>
          </CardContent>
        </Card>

        {/* Size Information */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif">
                How to Measure Your Bangle Size
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Using a String</h3>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Wrap a string around your hand at the widest part (knuckles)</li>
                  <li>Mark where the string meets</li>
                  <li>Measure the length of the string</li>
                  <li>Use our size chart to find your corresponding bangle size</li>
                </ol>
              </div>
              
              {/* <div className="space-y-3">
                <h3 className="font-semibold text-lg">Method 2: Using a Ring</h3>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Find a ring that fits your middle finger</li>
                  <li>Measure the inner diameter of the ring</li>
                  <li>Multiply by 3.14 to get the circumference</li>
                  <li>Compare with our size chart measurements</li>
                </ol>
              </div> */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif">
                Size Chart Reference
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-accent rounded-lg">
                  <span className="font-medium">Size 2.2</span>
                  <span className="text-muted-foreground">5.50 CM Inner Diameter</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-accent rounded-lg">
                  <span className="font-medium">Size 2.4</span>
                  <span className="text-muted-foreground">5.70 CM Inner Diameter</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-accent rounded-lg">
                  <span className="font-medium">Size 2.6</span>
                  <span className="text-muted-foreground">6.00 CM Inner Diameter</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-accent rounded-lg">
                  <span className="font-medium">Size 2.8</span>
                  <span className="text-muted-foreground">6.40 CM Inner Diameter</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                <h4 className="font-semibold mb-2">💡 Pro Tip</h4>
                <p className="text-sm text-muted-foreground">
                  If you're between sizes, we recommend going with the larger size for a more comfortable fit. 
                  Bangles should slide over your hand easily but not fall off when your hand is relaxed.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SizeGuide; 