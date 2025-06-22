import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/data/products';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Get the lowest and highest prices from variations
  const prices = product.variations.map(v => v.price);
  const lowestPrice = Math.min(...prices);
  const highestPrice = Math.max(...prices);
  
  const priceDisplay = lowestPrice === highestPrice 
    ? `₹${lowestPrice.toFixed(2)}`
    : `₹${lowestPrice.toFixed(2)} - ₹${highestPrice.toFixed(2)}`;

  return (
    <Card className="overflow-hidden h-full transition-all hover:shadow-md">
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-square relative overflow-hidden group">
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
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
      </CardContent>
      
      <CardFooter className="flex justify-between items-center p-4 pt-0">
        <div className="font-medium">
          <span>{priceDisplay}</span>
        </div>
        <Link 
          to={`/product/${product.id}`} 
          className="text-sm font-medium flex items-center text-primary hover:underline"
        >
          View Details <ArrowRight className="ml-1 h-3 w-3" />
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
