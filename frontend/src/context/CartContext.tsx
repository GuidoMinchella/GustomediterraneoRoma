import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  notes?: string;
  pricing_type?: 'fixed' | 'by_weight';
  weight_grams?: number; // usato per piatti a peso
}

export interface DiscountInfo {
  original_amount: number;
  discount_type: 'first_order' | 'amount_threshold' | 'none';
  discount_percentage: number;
  discount_amount: number;
  final_amount: number;
  savings: number;
  discount_description: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string, weight_grams?: number) => void;
  updateQuantity: (id: string, quantity: number, weight_grams?: number) => void;
  clearCart: () => void;
  total: number;
  itemsCount: number;
  discountInfo: DiscountInfo | null;
  discountLoading: boolean;
  refreshDiscount: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [discountInfo, setDiscountInfo] = useState<DiscountInfo | null>(null);
  const [discountLoading, setDiscountLoading] = useState(false);
  const { user } = useAuth();

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      // Se il piatto è a peso, distinguiamo per peso per evitare merge errati
      const existingItem = prev.find(item => {
        if (newItem.pricing_type === 'by_weight') {
          return item.id === newItem.id && item.weight_grams === newItem.weight_grams;
        }
        return item.id === newItem.id;
      });
      if (existingItem) {
        return prev.map(item =>
          (item.id === newItem.id && (newItem.pricing_type !== 'by_weight' || item.weight_grams === newItem.weight_grams))
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
  };

  const removeItem = (id: string, weight_grams?: number) => {
    setItems(prev => prev.filter(item => {
      if (item.id !== id) return true;
      // Se specificato un peso, rimuovi solo l'elemento con quel peso
      if (typeof weight_grams === 'number') {
        return item.weight_grams !== weight_grams;
      }
      // Altrimenti rimuovi tutti gli elementi con quell'id
      return false;
    }));
  };

  const updateQuantity = (id: string, quantity: number, weight_grams?: number) => {
    if (quantity === 0) {
      removeItem(id, weight_grams);
      return;
    }
    setItems(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        if (typeof weight_grams === 'number' && item.weight_grams !== weight_grams) return item;
        return { ...item, quantity };
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setDiscountInfo(null);
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Funzione per calcolare lo sconto in tempo reale
  const refreshDiscount = async () => {
    if (!user || total === 0) {
      setDiscountInfo(null);
      return;
    }

    try {
      setDiscountLoading(true);
      
      const { data, error } = await supabase.rpc('preview_discount', {
        user_uuid: user.id,
        cart_total: total
      });

      if (error) {
        console.error('Errore nel calcolo dello sconto:', error);
        setDiscountInfo(null);
      } else {
        setDiscountInfo(data);
      }
    } catch (error) {
      console.error('Errore nella chiamata preview_discount:', error);
      setDiscountInfo(null);
    } finally {
      setDiscountLoading(false);
    }
  };

  // Effetto per ricalcolare lo sconto quando cambiano gli items o l'utente
  useEffect(() => {
    if (user && total > 0) {
      refreshDiscount();
    } else {
      setDiscountInfo(null);
    }
  }, [user, total]);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      total,
      itemsCount,
      discountInfo,
      discountLoading,
      refreshDiscount
    }}>
      {children}
    </CartContext.Provider>
  );
};