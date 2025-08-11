
import React, { useState, useEffect } from 'react';
import { getFeaturedProducts, Product } from '@/data/products';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2, AlertCircle } from 'lucide-react';

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const products = await getFeaturedProducts();
        console.log('Fetched featured products from Supabase:', products);
        console.log('Product images:', products.map(p => ({ id: p.id, name: p.name, images: p.images })));
        setFeaturedProducts(products);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError('Failed to load featured products. Please check your connection.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <h2 className="font-serif text-3xl font-bold mb-2">Featured Collection</h2>
              <p className="text-muted-foreground">Our handpicked selection of exquisite bangles</p>
            </div>
            <Button asChild variant="outline" className="mt-4 md:mt-0">
              <Link to="/catalog" className="flex items-center">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="flex justify-center py-12">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading featured products...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <h2 className="font-serif text-3xl font-bold mb-2">Featured Collection</h2>
              <p className="text-muted-foreground">Our handpicked selection of exquisite bangles</p>
            </div>
            <Button asChild variant="outline" className="mt-4 md:mt-0">
              <Link to="/catalog" className="flex items-center">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
            <p className="text-muted-foreground mb-4">{error}</p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Please check:</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Your internet connection</li>
                <li>• Supabase environment variables in .env file</li>
                <li>• Database tables are created</li>
              </ul>
            </div>
            <Button asChild className="mt-4">
              <Link to="/catalog">Browse All Products</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (featuredProducts.length === 0) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <h2 className="font-serif text-3xl font-bold mb-2">Featured Collection</h2>
              <p className="text-muted-foreground">Our handpicked selection of exquisite bangles</p>
            </div>
            <Button asChild variant="outline" className="mt-4 md:mt-0">
              <Link to="/catalog" className="flex items-center">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No featured products available at the moment.</p>
            <Button asChild>
              <Link to="/catalog">Browse All Products</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <h2 className="font-serif text-3xl font-bold mb-2">Featured Collection</h2>
            <p className="text-muted-foreground">Our handpicked selection of exquisite bangles</p>
          </div>
          <Button asChild variant="outline" className="mt-4 md:mt-0">
            <Link to="/catalog" className="flex items-center">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
