"use client";

import { fallbackImage } from "@/lib/fallbackImg";
import { useCartStore } from "@/store/cartStore";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useRouter } from "next/navigation";

export const useCart = () => {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const deleteItem = useCartStore((state) => state.deleteItem);
  const cartItems = useCartStore((state) => state.items);

  // Async check: prefer server validation using supabase-access-token cookie,
  // fallback to client-side cookie presence check.
  const isLoggedIn = async (): Promise<boolean> => {
    if (typeof window === "undefined") return false;

    try {
      // Call server endpoint that validates the supabase-access-token cookie.
      const res = await fetch("/api/auth/validate-token", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // ignore and fallback to cookie check
    }

    // Fallback: check for cookie presence (works if token is accessible client-side)
    const cookies = document.cookie || "";
    return /\b(auth-token|supabase-access-token)=([^;]+)/.test(cookies);
  };

  const requireLogin = async () => {
    const result = await Swal.fire({
      title: "Login required",
      text: "You must be logged in to perform this action.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Go to Login",
      cancelButtonText: "Cancel",
      focusConfirm: false,
      toast: false,
    });
    if (result.isConfirmed) {
      router.push("/login");
    }
  };

  const addToCartWithSwal = async (product: {
    product_id: number;
    name: string;
    price: number;
    image_url: string | null;
    stocks: number | null;
  }) => {
    if (!(await isLoggedIn())) {
      await requireLogin();
      return;
    }

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

  // New handlers for cart management (ensure user is logged in)
  const handleIncrease = async (product_id: number) => {
    if (!(await isLoggedIn())) {
      await requireLogin();
      return;
    }
    increaseQuantity(product_id);
  };

  const handleDecrease = async (product_id: number) => {
    if (!(await isLoggedIn())) {
      await requireLogin();
      return;
    }
    decreaseQuantity(product_id);
  };

  const handleDelete = async (product_id: number) => {
    if (!(await isLoggedIn())) {
      await requireLogin();
      return;
    }
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
