import { create } from "zustand";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item: CartItem) =>
    set((state) => {
      const existingItem = state.items.find(
        (i) => i.productId === item.productId
      );
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }
      return { items: [...state.items, item] };
    }),
  removeItem: (productId: string) =>
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
    })),
  clearCart: () => set({ items: [] }),
}));
