import { fallbackImage } from "@/lib/fallbackImg";
import { useCartStore } from "@/store/cartStore";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export const useCart = () => {
  const addItem = useCartStore((state) => state.addItem);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const deleteItem = useCartStore((state) => state.deleteItem);
  const cartItems = useCartStore((state) => state.items);

  const addToCartWithSwal = (product: {
    product_id: number;
    name: string;
    price: number;
    image_url: string | null;
  }) => {
    // Check if the item is already in the cart
    const isAlreadyInCart = cartItems.some(
      (item) => +item.product_id === +product.product_id?.toString()
    );

    if (isAlreadyInCart) {
      Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        icon: "info",
        title: "Item Already in Cart",
        text: `${product.name} is already in your cart.`,
        confirmButtonText: "OK",
      });
    } else {
      // Add the item to the cart
      addItem({
        product_id:
          typeof product.product_id === "number"
            ? product.product_id
            : Number(product.product_id),
        name: product.name,
        price: product.price,
        quantity: 1,
        image_url:
          typeof product.image_url === "string"
            ? product.image_url
            : fallbackImage,
      });

      Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        icon: "success",
        title: "Item Added to Cart",
        text: `${product.name} has been added to your cart.`,
        confirmButtonText: "OK",
      });
    }
  };

  // New handlers for cart management
  const handleIncrease = (product_id: number) => {
    increaseQuantity(product_id);
  };

  const handleDecrease = (product_id: number) => {
    decreaseQuantity(product_id);
  };

  const handleDelete = (product_id: number) => {
    deleteItem(product_id);
  };

  return {
    addToCartWithSwal,
    handleIncrease,
    handleDecrease,
    handleDelete,
    cartItems,
  };
};
