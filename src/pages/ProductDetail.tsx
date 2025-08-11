import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, getRelatedProducts, Product, Variation } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, ChevronLeft, Loader2, AlertCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { toast } from '@/components/ui/sonner';
import ProductCard from '@/components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [availableVariations, setAvailableVariations] = useState<Variation[]>([]);
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(null);
  
  // Related products (in a real app, we'd get these based on category/tags)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  
  // Touch/swipe functionality
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const foundProduct = await getProductById(id);
        
        if (foundProduct) {
          setProduct(foundProduct);
          
          // Set initial image
          setSelectedImage(foundProduct.images[0]);
          
          // Get unique colors from variations
          const uniqueColors = Array.from(new Set(foundProduct.variations.map(v => v.color)));
          if (uniqueColors.length > 0) {
            setSelectedColor(uniqueColors[0]);
          }
          
          // Get related products using the new function
          const related = await getRelatedProducts(foundProduct, 4);
          setRelatedProducts(related);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Failed to load product');
        console.error('Error fetching product:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  // Update available sizes when color changes
  useEffect(() => {
    if (!product || !selectedColor) return;
    
    const variations = product.variations.filter(v => v.color === selectedColor);
    setAvailableVariations(variations);
    
    // Reset selected size
    if (variations.length > 0) {
      setSelectedSize(variations[0].size);
    }
  }, [product, selectedColor]);
  
  // Update selected variation when color or size changes
  useEffect(() => {
    if (!product || !selectedColor || !selectedSize) return;
    
    const variation = product.variations.find(
      v => v.color === selectedColor && v.size === selectedSize
    );
    
    if (variation) {
      setSelectedVariation(variation);
    }
  }, [product, selectedColor, selectedSize]);

  // Check if all variations are out of stock
  const allVariationsOutOfStock = product?.variations.every(v => v.stock === 0) || false;
  const hasAvailableVariations = product?.variations.some(v => v.stock > 0) || false;
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow empty string for clearing
    if (value === '') {
      setQuantity(0);
      return;
    }
    
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 1) {
      setQuantity(1);
    } else {
      setQuantity(numValue);
    }
  };
  
  const handleAddToCart = () => {
    if (!product || !selectedVariation) {
      toast.error('Please select all options before adding to cart');
      return;
    }
    
    // Check if quantity is valid
    if (quantity <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }
    
    // Check if quantity exceeds available stock
    if (quantity > selectedVariation.stock) {
      toast.error(`Only ${selectedVariation.stock} items available in stock`);
      return;
    }
    
    // Check if item is out of stock
    if (selectedVariation.stock === 0) {
      toast.error('This item is out of stock');
      return;
    }
    
    addToCart(product, selectedVariation, quantity);
  };

  // Touch/swipe handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && product) {
      // Swipe left - next image
      const currentIndex = product.images.indexOf(selectedImage);
      const nextIndex = (currentIndex + 1) % product.images.length;
      setSelectedImage(product.images[nextIndex]);
    } else if (isRightSwipe && product) {
      // Swipe right - previous image
      const currentIndex = product.images.indexOf(selectedImage);
      const prevIndex = currentIndex === 0 ? product.images.length - 1 : currentIndex - 1;
      setSelectedImage(product.images[nextIndex]);
    }
  };
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-4">Product not found</h2>
          <p className="text-muted-foreground mb-6">
            {error || "The product you're looking for doesn't exist or has been removed."}
          </p>
          <Button asChild>
            <Link to="/catalog">Back to Shop</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Calculate the price with discount if applicable
  const price = selectedVariation?.price || 0;
  
  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link to="/catalog" className="text-sm flex items-center text-muted-foreground hover:text-primary">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Shop
          </Link>
        </div>
        
        {/* Product Details */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Product Images */}
          <div className="lg:w-1/2 space-y-4">
            {/* Main Image */}
            <div 
              className="aspect-square bg-muted/30 rounded-lg overflow-hidden relative"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <img 
                src={selectedImage} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {/* Swipe indicator */}
              {product.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {product.images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        product.images[index] === selectedImage 
                          ? 'bg-white' 
                          : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden ${selectedImage === img ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100'}`}
                    onClick={() => setSelectedImage(img)}
                  >
                    <img 
                      src={img} 
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="lg:w-1/2">
            <h1 className="font-serif text-3xl font-bold mb-2">{product.name}</h1>
            
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-muted-foreground capitalize">
                {product.category}
              </span>
            </div>
            
            {/* Price */}
            <div className="flex items-center mb-6">
              <span className="text-2xl font-bold">
                ₹{price.toFixed(2)}
              </span>
            </div>
            
            {/* Description */}
            <p className="text-muted-foreground mb-6">
              {product.description}
            </p>
            
            <Separator className="my-6" />
            
            {/* Variations Selection */}
            <div className="space-y-6">
              {/* Out of Stock Warning */}
              {allVariationsOutOfStock && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertCircle className="h-5 w-5" />
                    <div>
                      <p className="font-medium">This product is currently out of stock</p>
                      <p className="text-sm text-red-600">Please contact us for availability updates or check back later.</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Color
                </label>
                <div className="flex gap-2">
                  {Array.from(new Set(product.variations.map(v => v.color))).map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      disabled={allVariationsOutOfStock}
                      className={`relative px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden ${
                        selectedColor === color
                          ? 'bg-amber-100 border-amber-400 text-amber-700 shadow-lg ring-2 ring-amber-200 scale-105'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-600 hover:shadow-md'
                      } ${
                        allVariationsOutOfStock
                          ? 'opacity-50 cursor-not-allowed'
                          : 'cursor-pointer'
                      }`}
                    >
                      <span className="relative z-10">{color}</span>
                      {selectedColor === color && (
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-200/20 to-amber-100/20 animate-pulse"></div>
                      )}
                    </button>
                  ))}
                </div>
                {allVariationsOutOfStock && (
                  <p className="text-sm text-red-600 mt-1">No color options available</p>
                )}
              </div>
              
              {/* Size Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Size
                </label>
                <div className="flex gap-2">
                  {availableVariations.map(variation => (
                    <button
                      key={variation.size}
                      onClick={() => setSelectedSize(variation.size)}
                      disabled={variation.stock === 0 || allVariationsOutOfStock}
                      className={`relative px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden ${
                        selectedSize === variation.size
                          ? 'bg-amber-100 border-amber-400 text-amber-700 shadow-lg ring-2 ring-amber-200 scale-105'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-600 hover:shadow-md'
                      } ${
                        variation.stock === 0 || allVariationsOutOfStock
                          ? 'opacity-50 cursor-not-allowed'
                          : 'cursor-pointer'
                      }`}
                    >
                      <div className="flex flex-col items-center relative z-10">
                        <span className="font-semibold">{variation.size}"</span>
                        {variation.stock === 0 && (
                          <span className="text-xs text-red-500">Out of stock</span>
                        )}
                        {variation.stock > 0 && variation.stock <= 2 && (
                          <span className="text-xs text-amber-600 font-medium">Only {variation.stock} left</span>
                        )}
                      </div>
                      {selectedSize === variation.size && (
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-200/20 to-amber-100/20 animate-pulse"></div>
                      )}
                    </button>
                  ))}
                </div>
                {!selectedColor && !allVariationsOutOfStock && (
                  <p className="text-sm text-muted-foreground mt-1">Please select a color first</p>
                )}
                {selectedColor && availableVariations.length === 0 && !allVariationsOutOfStock && (
                  <p className="text-sm text-red-600 mt-1">No size options available for this color</p>
                )}
              </div>
              
              {/* Stock Status */}
              {selectedVariation && (
                <div className="text-sm">
                  {selectedVariation.stock === 0 ? (
                    <Badge variant="destructive">Out of Stock</Badge>
                  ) : selectedVariation.stock <= 2 ? (
                    <Badge variant="secondary">Only {selectedVariation.stock} left</Badge>
                  ) : (
                    <Badge variant="outline">In Stock</Badge>
                  )}
                </div>
              )}
              
              {!selectedVariation && !allVariationsOutOfStock && (
                <div className="text-sm">
                  <Badge variant="outline">Select options to see stock status</Badge>
                </div>
              )}
              
              {/* Quantity */}
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  max={selectedVariation?.stock || 1}
                  value={quantity === 0 ? '' : quantity}
                  onChange={handleQuantityChange}
                  className="flex h-10 w-24 sm:w-32 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!selectedVariation || selectedVariation.stock === 0 || allVariationsOutOfStock}
                  placeholder={!selectedVariation ? "Select options first" : "1"}
                />
                {!selectedVariation && (
                  <p className="text-sm text-muted-foreground mt-1">Please select color and size first</p>
                )}
              </div>
              
              {/* Add to Cart Button */}
              <Button 
                className="w-full sm:w-auto sm:px-8"
                onClick={handleAddToCart}
                disabled={!selectedVariation || selectedVariation.stock === 0 || allVariationsOutOfStock}
              >
                <ShoppingBag className="mr-2 h-4 w-4" /> 
                {!selectedVariation ? 'Select Options' : selectedVariation.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              
              {/* WhatsApp Buy/Enquire Button */}
              {!selectedVariation ? (
                <div className="w-full sm:w-auto sm:px-8 p-3 bg-gray-100 border border-gray-300 rounded text-center text-gray-600 text-sm">
                  Please select color and size to enquire
                </div>
              ) : selectedVariation.stock === 0 ? (
                <div className="w-full sm:w-auto sm:px-8 p-3 bg-gray-100 border border-gray-300 rounded text-center text-gray-600 text-sm">
                  Out of Stock - Contact us for availability updates
                </div>
              ) : (
                <a
                  href={`https://wa.me/917012849883?text=${encodeURIComponent(`Hello, I'm interested in the product: ${product.name} (${selectedSize} inches, ${selectedColor}). Is it available?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto sm:px-8 mt-2 inline-flex justify-center items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium"
                  style={{ textAlign: 'center' }}
                >
                  Buy/Enquire on WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
        
        <Separator className="my-12" />
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="font-serif text-3xl font-bold mb-2">You May Also Like</h2>
              <p className="text-muted-foreground">Discover more beautiful bangles from our collection</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Button asChild variant="outline">
                <Link to="/catalog">View All Products</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
