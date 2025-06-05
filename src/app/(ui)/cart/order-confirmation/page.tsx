"use client";

import { MainLayout } from "@/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const OrderConfirmation = () => {
  const router = useRouter();

  const handleContinueShopping = () => {
    router.push("/products");
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-4 h-full w-fit flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold mb-8">Order Confirmation</h1>
        <p>Your order has been placed successfully!</p>
        <div className="mt-8">
          <Button onClick={handleContinueShopping}>Continue Shopping</Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderConfirmation;
