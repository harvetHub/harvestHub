import { useCartStore } from "@/store/cartStore";

export function useClearCart() {
  return useCartStore((state) => state.clearCart);
}