"use client";

import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/layout/MainLayout";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fallbackImage } from "@/lib/fallbackImg";
import { useEffect } from "react";
import { CartItem } from "@/lib/definitions";

const Cart = () => {
  const cartItems = useCartStore((state) => state.items);
  const setItems = useCartStore((state) => state.setItems); // Make sure setItems exists in your store
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const deleteItem = useCartStore((state) => state.deleteItem);
  const router = useRouter();

  // Sort cart items A-Z by name, but keep their original order in state for UI stability
  // Use a memoized sorted array for rendering only
  const sortedCartItems = [...cartItems].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  console.log("Cart items:", cartItems);

  // Helper to sync cart after API call
  const syncCart = async () => {
    try {
      const res = await fetch("/api/cart/list", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        // Transform data if needed to match your CartItem shape
        setItems(
          data.cart.map((item: CartItem) => ({
            product_id: item.product_id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image_url: item.image_url,
          }))
        );
      }
    } catch (err) {
      console.error("Failed to sync cart from server", err);
    }
  };

  // Optionally, sync cart on mount
  useEffect(() => {
    syncCart();
    // eslint-disable-next-line
  }, []);

  const handleCheckout = () => {
    router.push("/cart/checkout");
  };

  const handleIncreaseQuantity = async (product_id: number) => {
    await increaseQuantity(product_id);
  };

  const handleDecreaseQuantity = async (product_id: number) => {
    await decreaseQuantity(product_id);
  };

  const handleRemoveItem = async (product_id: number) => {
    await deleteItem(product_id);
  };

  return (
    <MainLayout>
      {cartItems.length === 0 ? (
        <div className="flex flex-col w-fill h-full justify-center items-center">
          <label className="font-semibold" htmlFor="">
            Empty Cart!
          </label>
          <Image
            src="/images/empty.png"
            alt={""}
            width={600}
            height={600}
            className="w-80 h-auto object-cover mr-4 "
          />
        </div>
      ) : (
        <div className="myContainer h-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col w-fill h-full justify-center items-center">
            <Image
              src="/images/cart.png"
              alt={""}
              width={1920}
              height={1080}
              className="w-full h-auto object-cover mr-4 "
            />
          </div>
          <div className="w-full mx-auto p-8 h-full bg-white shadow-inner">
            <div>
              <h1 className="text-3xl font-bold mb-8">Cart</h1>
              <ul className="h-full max-h-[600px] overflow-y-auto shadow-inner border border-gray-200 p-4">
                {sortedCartItems.map((item, index) => (
                  <li
                    key={item.product_id}
                    className={`mb-4 pb-4 ${
                      index === sortedCartItems.length - 1 ? "" : "border-b"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <p className="p-4">{index + 1}</p>
                        <Image
                          src={item.image_url || fallbackImage}
                          alt={item.name}
                          width={100}
                          height={100}
                          className="w-24 h-24 object-cover mr-4 rounded-xl shadow-md"
                        />
                        <div>
                          <h2 className="text-xl font-bold">{item.name}</h2>
                          <p>Price: ₱{item.price.toFixed(2)}</p>
                          <div className="flex items-center mt-2">
                            <Button
                              variant="outline"
                              onClick={() =>
                                handleDecreaseQuantity(item.product_id)
                              }
                              className="mr-2"
                            >
                              -
                            </Button>
                            <span>{item.quantity}</span>
                            <Button
                              variant="outline"
                              onClick={() =>
                                handleIncreaseQuantity(item.product_id)
                              }
                              className="ml-2"
                            >
                              +
                            </Button>
                            {/* Show stocks count */}
                            {item.stocks !== null && item.stocks !== 0 ? (
                              <span className="ml-2 text-xs text-gray-500">
                                ({item.stocks})
                              </span>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleRemoveItem(item.product_id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex justify-end mt-8">
                <Button className="w-full" onClick={handleCheckout}>
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Cart;
