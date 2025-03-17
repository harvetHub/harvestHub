"use client";

import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/layout/MainLayout";
import Image from "next/image";
import { useRouter } from "next/navigation";

const fallbackImage = "/path/to/fallback/image.jpg";

const Cart = () => {
  const cartItems = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  const handleCheckout = () => {
    router.push("/checkout");
  };

  const handleIncreaseQuantity = (item: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image_url?: string;
  }) => {
    addItem({
      ...item,
      quantity: 1,
      image_url: item.image_url || fallbackImage,
    });
  };

  const handleDecreaseQuantity = (item: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image_url?: string;
  }) => {
    if (item.quantity > 1) {
      addItem({
        ...item,
        quantity: -1,
        image_url: item.image_url || fallbackImage,
      });
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-4 h-screen">
        <h1 className="text-3xl font-bold mb-8">Cart</h1>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div>
            <ul>
              {cartItems.map((item) => (
                <li key={item.productId} className="mb-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
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
                            onClick={() => handleDecreaseQuantity(item)}
                            className="mr-2"
                          >
                            -
                          </Button>
                          <span>{item.quantity}</span>
                          <Button
                            variant="outline"
                            onClick={() => handleIncreaseQuantity(item)}
                            className="ml-2"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => removeItem(item.productId)}
                    >
                      Remove
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button onClick={handleCheckout}>Proceed to Checkout</Button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Cart;
