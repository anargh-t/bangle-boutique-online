import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, Variation } from '../data/products';
import { toast } from '@/components/ui/sonner';

export interface CartItem {
  product: Product;
  variation: Variation;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (product: Product, variation: Variation, quantity: number) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  checkCartItemAvailability: (item: CartItem) => { available: boolean; message: string };
  removeOutOfStockItems: () => void;
  validateCart: () => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const calculateTotalItems = (): number => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const calculateTotalPrice = (): number => {
    return items.reduce((total, item) => {
      const itemPrice = item.variation.price;
      return total + itemPrice * item.quantity;
    }, 0);
  };

  // Check if cart items are still available
  const checkCartItemAvailability = (item: CartItem): { available: boolean; message: string } => {
    if (!item.variation.active) {
      return { available: false, message: 'Product variation is no longer available' };
    }
    
    if (item.variation.stock === 0) {
      return { available: false, message: 'Product is out of stock' };
    }
    
    if (item.quantity > item.variation.stock) {
      return { available: false, message: `Only ${item.variation.stock} available in stock` };
    }
    
    return { available: true, message: '' };
  };

  // Remove out-of-stock items from cart
  const removeOutOfStockItems = () => {
    const availableItems = items.filter(item => checkCartItemAvailability(item).available);
    if (availableItems.length !== items.length) {
      setItems(availableItems);
      toast.info('Out-of-stock items have been removed from your cart');
    }
  };

  // Check and clean cart for out-of-stock items
  const validateCart = () => {
    const unavailableItems = items.filter(item => !checkCartItemAvailability(item).available);
    if (unavailableItems.length > 0) {
      removeOutOfStockItems();
      return false;
    }
    return true;
  };

  const addToCart = (product: Product, variation: Variation, quantity: number) => {
    // Check if variation is active
    if (!variation.active) {
      toast.error('This product variation is not available');
      return;
    }
    
    // Check if quantity exceeds available stock
    if (quantity > variation.stock) {
      toast.error(`Only ${variation.stock} items available in stock`);
      return;
    }
    
    // Check if item is out of stock
    if (variation.stock === 0) {
      toast.error('This item is out of stock');
      return;
    }

    // Check if the same product with the same variation is already in the cart
    const existingItemIndex = items.findIndex(
      item => item.product.id === product.id && 
              item.variation.color === variation.color && 
              item.variation.size === variation.size
    );

    if (existingItemIndex !== -1) {
      // Check if adding the new quantity would exceed stock
      const newTotalQuantity = items[existingItemIndex].quantity + quantity;
      if (newTotalQuantity > variation.stock) {
        toast.error(`Cannot add more items. Only ${variation.stock} available in stock`);
        return;
      }
      
      // Update the quantity of the existing item
      const updatedItems = [...items];
      updatedItems[existingItemIndex].quantity += quantity;
      setItems(updatedItems);
      toast.success(`Updated quantity in your cart!`);
    } else {
      // Add a new item to the cart
      setItems([...items, { product, variation, quantity }]);
      toast.success(`Added to your cart!`);
    }
  };

  const removeFromCart = (index: number) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
    toast.info(`Item removed from cart`);
  };

  const updateQuantity = (index: number, quantity: number) => {
    // Check if quantity is valid
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    
    const updatedItems = [...items];
    updatedItems[index].quantity = quantity;
    setItems(updatedItems);
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{
      items,
      totalItems: calculateTotalItems(),
      totalPrice: calculateTotalPrice(),
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      checkCartItemAvailability,
      removeOutOfStockItems,
      validateCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
