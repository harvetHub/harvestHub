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
    router.push("/cart/checkout");
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col w-fill h-full justify-center items-center">
            <Image
              src="/images/cart.png"
              alt={""}
              width={1920}
              height={1080}
              className="w-[80%] h-auto object-cover mr-4 "
            />
          </div>
          <div className="container mx-auto p-8 h-full bg-white shadow-inner">
            <div>
              <h1 className="text-3xl font-bold mb-8">Cart</h1>
              <ul className="h-full max-h-[600px] overflow-y-auto shadow-inner border border-gray-200 p-4">
                {cartItems.map((item, index) => (
                  <li
                    key={item.productId}
                    className={`mb-4 pb-4 ${
                      index === cartItems.length - 1 ? "" : "border-b"
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
              <div className="flex justify-end mt-8">
                <Button onClick={handleCheckout}>Proceed to Checkout</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Cart;
