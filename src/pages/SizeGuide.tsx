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
                <h3 className="font-semibold text-lg">Using an Existing Bangle (Based on Inner Diameter)</h3>
                <p className="text-muted-foreground mb-3">
                  If you already have a bangle that fits well, you can quickly find your bangle size using its inner diameter:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li><strong>Select a Bangle That Fits Well</strong><br />
                    Choose an existing bangle that easily fits over your hand and sits comfortably.</li>
                  <li><strong>Measure Its Inner Diameter</strong><br />
                    Place the bangle on a flat surface. Using a ruler or a measuring tape, measure the inner diameter of the bangle in centimeters (CM). Take the measurement straight across the inside of the bangle from one side to the other.</li>
                  <li><strong>Compare with the Size Chart</strong><br />
                    Match your bangle's measured inner diameter to the closest value in the size chart.</li>
                  <li><strong>Choose Your Size</strong><br />
                    Identify the corresponding "Size" based on your measurement.</li>
                </ol>
                
                <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                  <h4 className="font-semibold mb-2">💡 Example</h4>
                  <p className="text-sm text-muted-foreground">
                    If your bangle's inner diameter is 6.00CM, your bangle size is 2.6.
                  </p>
                </div>
              </div>
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