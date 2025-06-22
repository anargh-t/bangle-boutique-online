import React, { useState, useEffect } from 'react';
import { getProductsByCategory, products } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Search } from 'lucide-react';

const Catalog = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || 'all';
  
  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  
  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'combo', name: 'Combo Bangles' },
    { id: 'elegant', name: 'Elegant Bangles' },
    { id: 'olive', name: 'Olive Bangles' },
    { id: 'oreo', name: 'Oreo Bangles' },
    { id: 'pearl', name: 'Pearl Bangles' },
    { id: 'raindrop', name: 'Raindrop Bangles' },
    { id: 'raindrop-multi', name: 'Raindrop Multi Color' }
  ];

  useEffect(() => {
    // Filter products based on category and search query
    let result = getProductsByCategory(category);
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        product => 
          product.name.toLowerCase().includes(query) || 
          product.description.toLowerCase().includes(query)
      );
    }
    
    // Sort products
    switch (sortBy) {
      case 'price-low':
        result = [...result].sort((a, b) => {
          const aPrice = Math.min(...a.variations.map(v => v.price));
          const bPrice = Math.min(...b.variations.map(v => v.price));
          return aPrice - bPrice;
        });
        break;
      case 'price-high':
        result = [...result].sort((a, b) => {
          const aPrice = Math.max(...a.variations.map(v => v.price));
          const bPrice = Math.max(...b.variations.map(v => v.price));
          return bPrice - aPrice;
        });
        break;
      case 'newest':
        // In a real app, we would sort by date
        // Here we're just reversing for demonstration
        result = [...result].reverse();
        break;
      case 'featured':
      default:
        // Featured products first, then the rest
        result = [...result].sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
        break;
    }
    
    setFilteredProducts(result);
  }, [category, sortBy, searchQuery]);

  return (
    <div className="min-h-screen pt-20">
      {/* Catalog Header */}
      <div className="bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl font-bold mb-4 text-center">Our Collection</h1>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto">
            Discover our exquisite range of handcrafted bangles, designed to complement every style and occasion.
          </p>
        </div>
      </div>
      
      {/* Filters and Products */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filter Sidebar */}
          <div className="md:w-1/4 lg:w-1/5">
            <h2 className="font-medium text-lg mb-4">Categories</h2>
            <div className="space-y-2 mb-8">
              {categories.map(cat => (
                <Button
                  key={cat.id}
                  variant={cat.id === category ? "default" : "ghost"}
                  className={`justify-start w-full ${cat.id === category ? '' : 'hover:bg-muted'}`}
                  onClick={() => setCategory(cat.id)}
                >
                  {cat.name}
                </Button>
              ))}
            </div>
            
            <Separator className="my-6" />
            
            <div className="space-y-4">
              <h2 className="font-medium text-lg mb-4">Search</h2>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                <Input 
                  type="text" 
                  placeholder="Search bangles..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort controls */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-muted-foreground">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Products */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search or filter criteria</p>
                <Button onClick={() => { setCategory('all'); setSearchQuery(''); }}>
                  View All Products
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalog;
