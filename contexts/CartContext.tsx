import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // Product ID
  cartItemId: string; // Unique ID (e.g. prod-1-Red-L)
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image: string;
  sellerName: string;
  
  // Selected variants
  color?: string;
  size?: string;
  storage?: string;
  material?: string;

  // Available options for editing in cart
  availableVariants?: any[];
  availableColors?: string[];

  // Fee breakdown
  taxAmount?: number;
  vatGst?: number;
  importCharges?: number;
  handlingFee?: number;
  shippingCost?: number;
}

interface CartStore {
  items: CartItem[];
  selectedItems: string[]; // Array of cartItemIds
  addToCart: (item: CartItem) => void;
  removeFromCart: (cartItemId: string) => void;
  removeItems: (cartItemIds: string[]) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  updateVariant: (cartItemId: string, key: 'color'|'size'|'storage'|'material', value: string) => void;
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
      updateVariant: (cartItemId, key, value) =>
        set((state) => {
          const itemIndex = state.items.findIndex(i => i.cartItemId === cartItemId);
          if (itemIndex === -1) return state;

          const item = { ...state.items[itemIndex] };
          item[key] = value;

          // Try to find the matching variant in availableVariants to update price and image
          let newImage = item.image;
          let newPrice = item.price;
          
          if (item.availableVariants && item.availableVariants.length > 0) {
            const targetVariant = item.availableVariants.find(v => 
              (!item.color || v.color === item.color) &&
              (!item.size || v.size === item.size) &&
              (!item.storage || v.storage === item.storage) &&
              (!item.material || v.material === item.material)
            ) || item.availableVariants.find(v => v[key] === value);

            if (targetVariant) {
               if (targetVariant.image) newImage = targetVariant.image;
               if (targetVariant.price) newPrice = Number(targetVariant.price);
            }
          }

          item.image = newImage;
          item.price = newPrice;
          
          // Re-generate cartItemId
          const newCartItemId = `${item.id}-${item.color||''}-${item.size||''}-${item.storage||''}-${item.material||''}`;
          item.cartItemId = newCartItemId;

          const newItems = [...state.items];
          
          // If the new variant already exists as a separate cart item, merge them
          const mergeIndex = state.items.findIndex(i => i.cartItemId === newCartItemId && i.cartItemId !== cartItemId);
          if (mergeIndex > -1) {
             newItems[mergeIndex].quantity += item.quantity;
             newItems.splice(itemIndex, 1);
          } else {
             newItems[itemIndex] = item;
          }

          const newSelectedItems = state.selectedItems.map(id => id === cartItemId ? newCartItemId : id);

          return { items: newItems, selectedItems: newSelectedItems };
        }),
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
      name: 'facep-cart-storage',
    }
  )
);
