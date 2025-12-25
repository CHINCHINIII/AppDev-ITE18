import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import api from '../lib/axios';
import { toast } from 'sonner';

interface CartItem {
  id: number; // Product ID
  cart_item_id?: number; // Backend ID
  name: string;
  price: number;
  image: string;
  quantity: number;
  variant?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity' | 'cart_item_id'>) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  updateQuantity: (id: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setItems([]);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const response = await api.get('/cart');
      if (response.data.success) {
        // Backend returns data.cart.items
        const cartItems = response.data.data.cart.items || [];
        const mappedItems = cartItems.map((item: any) => ({
          id: item.product_id,
          cart_item_id: item.id,
          name: item.product.name,
          price: Number(item.product.price),
          image: `https://placehold.co/600x400?text=${encodeURIComponent(item.product.name)}`,
          quantity: item.qty, // Backend uses 'qty'
          variant: item.variant // if supported
        }));
        setItems(mappedItems);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  const addToCart = async (item: Omit<CartItem, 'quantity' | 'cart_item_id'>) => {
    if (user) {
      try {
        await api.post('/cart/add', {
          product_id: item.id,
          qty: 1, // Backend expects 'qty'
          // variant: item.variant
        });
        await fetchCart(); // Refresh cart from server
        // toast.success('Added to cart'); // Handled in component
      } catch (error) {
        console.error('Add to cart failed:', error);
        toast.error('Failed to add to cart');
      }
    } else {
      // Local state fallback for guests
      setItems(prev => {
        const existing = prev.find(i => i.id === item.id);
        if (existing) {
          return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
        }
        return [...prev, { ...item, quantity: 1 }];
      });
    }
  };

  const removeFromCart = async (id: number) => {
    if (user) {
      try {
        // Find the cart item to get its backend ID
        const cartItem = items.find(i => i.id === id);
        if (cartItem && cartItem.cart_item_id) {
            await api.delete(`/cart/remove/${cartItem.cart_item_id}`);
            await fetchCart();
        }
      } catch (error) {
        console.error('Remove from cart failed:', error);
        toast.error('Failed to remove item');
      }
    } else {
      setItems(prev => prev.filter(i => i.id !== id));
    }
  };

  const updateQuantity = async (id: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(id);
      return;
    }

    if (user) {
       try {
        const cartItem = items.find(i => i.id === id);
        if (cartItem && cartItem.cart_item_id) {
            await api.put(`/cart/update/${cartItem.cart_item_id}`, { qty: quantity }); // Backend expects 'qty'
            // Optimistic update
            setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
        }
       } catch (error) {
         console.error('Update quantity failed:', error);
         toast.error('Failed to update quantity');
         await fetchCart(); // Revert on error
       }
    } else {
      setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await api.delete('/cart/clear');
        setItems([]);
      } catch (error) {
        console.error('Clear cart failed:', error);
      }
    } else {
      setItems([]);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
