import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/data/products';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Get the lowest and highest prices from variations
  const prices = product.variations.map(v => v.price);
  const lowestPrice = Math.min(...prices);
  const highestPrice = Math.max(...prices);
  
  // Check if all variations are out of stock
  const allOutOfStock = product.variations.every(v => v.stock === 0);
  const someOutOfStock = product.variations.some(v => v.stock === 0);
  
  const priceDisplay = lowestPrice === highestPrice 
    ? `₹${lowestPrice.toFixed(2)}`
    : `₹${lowestPrice.toFixed(2)} - ₹${highestPrice.toFixed(2)}`;

  console.log('ProductCard rendering product:', { 
    id: product.id, 
    name: product.name, 
    images: product.images,
    firstImage: product.images[0] 
  });

  return (
    <Card className={`overflow-hidden h-full transition-all hover:shadow-md ${allOutOfStock ? 'opacity-75' : ''}`}>
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-square relative overflow-hidden group">
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              console.error('Image failed to load:', product.images[0]);
              console.error('Product:', product);
              // Set a fallback image
              e.currentTarget.src = '/placeholder.svg';
            }}
            onLoad={() => {
              console.log('Image loaded successfully:', product.images[0]);
            }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
          
          {/* Out of Stock Overlay */}
          {allOutOfStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="text-center text-white">
                <AlertCircle className="mx-auto h-8 w-8 mb-2" />
                <p className="font-medium">Out of Stock</p>
              </div>
            </div>
          )}
          
          {/* Stock Status Badge */}
          {someOutOfStock && !allOutOfStock && (
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="text-xs">
                {(() => {
                  const availableVariations = product.variations.filter(v => v.stock > 0);
                  if (availableVariations.length === 0) return "Out of Stock";
                  
                  const lowestStock = Math.min(...availableVariations.map(v => v.stock));
                  if (lowestStock <= 2) return `Only ${lowestStock} left`;
                  return "Limited Stock";
                })()}
              </Badge>
            </div>
          )}
          
          {/* Debug info - show image path */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {product.images[0]}
          </div>
        </div>
      </Link>
      
      <CardContent className="p-4">
        <h3 className="font-medium text-lg truncate">
          <Link to={`/product/${product.id}`} className="hover:text-primary transition-colors">
            {product.name}
          </Link>
        </h3>
        <p className="text-muted-foreground text-sm mb-2">
          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
        </p>
        
        {/* Stock Status */}
        {allOutOfStock && (
          <div className="mb-2">
            <Badge variant="destructive" className="text-xs">
              Out of Stock
            </Badge>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between items-center p-4 pt-0">
        <div className="font-medium">
          <span className={allOutOfStock ? 'text-muted-foreground line-through' : ''}>
            {priceDisplay}
          </span>
        </div>
        <Link 
          to={`/product/${product.id}`} 
          className={`text-sm font-medium flex items-center hover:underline ${
            allOutOfStock ? 'text-muted-foreground' : 'text-primary'
          }`}
        >
          {allOutOfStock ? 'Check Availability' : 'View Details'} <ArrowRight className="ml-1 h-3 w-3" />
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
