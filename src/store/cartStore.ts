import { CartItem } from "@/lib/definitions";
import { create } from "zustand";

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: async (item: CartItem) => {
    // Optimistically update local store
    const state = get();
    const existingItem = state.items.find((i) => i.productId === item.productId);
    if (existingItem) {
      set({
        items: state.items.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        ),
      });
    } else {
      set({ items: [...state.items, item] });
    }

    // Sync with backend
    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: item.productId,
          quantity: item.quantity,
        }),
      });
      if (!res.ok) {
        // Optionally: revert optimistic update or show error
        // For now, just log error
        console.error("Failed to sync cart with server");
      }
    } catch (err) {
      console.error("Failed to sync cart with server", err);
    }
  },
  removeItem: (productId: string) =>
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
    })),
  clearCart: () => set({ items: [] }),
}));
