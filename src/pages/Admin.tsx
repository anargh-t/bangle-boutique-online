import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from '@/components/ui/sonner';
import { Plus, Edit, Trash2, Loader2, Save, X, Upload, Image as ImageIcon, AlertCircle, Database, Settings, LogOut, User, Search, Home, Grid, Info, Mail, HelpCircle, Truck, Ruler } from 'lucide-react';
import { 
  fetchProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  updateVariationStock,
  updateVariationActive,
  Product, 
  Variation 
} from '../data/products';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface ProductFormData {
  id: string;
  name: string;
  description: string;
  category: string;
  featured: boolean;
  images: string[];
  variations: Omit<Variation, 'id'>[];
}

interface ImageFile {
  file: File;
  preview: string;
  uploaded: boolean;
  url?: string;
}

const Admin = () => {
  const { user, signOut } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    id: '',
    name: '',
    description: '',
    category: '',
    featured: false,
    images: [],
    variations: [{ color: '', size: '', price: 0, stock: 0, active: true }]
  });

  const categories = [
    'combo', 'elegant', 'olive', 'oreo', 'pearl', 'raindrop', 'raindrop-multi'
  ];

  // Sort variations by size in correct order
  const sortVariationsBySize = (variations: any[]) => {
    const sizeOrder = ['2.2', '2.4', '2.6', '2.8'];
    return [...variations].sort((a, b) => {
      const aIndex = sizeOrder.indexOf(a.size);
      const bIndex = sizeOrder.indexOf(b.size);
      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  };

  useEffect(() => {
    checkConfiguration();
    loadProducts();
  }, []);

  // Initialize filteredProducts when products change
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const checkConfiguration = async () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project-id') || supabaseKey.includes('your_anon_key')) {
      setConfigError('Supabase configuration is missing or incomplete. Please check your .env file.');
      return;
    }
    
    try {
      // Test basic connection
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setConfigError(`Database connection failed: ${error.message}`);
        return;
      }
      
      // Test if tables exist by trying to fetch products
      const { data: testData, error: testError } = await supabase
        .from('products')
        .select('id')
        .limit(1);
      
      if (testError) {
        setConfigError(`Database tables not accessible: ${testError.message}. Please check if tables exist and RLS policies are correct.`);
        return;
      }
      
      setConfigError(null);
    } catch (error: any) {
      setConfigError(`Configuration check failed: ${error.message}`);
    }
  };

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
      setFilteredProducts(fetchedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      description: '',
      category: '',
      featured: false,
      images: [],
      variations: [{ color: '', size: '', price: 0, stock: 0, active: true }]
    });
    // Clear image files and revoke object URLs to prevent memory leaks
    imageFiles.forEach(img => {
      if (img.preview) {
        URL.revokeObjectURL(img.preview);
      }
    });
    setImageFiles([]);
    setIsEditMode(false);
    setEditingProduct(null);
  };

  // Upload image to Supabase Storage
  const uploadImageToStorage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (error) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleImageUpload = useCallback((files: FileList) => {
    const newImageFiles: ImageFile[] = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      uploaded: false
    }));
    
    setImageFiles(prev => [...prev, ...newImageFiles]);
    
    // Don't add empty strings to formData.images - we'll handle this in handleSubmit
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files) {
      handleImageUpload(e.dataTransfer.files);
    }
  }, [handleImageUpload]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleImageUpload(e.target.files);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => {
      const newFiles = prev.filter((_, i) => i !== index);
      // Revoke object URL to prevent memory leaks
      if (prev[index]?.preview) {
        URL.revokeObjectURL(prev[index].preview);
      }
      return newFiles;
    });
  };

  const handleAddVariation = () => {
    setFormData(prev => ({
      ...prev,
      variations: [...prev.variations, { color: '', size: '', price: 0, stock: 0, active: true }]
    }));
  };

  const handleRemoveVariation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variations: prev.variations.filter((_, i) => i !== index)
    }));
  };

  const handleVariationChange = (index: number, field: keyof Omit<Variation, 'id'>, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      variations: prev.variations.map((variation, i) => 
        i === index ? { ...variation, [field]: value } : variation
      )
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) return 'Product name is required';
    if (!formData.description.trim()) return 'Product description is required';
    if (!formData.category) return 'Product category is required';
    if (formData.variations.length === 0) return 'At least one variation is required';
    
    for (const variation of formData.variations) {
      if (!variation.color.trim()) return 'Color is required for all variations';
      if (!variation.size.trim()) return 'Size is required for all variations';
      if (variation.price <= 0) return 'Price must be greater than 0 for all variations';
      if (variation.stock < 0) return 'Stock cannot be negative';
    }
    
    // Check if we have at least one image (either uploaded or URL)
    const hasImages = imageFiles.length > 0 || formData.images.some(img => img.trim());
    if (!hasImages) return 'Please provide at least one product image';
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    // Check if database is configured
    if (configError) {
      toast.error('Database is not configured. Please complete the setup first.');
      return;
    }

    setIsSubmitting(true);
    try {
      let finalImages: string[] = [];
      
      // Upload new image files to Supabase Storage
      for (let i = 0; i < imageFiles.length; i++) {
        const imageFile = imageFiles[i];
        if (!imageFile.uploaded && imageFile.file) {
          try {
            const uploadedUrl = await uploadImageToStorage(imageFile.file);
            finalImages.push(uploadedUrl);
            // Mark as uploaded
            setImageFiles(prev => prev.map((img, idx) => 
              idx === i ? { ...img, uploaded: true, url: uploadedUrl } : img
            ));
          } catch (error: any) {
            toast.error(`Failed to upload image ${imageFile.file.name}: ${error.message}`);
            return;
          }
        } else if (imageFile.url) {
          // Use already uploaded URL
          finalImages.push(imageFile.url);
        }
      }
      
      // If editing and no new images uploaded, use remaining existing images (after deletions)
      if (isEditMode && editingProduct && finalImages.length === 0) {
        finalImages = editingProduct.images;
      }
      
      if (finalImages.length === 0) {
        toast.error('At least one image is required');
        return;
      }
      
      if (isEditMode && editingProduct) {
        // Update existing product
        const productData = {
          name: formData.name,
          description: formData.description,
          category: formData.category,
          featured: formData.featured,
          images: finalImages,
          variations: formData.variations.map(v => ({
            id: editingProduct.variations.find(ev => 
              ev.color === v.color && ev.size === v.size
            )?.id || '',
            color: v.color,
            size: v.size,
            price: v.price,
            stock: v.stock,
            active: v.active
          }))
        };

        const updatedProduct = await updateProduct(editingProduct.id, productData);
        if (updatedProduct) {
          toast.success('Product updated successfully!');
          setShowForm(false);
          resetForm();
          loadProducts();
        } else {
          toast.error('Failed to update product');
        }
      } else {
        // Create new product
        const productData = {
          name: formData.name,
          description: formData.description,
          category: formData.category,
          featured: formData.featured,
          images: finalImages,
          variations: formData.variations.map(v => ({
            color: v.color,
            size: v.size,
            price: v.price,
            stock: v.stock,
            active: v.active
          }))
        };

        console.log('Attempting to create product with data:', productData);
        const newProduct = await createProduct(productData);
        console.log('createProduct result:', newProduct);
        if (newProduct) {
          toast.success('Product created successfully!');
          setShowForm(false);
          resetForm();
          loadProducts();
        } else {
          toast.error('Failed to create product');
        }
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'An error occurred while saving the product';
      toast.error(errorMessage);
      console.error('Error submitting product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsEditMode(true);
    setFormData({
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category,
      featured: product.featured || false,
      images: product.images, // Load existing images
      variations: product.variations.map(v => ({ color: v.color, size: v.size, price: v.price, stock: v.stock, active: v.active ?? true }))
    });
    setImageFiles([]); // Clear uploaded files for edit mode
    setShowForm(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      const success = await deleteProduct(productId);
      if (success) {
        toast.success('Product deleted successfully!');
        loadProducts();
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error('Error deleting product:', error);
    }
  };

  const handleStockUpdate = async (variationId: string, newStock: number) => {
    try {
      const success = await updateVariationStock(variationId, newStock);
      if (success) {
        toast.success('Stock updated successfully!');
        loadProducts();
      } else {
        toast.error('Failed to update stock');
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error('Error updating stock:', error);
    }
  };

  const handleActiveToggle = async (variationId: string, currentActive: boolean) => {
    try {
      const success = await updateVariationActive(variationId, !currentActive);
      if (success) {
        toast.success(`Variation ${!currentActive ? 'activated' : 'deactivated'} successfully!`);
        loadProducts(); // Refresh the products list
      } else {
        toast.error('Failed to toggle active status');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Error toggling active status');
    }
  };

  const openNewProductForm = () => {
    resetForm();
    setShowForm(true);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const handleRemoveCurrentImage = (index: number) => {
    if (editingProduct) {
      if (confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
        const updatedImages = editingProduct.images.filter((_, i) => i !== index);
        setEditingProduct(prev => ({ ...prev, images: updatedImages }));
        toast.success('Image deleted successfully!');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Show configuration error if Supabase is not properly configured
  if (configError) {
  return (
    <div className="min-h-screen pt-20 bg-muted/30">
      <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <Database className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-4" />
              <h1 className="text-2xl sm:text-3xl font-bold mb-4">Database Configuration Required</h1>
              <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                The Admin panel requires a properly configured Supabase database to function.
              </p>
            </div>
            
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Configuration Error</AlertTitle>
              <AlertDescription>{configError}</AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Setup Instructions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
          <div>
                  <h3 className="font-semibold mb-2">1. Create a Supabase Project</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">supabase.com</a> and create a new project.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">2. Get Your Credentials</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    In your Supabase dashboard, go to Settings → API and copy your Project URL and Anon Key.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">3. Create Environment File</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Create a <code className="bg-muted px-1 py-0.5 rounded text-xs">.env</code> file in your project root with:
                  </p>
                  <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here`}
                  </pre>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">4. Set Up Database</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Run the SQL commands from <code className="bg-muted px-1 py-0.5 rounded text-xs">database-schema.sql</code> in your Supabase SQL Editor.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">5. Restart Development Server</h3>
                  <p className="text-sm text-muted-foreground">
                    After setting up the environment variables, restart your development server.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <div className="text-center mt-6 space-y-4">
              <Button onClick={checkConfiguration} className="flex items-center gap-2 mx-auto">
                <Database className="h-4 w-4" />
                Check Configuration Again
              </Button>
              
              <div className="text-sm text-muted-foreground">
                <p>If you're still having issues, try running this SQL in your Supabase SQL Editor:</p>
                <details className="mt-2">
                  <summary className="cursor-pointer text-primary hover:underline">Show SQL Commands</summary>
                  <pre className="bg-muted p-3 rounded text-xs overflow-x-auto mt-2 text-left">
{`-- Update RLS policies to allow public access for testing
DROP POLICY IF EXISTS "Allow authenticated users to manage products" ON products;
DROP POLICY IF EXISTS "Allow authenticated users to manage variations" ON variations;

CREATE POLICY "Allow public access to manage products" ON products
  FOR ALL USING (true);

CREATE POLICY "Allow public access to manage variations" ON variations
  FOR ALL USING (true);`}
                  </pre>
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">Manage your product catalog and inventory</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            {/* User Info */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span className="truncate max-w-[200px]">{user?.email}</span>
            </div>
            
            {/* Add Product Button - More Prominent */}
            <Button 
              onClick={openNewProductForm} 
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105" 
              size="lg"
            >
              <Plus className="h-5 w-5" />
              <span className="font-semibold">Add New Product</span>
          </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search products by name, description, or category..."
                className="w-full"
                onChange={(e) => {
                  const searchTerm = e.target.value.toLowerCase();
                  if (searchTerm === '') {
                    setFilteredProducts(products);
                  } else {
                    const filtered = products.filter(product => 
                      product.name.toLowerCase().includes(searchTerm) ||
                      product.description.toLowerCase().includes(searchTerm) ||
                      product.category.toLowerCase().includes(searchTerm)
                    );
                    setFilteredProducts(filtered);
                  }
                }}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => {
                setFilteredProducts(products);
                // Clear the search input
                const searchInput = document.querySelector('input[placeholder*="Search products"]') as HTMLInputElement;
                if (searchInput) searchInput.value = '';
              }}
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Reset
            </Button>
          </div>
          {filteredProducts.length !== products.length && (
            <div className="text-sm text-muted-foreground">
              Showing {filteredProducts.length} of {products.length} products
            </div>
          )}
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Products ({filteredProducts.length})</CardTitle>
            <CardDescription className="text-sm">Manage your product catalog and stock levels</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Mobile: Card Layout, Desktop: Table Layout */}
            <div className="block lg:hidden">
                              {/* Mobile Product Cards */}
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-8">
                    <Database className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Products Found</h3>
                    <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                      {configError 
                        ? 'Database connection issues prevent loading products. Please check your configuration.'
                        : filteredProducts.length === 0 && products.length > 0
                        ? 'No products match your search criteria.'
                        : 'Start building your catalog by adding your first product.'
                      }
                    </p>
                    {!configError && (
                      <Button onClick={openNewProductForm} className="flex items-center gap-2 mx-auto">
                        <Plus className="h-4 w-4" />
                        Add Your First Product
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredProducts.map(product => (
                    <div key={product.id} className="border rounded-lg p-3 sm:p-4 space-y-3">
                      {/* Product Header with Image */}
                      <div className="flex gap-3">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          {product.images && product.images.length > 0 ? (
                            <div className="relative group">
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border shadow-sm transition-transform group-hover:scale-105"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/placeholder.svg';
                                }}
                              />
                              {product.images.length > 1 && (
                                <div className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                                  +{product.images.length - 1}
                                </div>
                              )}
                              {/* Image count tooltip */}
                              {product.images.length > 1 && (
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                                  <span className="text-white text-xs font-medium bg-black/70 px-2 py-1 rounded">
                                    {product.images.length} images
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-lg border flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        
                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-base sm:text-lg break-words">{product.name}</h3>
                            </div>
                            <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(product)}
                                className="h-8 w-8 sm:h-9 sm:w-auto p-0 sm:px-3"
                              >
                                <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span className="hidden sm:inline ml-1">Edit</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(product.id)}
                                className="h-8 w-8 sm:h-9 sm:w-auto p-0 sm:px-3 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span className="hidden sm:inline ml-1">Delete</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Category:</span>
                          <Badge variant="outline" className="capitalize text-xs">
                            {product.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Featured:</span>
                          <Badge 
                            variant={product.featured ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {product.featured ? "Yes" : "No"}
                          </Badge>
                        </div>
                      </div>

                      {/* Variations */}
                      <div>
                        <span className="font-medium text-xs sm:text-sm">Variations:</span>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {sortVariationsBySize(product.variations).map(variation => (
                            <div key={variation.id} className="bg-muted/50 rounded p-2 text-xs flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="font-medium capitalize">{variation.color} • {variation.size}"</div>
                                <div className="text-muted-foreground">₹{variation.price} • Stock: {variation.stock}</div>
                              </div>
                              <Badge 
                                variant={(variation.active ?? true) ? "default" : "secondary"} 
                                className="text-xs cursor-pointer hover:opacity-80 ml-2 flex-shrink-0"
                                onClick={() => handleActiveToggle(variation.id, variation.active ?? true)}
                              >
                                {(variation.active ?? true) ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                    <TableHead>Images</TableHead>
                  <TableHead>Variations</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-center">
                        <Database className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Products Found</h3>
                        <p className="text-muted-foreground mb-4">
                          {configError 
                            ? 'Database connection issues prevent loading products. Please check your configuration.'
                            : filteredProducts.length === 0 && products.length > 0
                            ? 'No products match your search criteria.'
                            : 'Start building your catalog by adding your first product.'
                          }
                        </p>
                        {!configError && (
                          <Button onClick={openNewProductForm} className="flex items-center gap-2 mx-auto">
                            <Plus className="h-4 w-4" />
                            Add Your First Product
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map(product => (
                  <TableRow key={product.id}>
                    <TableCell>
                        <div className="flex items-center gap-3">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                                                      {product.images && product.images.length > 0 ? (
                            <div className="relative group">
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded border shadow-sm transition-transform group-hover:scale-110"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/placeholder.svg';
                                }}
                              />
                              {product.images.length > 1 && (
                                <div className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                                  +{product.images.length - 1}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-muted rounded border flex items-center justify-center">
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                          </div>
                          
                          {/* Product Info */}
                          <div className="min-w-0">
                            <div className="font-medium break-words">{product.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {product.category}
                      </Badge>
                    </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {product.images && product.images.length > 0 ? (
                            <>
                              <div className="relative group">
                                <img
                                  src={product.images[0]}
                                  alt="Main"
                                  className="w-10 h-10 object-cover rounded border shadow-sm transition-transform group-hover:scale-110"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/placeholder.svg';
                                  }}
                                />
                                {product.images.length > 1 && (
                                  <div className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                                    +{product.images.length - 1}
                                  </div>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {product.images.length} image{product.images.length !== 1 ? 's' : ''}
                              </span>
                            </>
                          ) : (
                            <div className="w-10 h-10 bg-muted rounded border flex items-center justify-center">
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {sortVariationsBySize(product.variations).map(variation => (
                            <div key={variation.id} className="flex items-center gap-1 text-xs">
                            <span className="capitalize">{variation.color}</span>
                            <span>•</span>
                            <span>{variation.size}"</span>
                            <span>•</span>
                            <span>₹{variation.price}</span>
                            <span>•</span>
                              <span className="text-muted-foreground">Stock: {variation.stock}</span>
                              <span>•</span>
                              <Badge 
                                variant={(variation.active ?? true) ? "default" : "secondary"} 
                                className="text-xs cursor-pointer hover:opacity-80"
                                onClick={() => handleActiveToggle(variation.id, variation.active ?? true)}
                              >
                                {(variation.active ?? true) ? "Active" : "Inactive"}
                              </Badge>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {product.featured ? (
                        <Badge variant="default">Featured</Badge>
                      ) : (
                        <Badge variant="secondary">Regular</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                          
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          </CardContent>
        </Card>

        {/* Add/Edit Product Form Dialog */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
              <DialogDescription>
                {isEditMode ? 'Update the product information and variations.' : 'Create a new product with variations and stock levels.'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Product Information */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter product name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category} className="capitalize">
                        {category.replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter product description"
                  rows={3}
                  required
                />
              </div>

              {/* Images Section */}
              <div>
                <Label className="text-lg font-medium">Product Images *</Label>
                
                {/* Drag & Drop Upload Area */}
                <div
                  className={`mt-2 border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    isDragOver 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop images here, or click to select
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Select Images
                  </Button>
                  <input
                    id="image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {/* Image Previews */}
                {imageFiles.length > 0 && (
                  <div className="mt-4">
                    <Label className="text-sm font-medium mb-2">New Images to Upload:</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {imageFiles.map((imageFile, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={imageFile.preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 sm:h-24 object-cover rounded-lg border"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-green-600/70 text-white text-xs p-1">
                            {imageFile.uploaded ? '✓ Uploaded' : 'Pending Upload'}
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Current Product Images (Edit Mode) */}
                {isEditMode && editingProduct && editingProduct.images.length > 0 && (
                  <div className="mt-6">
                    <Label className="text-sm font-medium mb-2">Current Product Images:</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {editingProduct.images.map((imageUrl, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={imageUrl}
                            alt={`Current Image ${index + 1}`}
                            className="w-full h-20 sm:h-24 object-cover rounded-lg border"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-blue-600/70 text-white text-xs p-1">
                            Current Image
                          </div>
                          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Badge variant="secondary" className="text-xs">
                              Existing
                            </Badge>
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                            onClick={() => handleRemoveCurrentImage(index)}
                            title="Delete this image"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> Upload new images above to replace these current images, or leave empty to keep existing images. 
                        You can also delete individual images using the red X button that appears on hover.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, featured: checked as boolean }))
                  }
                />
                <Label htmlFor="featured">Featured Product</Label>
              </div>

              <Separator />

              {/* Variations */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <Label className="text-lg font-medium">Variations *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddVariation}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Variation
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {(() => {
                    const sortedVariations = sortVariationsBySize(formData.variations);
                    return sortedVariations.map((variation, displayIndex) => {
                      // Find the original index in formData.variations
                      const originalIndex = formData.variations.findIndex(v => 
                        v.color === variation.color && v.size === variation.size
                      );
                      
                      return (
                        <div key={originalIndex} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-medium">Variation {displayIndex + 1}</span>
                            {formData.variations.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveVariation(originalIndex)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div>
                              <Label>Color *</Label>
                              <Input
                                value={variation.color}
                                onChange={(e) => handleVariationChange(originalIndex, 'color', e.target.value)}
                                placeholder="e.g., Red, Blue"
                                required
                              />
                            </div>
                            
                            <div>
                              <Label>Size (inches) *</Label>
                              <Input
                                type="number"
                                step="0.1"
                                value={variation.size}
                                onChange={(e) => handleVariationChange(originalIndex, 'size', e.target.value)}
                                placeholder="e.g., 2.5"
                                required
                              />
                            </div>
                            
                            <div>
                              <Label>Price (₹) *</Label>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                value={variation.price}
                                onChange={(e) => handleVariationChange(originalIndex, 'price', parseFloat(e.target.value) || 0)}
                                placeholder="0.00"
                                required
                              />
                            </div>
                            
                            <div>
                              <Label>Stock *</Label>
                              <Input
                                type="number"
                                min="0"
                                value={variation.stock}
                                onChange={(e) => handleVariationChange(originalIndex, 'stock', parseInt(e.target.value) || 0)}
                                placeholder="0"
                                required
                              />
                            </div>
                              
                            <div className="flex items-center space-x-2 sm:col-span-2 lg:col-span-1">
                              <Checkbox
                                id={`active-${originalIndex}`}
                                checked={variation.active}
                                onCheckedChange={(checked) => handleVariationChange(originalIndex, 'active', checked as boolean)}
                              />
                              <Label htmlFor={`active-${originalIndex}`}>Active</Label>
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {isEditMode ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {isEditMode ? 'Update Product' : 'Create Product'}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Admin;
