"use client";

import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/layout/MainLayout";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const fallbackImage = "/path/to/fallback/image.jpg";

const Checkout = () => {
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const router = useRouter();
  const [deliveryOption, setDeliveryOption] = useState("pickup");

  const handlePlaceOrder = () => {
    // Implement place order logic here

    clearCart();
    router.push("/cart/order-confirmation");
  };

  const totalCost = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <MainLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
        <div className="flex flex-col w-fill h-full justify-center items-center">
          <Image
            src="/images/checkout.png"
            alt={""}
            width={1920}
            height={1080}
            className="w-[80%] h-auto object-cover mr-4 "
          />
        </div>
        <div className="container mx-auto p-8 h-full bg-white shadow-inner">
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div>
              <h1 className="text-3xl font-bold mb-8">Checkout</h1>
              <ul className="h-96 overflow-y-auto shadow-inner border border-gray-200 p-4">
                {cartItems.map((item, index) => (
                  <li
                    key={item.productId}
                    className={`mb-4 pb-4 ${
                      index === cartItems.length - 1 ? "" : "border-b"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <p className="p-4">{index + 1}.</p>
                        <Image
                          src={item.image_url || fallbackImage}
                          alt={item.name}
                          width={100}
                          height={100}
                          className="w-24 h-24 object-cover mr-4 rounded-xl shadow-md"
                        />
                        <div>
                          <h2 className="text-xl font-bold">{item.name}</h2>
                          <p>
                            Price: ₱{item.price.toFixed(2)} <span>x</span>{" "}
                            <span>{item.quantity}</span> <span>=</span>{" "}
                            <span className="font-semibold">
                              ₱{(+item.price * item.quantity).toFixed(2)}
                            </span>
                          </p>
                          <p>
                            Quantity:{" "}
                            <span className="font-semibold">
                              {item.quantity}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Delivery Options</h2>
                <RadioGroup
                  value={deliveryOption}
                  onValueChange={setDeliveryOption}
                >
                  <div className="flex items-center mb-2">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <label htmlFor="pickup" className="ml-2">
                      Pickup
                    </label>
                  </div>
                  <div className="flex items-center mb-2">
                    <RadioGroupItem value="cod" id="cod" disabled />
                    <label htmlFor="cod" className="ml-2">
                      Cash on Delivery (COD) - Not Available
                    </label>
                  </div>
                </RadioGroup>
              </div>
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Total Cost</h2>
                <p className="text-lg font-bold">₱{totalCost.toFixed(2)}</p>
              </div>
              <div className="mt-8">
                <Button onClick={handlePlaceOrder}>Place Order</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Checkout;
