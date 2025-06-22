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
      const discountFactor = item.product.offer.type === 'discount' ? 1 - item.product.offer.value : 1;
      return total + (itemPrice * discountFactor * item.quantity);
    }, 0);
  };

  const addToCart = (product: Product, variation: Variation, quantity: number) => {
    // Check if the same product with the same variation is already in the cart
    const existingItemIndex = items.findIndex(
      item => item.product.id === product.id && 
              item.variation.color === variation.color && 
              item.variation.size === variation.size
    );

    if (existingItemIndex !== -1) {
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
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
