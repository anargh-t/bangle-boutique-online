import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Search as SearchIcon, X } from 'lucide-react';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState('featured');
  const [filteredProducts, setFilteredProducts] = useState(products);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'combo', name: 'Combo Bangles' },
    { id: 'elegant', name: 'Elegant Bangles' },
    { id: 'olive', name: 'Olive Bangles' },
    { id: 'oreo', name: 'Oreo Bangles' },
    { id: 'pearl', name: 'Pearl Bangles' },
    { id: 'raindrop', name: 'Raindrop Bangles' },
    { id: 'raindrop-multi', name: 'Raindrop Multi Color' }
  ];

  useEffect(() => {
    // Update URL params when search changes
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (category !== 'all') params.set('category', category);
    if (sortBy !== 'featured') params.set('sort', sortBy);
    setSearchParams(params);
  }, [searchQuery, category, sortBy, setSearchParams]);

  useEffect(() => {
    // Filter and sort products
    let result = products;

    // Filter by category
    if (category !== 'all') {
      result = result.filter(product => product.category === category);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        product => 
          product.name.toLowerCase().includes(query) || 
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
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
      case 'name':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        result = [...result].sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
        break;
    }

    setFilteredProducts(result);
  }, [searchQuery, category, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by useEffect
  };

  const clearSearch = () => {
    setSearchQuery('');
    setCategory('all');
    setSortBy('featured');
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Search Header */}
      <div className="bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl font-bold mb-4 text-center">Search Bangles</h1>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto">
            Find your perfect bangles with our comprehensive search and filter options.
          </p>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search bangles by name, description, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                {searchQuery && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Button type="submit" className="md:w-auto">
                Search
              </Button>
            </div>
          </form>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="md:w-1/3">
              <label className="block text-sm font-medium mb-2">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:w-1/3">
              <label className="block text-sm font-medium mb-2">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:w-1/3 flex items-end">
              <Button variant="outline" onClick={clearSearch} className="w-full">
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Results */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'} found
              </h2>
              {(searchQuery || category !== 'all') && (
                <Button variant="ghost" onClick={clearSearch} size="sm">
                  Clear all
                </Button>
              )}
            </div>
            
            {searchQuery && (
              <p className="text-muted-foreground mb-4">
                Showing results for "{searchQuery}"
              </p>
            )}
          </div>

          <Separator className="mb-8" />

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <SearchIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <Button onClick={clearSearch}>
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
