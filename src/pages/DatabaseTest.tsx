import React, { useState, useEffect } from 'react';
import { fetchProducts, getFeaturedProducts } from '../data/products';

const DatabaseTest = () => {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testDatabase = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Testing database connection...');
      
      // Test fetching all products
      const all = await fetchProducts();
      console.log('All products:', all);
      setAllProducts(all);
      
      // Test fetching featured products
      const featured = await getFeaturedProducts();
      console.log('Featured products:', featured);
      setFeaturedProducts(featured);
      
    } catch (err: any) {
      console.error('Database test failed:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const testImage = (imagePath: string) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ success: true, path: imagePath });
      img.onerror = () => resolve({ success: false, path: imagePath });
      img.src = imagePath;
    });
  };

  const testAllImages = async () => {
    const allImages = allProducts.flatMap(p => p.images);
    console.log('Testing all images:', allImages);
    
    for (const imagePath of allImages) {
      const result = await testImage(imagePath);
      console.log(`Image test result for ${imagePath}:`, result);
    }
  };

  useEffect(() => {
    testDatabase();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Database Connection Test</h1>
        
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Test Controls */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
            <div className="space-x-4">
              <button
                onClick={testDatabase}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {isLoading ? 'Testing...' : 'Test Database'}
              </button>
              <button
                onClick={testAllImages}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Test All Images
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* All Products */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">All Products ({allProducts.length})</h2>
            {allProducts.length === 0 ? (
              <p className="text-gray-500">No products found in database</p>
            ) : (
              <div className="space-y-4">
                {allProducts.map((product, index) => (
                  <div key={index} className="border p-4 rounded">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-gray-600">ID: {product.id}</p>
                    <p className="text-sm text-gray-600">Category: {product.category}</p>
                    <p className="text-sm text-gray-600">Featured: {product.featured ? 'Yes' : 'No'}</p>
                    <div className="mt-2">
                      <p className="text-sm font-medium">Images:</p>
                      <div className="flex space-x-2 mt-1">
                        {product.images.map((image: string, imgIndex: number) => (
                          <div key={imgIndex} className="text-xs bg-gray-100 p-2 rounded">
                            {image}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm font-medium">Variations ({product.variations?.length || 0}):</p>
                      {product.variations?.map((variation: any, varIndex: number) => (
                        <div key={varIndex} className="text-xs bg-gray-100 p-2 rounded mt-1">
                          {variation.color} - {variation.size} - ₹{variation.price} - Stock: {variation.stock}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Featured Products */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Featured Products ({featuredProducts.length})</h2>
            {featuredProducts.length === 0 ? (
              <p className="text-gray-500">No featured products found</p>
            ) : (
              <div className="space-y-4">
                {featuredProducts.map((product, index) => (
                  <div key={index} className="border p-4 rounded">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-gray-600">ID: {product.id}</p>
                    <p className="text-sm text-gray-600">Category: {product.category}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseTest;


