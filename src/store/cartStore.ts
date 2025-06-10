import { CartItem } from "@/lib/definitions";
import { create } from "zustand";

interface CartState {
  items: CartItem[];
  setItems: (items: CartItem[]) => void;
  addItem: (item: CartItem) => Promise<void>;
  updateQuantity: (productId: string, action: "increase" | "deduct") => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  setItems: (items) => set({ items }),
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
  updateQuantity: async (productId, action) => {
    // Optimistically update local store
    const state = get();
    const item = state.items.find((i) => i.productId === productId);
    if (!item) return;

    if (action === "increase") {
      set({
        items: state.items.map((i) =>
          i.productId === productId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        ),
      });
    } else if (action === "deduct") {
      if (item.quantity > 1) {
        set({
          items: state.items.map((i) =>
            i.productId === productId
              ? { ...i, quantity: i.quantity - 1 }
              : i
          ),
        });
      } else {
        set({
          items: state.items.filter((i) => i.productId !== productId),
        });
      }
    }

    // Sync with backend
    try {
      const res = await fetch("/api/cart/manage", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          action,
        }),
      });
      if (!res.ok) {
        console.error("Failed to update cart quantity on server");
      }
    } catch (err) {
      console.error("Failed to update cart quantity on server", err);
    }
  },
  removeItem: async (productId: string) => {
    // Optimistically update local store
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
    }));

    // Sync with backend
    try {
      const res = await fetch("/api/cart/manage", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          action: "delete",
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
