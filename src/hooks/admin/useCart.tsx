import { useCartStore } from "@/store/cartStore";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const fallbackImage =
  "https://images.unsplash.com/photo-1540317700647-ec69694d70d0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export const useCart = () => {
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);

  const addToCartWithSwal = (product: {
    product_id: number | undefined;
    name: string;
    price: number;
    image_url: string | null;
  }) => {
    // Check if the item is already in the cart
    const isAlreadyInCart = cartItems.some(
      (item) => item.productId === product.product_id?.toString()
    );

    if (isAlreadyInCart) {
      Swal.fire({
        icon: "info",
        title: "Item Already in Cart",
        text: `${product.name} is already in your cart.`,
        confirmButtonText: "OK",
      });
    } else {
      // Add the item to the cart
      addItem({
        productId: product.product_id?.toString() || "",
        name: product.name,
        price: product.price,
        quantity: 1,
        image_url:
          typeof product.image_url === "string"
            ? product.image_url
            : fallbackImage,
      });

      Swal.fire({
        icon: "success",
        title: "Added to Cart",
        text: `${product.name} has been added to your cart.`,
        confirmButtonText: "OK",
      });
    }
  };

  return { addToCartWithSwal };
};
