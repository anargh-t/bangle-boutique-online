import React, { useState, useEffect } from 'react';
import { getProductsByCategory, Product } from '../data/products';
import ProductCard from '../components/ProductCard';
import { useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Separator } from '../components/ui/separator';
import { Search, Loader2 } from 'lucide-react';

const Catalog = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || 'all';
  
  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(true);
  
  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'combo', name: 'Combo Bangles' },
    { id: 'elegant', name: 'Elegant Bangles' },
    { id: 'olive', name: 'Olive Bangles' },
    { id: 'oreo', name: 'Oreo Bangles' },
    { id: 'pearl', name: 'Pearl Bangles' },
    { id: 'raindrop', name: 'Raindrop Bangles' },
    { id: 'raindrop-multi', name: 'Raindrop Multi Color' },
    { id: 'others', name: 'Other Bangles' }
  ];

  // Handle category selection
  const handleCategorySelect = (selectedCategory: string) => {
    setCategory(selectedCategory);
    if (selectedCategory !== 'all') {
      setShowAllCategories(false);
    } else {
      setShowAllCategories(true);
    }
  };

  // Toggle category display
  const toggleCategoryDisplay = () => {
    setShowAllCategories(!showAllCategories);
  };


  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const products = await getProductsByCategory(category);
        setAllProducts(products);
        setFilteredProducts(products);
      } catch (err) {
        setError('Failed to load products');
        console.error('Error fetching products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  useEffect(() => {
    // Start with all products
    let filtered = [...allProducts];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        product => 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sort products
    let sorted = [...filtered];
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => {
          const aPrice = Math.min(...a.variations.map(v => v.price));
          const bPrice = Math.min(...b.variations.map(v => v.price));
          return aPrice - bPrice;
        });
        break;
      case 'price-high':
        sorted.sort((a, b) => {
          const aPrice = Math.max(...a.variations.map(v => v.price));
          const bPrice = Math.max(...b.variations.map(v => v.price));
          return bPrice - aPrice;
        });
        break;
      case 'newest':
        // In a real app, we would sort by date
        // Here we're just reversing for demonstration
        sorted.reverse();
        break;
      case 'featured':
      default:
        // Featured products first, then the rest
        sorted.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
        break;
    }
    
    setFilteredProducts(sorted);
  }, [searchQuery, sortBy, allProducts]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-4">Error loading products</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

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
              {/* Mobile: Show selected category prominently */}
              <div className="block md:hidden">
                {!showAllCategories && category !== 'all' && (
                  <div className="space-y-2">
                    <div className="px-3 py-2 bg-amber-100 border border-amber-300 rounded-md text-amber-700 text-sm font-medium">
                      {categories.find(cat => cat.id === category)?.name}
                    </div>
                    <Button
                      variant="outline"
                      className="justify-start w-full text-amber-600 border-amber-300 hover:bg-amber-50"
                      onClick={toggleCategoryDisplay}
                    >
                      Show All Categories
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Mobile: Show all categories when expanded */}
              <div className="block md:hidden">
                {showAllCategories && (
                  <>
                    {categories.map(cat => (
                      <Button
                        key={cat.id}
                        variant={cat.id === category ? "default" : "ghost"}
                        className={`justify-start w-full ${cat.id === category ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'hover:bg-muted'}`}
                        onClick={() => handleCategorySelect(cat.id)}
                      >
                        {cat.name}
                      </Button>
                    ))}
                  </>
                )}
              </div>
              
              {/* Desktop: Always show all categories */}
              <div className="hidden md:block">
                {categories.map(cat => (
                  <Button
                    key={cat.id}
                    variant={cat.id === category ? "default" : "ghost"}
                    className={`justify-start w-full ${cat.id === category ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'hover:bg-muted'}`}
                    onClick={() => setCategory(cat.id)}
                  >
                    {cat.name}
                  </Button>
                ))}
              </div>
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
