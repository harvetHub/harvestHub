import { fallbackImage } from "@/lib/fallbackImg";
import { useCartStore } from "@/store/cartStore";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

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
