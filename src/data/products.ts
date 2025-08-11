import { supabase } from '../lib/supabase';

export interface Variation {
  id: string;
  color: string;
  size: string;
  price: number;
  stock: number;
  active: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  variations: Variation[];
  category: string;
  featured?: boolean;
}

// Supabase database functions
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        description,
        images,
        category,
        featured,
        variations (
          id,
          color,
          size,
          price,
          stock,
          active
        )
      `)
      .order('featured', { ascending: false })
      .order('name');

    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }

    return products || [];
  } catch (error) {
    console.error('Error in fetchProducts:', error);
    return [];
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        description,
        images,
        category,
        featured,
        variations (
          id,
          color,
          size,
          price,
          stock,
          active
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }

    return product;
  } catch (error) {
    console.error('Error in getProductById:', error);
    return null;
  }
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        description,
        images,
        category,
        featured,
        variations (
          id,
          color,
          size,
          price,
          stock,
          active
        )
      `)
      .eq('featured', true)
      .order('name');

    if (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }

    return products || [];
  } catch (error) {
    console.error('Error in getFeaturedProducts:', error);
    return [];
  }
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    let query = supabase
      .from('products')
      .select(`
        id,
        name,
        description,
        images,
        category,
        featured,
        variations (
          id,
          color,
          size,
          price,
          stock,
          active
        )
      `);

    // If category is 'all', don't filter by category
    if (category !== 'all') {
      query = query.eq('category', category);
    }

    const { data: products, error } = await query
      .order('featured', { ascending: false })
      .order('name');

    if (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }

    return products || [];
  } catch (error) {
    console.error('Error in getProductsByCategory:', error);
    return [];
  }
};

export const getRelatedProducts = async (currentProduct: Product, limit: number = 4): Promise<Product[]> => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        description,
        images,
        category,
        featured,
        variations (
          id,
          color,
          size,
          price,
          stock,
          active
        )
      `)
      .eq('category', currentProduct.category)
      .neq('id', currentProduct.id)
      .limit(limit)
      .order('featured', { ascending: false })
      .order('name');

    if (error) {
      console.error('Error fetching related products:', error);
      throw error;
    }

    return products || [];
  } catch (error) {
    console.error('Error in getRelatedProducts:', error);
    return [];
  }
};



// Admin functions for managing products
export const createProduct = async (productData: Omit<Product, 'id' | 'variations'> & { variations: Omit<Variation, 'id'>[] }): Promise<Product | null> => {
  try {
    const { variations, ...product } = productData;
    
    // Generate a unique ID based on category and name
    const timestamp = Date.now();
    const categorySlug = product.category.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const nameSlug = product.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const productId = `${categorySlug}-${nameSlug}-${timestamp}`;
    
    // Insert product with generated ID
    const { data: newProduct, error: productError } = await supabase
      .from('products')
      .insert({ ...product, id: productId })
      .select()
      .single();

    if (productError) {
      console.error('Error creating product:', productError);
      console.error('Product data attempted:', { ...product, id: productId });
      return null;
    }

    // Insert variations
    const variationsWithProductId = variations.map(v => ({
      ...v,
      product_id: newProduct.id
    }));

    const { error: variationsError } = await supabase
      .from('variations')
      .insert(variationsWithProductId);

    if (variationsError) {
      console.error('Error creating variations:', variationsError);
      console.error('Variations data attempted:', variationsWithProductId);
      // Rollback product creation
      await supabase.from('products').delete().eq('id', newProduct.id);
      return null;
    }

    // Fetch the complete product with variations
    return await getProductById(newProduct.id);
  } catch (error) {
    console.error('Error in createProduct:', error);
    return null;
  }
};

export const updateProduct = async (id: string, productData: Partial<Product> & { variations?: Partial<Variation>[] }): Promise<Product | null> => {
  try {
    const { variations, ...product } = productData;
    
    // Update product
    const { error: productError } = await supabase
      .from('products')
      .update(product)
      .eq('id', id);

    if (productError) {
      console.error('Error updating product:', productError);
      return null;
    }

    // Update variations if provided
    if (variations) {
      for (const variation of variations) {
        if (variation.id) {
          const { error: variationError } = await supabase
            .from('variations')
            .update(variation)
            .eq('id', variation.id);

          if (variationError) {
            console.error('Error updating variation:', variationError);
          }
        }
      }
    }

    // Fetch the updated product
    return await getProductById(id);
  } catch (error) {
    console.error('Error in updateProduct:', error);
    return null;
  }
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    // Delete variations first (due to foreign key constraint)
    const { error: variationsError } = await supabase
      .from('variations')
      .delete()
      .eq('product_id', id);

    if (variationsError) {
      console.error('Error deleting variations:', variationsError);
      return false;
    }

    // Delete product
    const { error: productError } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (productError) {
      console.error('Error deleting product:', productError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    return false;
  }
};

export const updateVariationStock = async (variationId: string, stock: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('variations')
      .update({ stock })
      .eq('id', variationId);

    if (error) {
      console.error('Error updating variation stock:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateVariationStock:', error);
    return false;
  }
};

export const updateVariationActive = async (variationId: string, active: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('variations')
      .update({ active })
      .eq('id', variationId);

    return !error;
  } catch (error) {
    console.error('Error updating variation active status:', error);
    return false;
  }
};
