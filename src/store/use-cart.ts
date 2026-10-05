import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addToCart, updateCartItemQuantity, removeFromCart } from '@/actions/cart';
import { toast } from 'sonner';

export type CartItem = {
  id: string; // cart item ID
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  brand: string | null;
};

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  setItems: (items: CartItem[]) => void;
  addItem: (item: Omit<CartItem, 'id'>, isLoggedIn: boolean) => Promise<void>;
  updateQuantity: (id: string, quantity: number, isLoggedIn: boolean) => Promise<void>;
  removeItem: (id: string, isLoggedIn: boolean) => Promise<void>;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      setItems: (items) => set({ items }),
      
      addItem: async (newItem, isLoggedIn) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.productId === newItem.productId);
        
        // Optimistic update
        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.productId === newItem.productId
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item
            ),
          });
        } else {
          // If not logged in, we generate a fake ID for the local cart item
          set({ items: [...currentItems, { ...newItem, id: `local_${Date.now()}` }] });
        }
        
        get().openCart();
        toast.success('Added to cart');

        if (isLoggedIn) {
          try {
            const result = await addToCart(newItem.productId, newItem.quantity);
            if (result.error) {
              toast.error(result.error);
              // Rollback optimistic update
              set({ items: currentItems });
            }
            // Real ID will be synced when we refetch the cart in a layout/provider
          } catch (e) {
            toast.error('Failed to sync with server');
            set({ items: currentItems });
          }
        }
      },
      
      updateQuantity: async (id, quantity, isLoggedIn) => {
        if (quantity <= 0) {
          get().removeItem(id, isLoggedIn);
          return;
        }

        const currentItems = get().items;
        
        set({
          items: currentItems.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });

        if (isLoggedIn && !id.startsWith('local_')) {
          try {
            const result = await updateCartItemQuantity(id, quantity);
            if (result?.error) {
              toast.error(result.error);
              set({ items: currentItems });
            }
          } catch (e) {
            set({ items: currentItems });
          }
        }
      },
      
      removeItem: async (id, isLoggedIn) => {
        const currentItems = get().items;
        
        set({
          items: currentItems.filter((item) => item.id !== id),
        });

        toast.success('Item removed');

        if (isLoggedIn && !id.startsWith('local_')) {
          try {
            const result = await removeFromCart(id);
            if (result?.error) {
              toast.error(result.error);
              set({ items: currentItems });
            }
          } catch (e) {
            set({ items: currentItems });
          }
        }
      },
      
      clearCart: () => set({ items: [] }),
      
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      
      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      totalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'shopora-cart',
      skipHydration: true, // We handle hydration manually or inside a component
    }
  )
);
