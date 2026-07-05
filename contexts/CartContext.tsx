import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  cartItemId: string; // Unique ID (e.g. prod-1-Red)
  name: string;
  price: number;
  quantity: number;
  color: string;
  image: string;
}

interface CartStore {
  items: CartItem[];
  selectedItems: string[]; // Array of cartItemIds
  addToCart: (item: CartItem) => void;
  removeFromCart: (cartItemId: string) => void;
  removeItems: (cartItemIds: string[]) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  toggleItemSelection: (cartItemId: string) => void;
  selectAllItems: (cartItemIds: string[]) => void;
  clearSelection: () => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      selectedItems: [],
      addToCart: (item) =>
        set((state) => {
          // Check if item with same cartItemId exists
          const existingItemIndex = state.items.findIndex(
            (i) => i.cartItemId === item.cartItemId
          );
          
          let newItems = [...state.items];
          if (existingItemIndex > -1) {
            newItems[existingItemIndex].quantity += item.quantity;
          } else {
            newItems = [...state.items, item];
          }
          
          return { 
            items: newItems,
            // Auto-select newly added items if not already selected
            selectedItems: state.selectedItems.includes(item.cartItemId) 
              ? state.selectedItems 
              : [...state.selectedItems, item.cartItemId]
          };
        }),
      removeFromCart: (cartItemId) =>
        set((state) => ({
          items: state.items.filter((i) => i.cartItemId !== cartItemId),
          selectedItems: state.selectedItems.filter(id => id !== cartItemId)
        })),
      removeItems: (cartItemIds) =>
        set((state) => ({
          items: state.items.filter((i) => !cartItemIds.includes(i.cartItemId)),
          selectedItems: state.selectedItems.filter(id => !cartItemIds.includes(id))
        })),
      updateQuantity: (cartItemId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.cartItemId === cartItemId ? { ...i, quantity: Math.max(1, quantity) } : i
          ),
        })),
      toggleItemSelection: (cartItemId) =>
        set((state) => ({
          selectedItems: state.selectedItems.includes(cartItemId)
            ? state.selectedItems.filter(id => id !== cartItemId)
            : [...state.selectedItems, cartItemId]
        })),
      selectAllItems: (cartItemIds) =>
        set({ selectedItems: cartItemIds }),
      clearSelection: () =>
        set({ selectedItems: [] }),
      clearCart: () => set({ items: [], selectedItems: [] }),
    }),
    {
      name: 'facep-cart-storage', // key in localStorage
    }
  )
);
