import { CartItem } from "@/lib/definitions";
import { create } from "zustand";

interface CartState {
  items: CartItem[];
  setItems: (items: CartItem[]) => void;
  addItem: (item: CartItem) => Promise<void>;
  increaseQuantity: (product_id: number | string) => Promise<void>;
  decreaseQuantity: (product_id: number | string) => Promise<void>;
  deleteItem: (product_id: number | string) => Promise<void>;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  setItems: (items) => set({ items }),
  addItem: async (item: CartItem) => {
    // Optimistically update local store
    const state = get();
    const existingItem = state.items.find((i) => i.product_id === item.product_id);
    if (existingItem) {
      set({
        items: state.items.map((i) =>
          i.product_id === item.product_id
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
          product_id: item.product_id,
          quantity: item.quantity,
          name: item.name,
          price: item.price,
          image_url: item.image_url,
          added_at: new Date().toISOString(),
        }),
      });
      if (!res.ok) {
        console.error("Failed to sync cart with server");
      }
    } catch (err) {
      console.error("Failed to sync cart with server", err);
    }
  },
  increaseQuantity: async (product_id) => {
    // Optimistically update local store
    set((state) => ({
      items: state.items.map((i) =>
        i.product_id === product_id
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ),
    }));

    // Sync with backend
    try {
      const res = await fetch("/api/cart/manage/increase", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: product_id,
          amount: 1,
        }),
      });
      if (!res.ok) {
        console.error("Failed to increase cart quantity on server");
      }
    } catch (err) {
      console.error("Failed to increase cart quantity on server", err);
    }
  },
  decreaseQuantity: async (product_id) => {
    // Optimistically update local store
    set((state) => {
      const item = state.items.find((i) => i.product_id === product_id);
      if (!item) return state;
      if (item.quantity > 1) {
        return {
          items: state.items.map((i) =>
            i.product_id === product_id
              ? { ...i, quantity: i.quantity - 1 }
              : i
          ),
        };
      } else {
        return {
          items: state.items.filter((i) => i.product_id !== product_id),
        };
      }
    });

    // Sync with backend
    try {
      const res = await fetch("/api/cart/manage/decrease", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: product_id,
        }),
      });
      if (!res.ok) {
        console.error("Failed to decrease cart quantity on server");
      }
    } catch (err) {
      console.error("Failed to decrease cart quantity on server", err);
    }
  },
  deleteItem: async (product_id) => {
    // Optimistically update local store
    set((state) => ({
      items: state.items.filter((item) => item.product_id !== product_id),
    }));

    // Sync with backend
    try {
      const res = await fetch("/api/cart/manage/delete", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: product_id,
        }),
      });
      if (!res.ok) {
        console.error("Failed to remove item from cart on server");
      }
    } catch (err) {
      console.error("Failed to remove item from cart on server", err);
    }
  },
  clearCart: () => set({ items: [] }),
}));
