import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, getRelatedProducts, Product, Variation } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, ChevronLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { toast } from '@/components/ui/sonner';
import ProductCard from '@/components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
    
    const fetchProduct = () => {
      setIsLoading(true);
      const foundProduct = getProductById(id);
      
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
        const related = getRelatedProducts(foundProduct, 4);
        setRelatedProducts(related);
      }
      
      setIsLoading(false);
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
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) {
      setQuantity(1);
    } else {
      setQuantity(value);
    }
  };
  
  const handleAddToCart = () => {
    if (!product || !selectedVariation) {
      toast.error('Please select all options before adding to cart');
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
      setSelectedImage(product.images[prevIndex]);
    }
  };
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-pulse space-y-8 w-full max-w-4xl p-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2 aspect-square bg-muted rounded"></div>
            <div className="md:w-1/2 space-y-4">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-32 bg-muted rounded"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
              <div className="h-12 bg-muted rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-4">Product not found</h2>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or has been removed.</p>
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
              {/* Color Selection */}
              <div>
                <label htmlFor="color-select" className="block text-sm font-medium mb-2">
                  Color
                </label>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                  <SelectTrigger id="color-select" className="w-full">
                    <SelectValue placeholder="Select Color" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(new Set(product.variations.map(v => v.color))).map(color => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Size Selection */}
              <div>
                <label htmlFor="size-select" className="block text-sm font-medium mb-2">
                  Size
                </label>
                <Select
                  value={selectedSize}
                  onValueChange={setSelectedSize}
                  disabled={!selectedColor || availableVariations.length === 0}
                >
                  <SelectTrigger id="size-select" className="w-full">
                    <SelectValue placeholder="Select Size" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVariations.map(variation => (
                      <SelectItem key={variation.size} value={variation.size}>
                        {variation.size} inches
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Quantity */}
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              
              {/* Add to Cart Button */}
              <Button 
                className="w-full"
                onClick={handleAddToCart}
                disabled={!selectedVariation}
              >
                <ShoppingBag className="mr-2 h-4 w-4" /> 
                Add to Cart
              </Button>
              {/* WhatsApp Buy/Enquire Button */}
              <a
                href={`https://wa.me/917012849883?text=${encodeURIComponent(`Hello, I'm interested in the product: ${product.name} (${selectedSize} inches, ${selectedColor}). Is it available?`)}
                `}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-2 inline-flex justify-center items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium"
                style={{ textAlign: 'center' }}
              >
                Buy/Enquire on WhatsApp
              </a>
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
