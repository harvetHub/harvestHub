import { FC } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/admin/useCart"; // Import the custom hook
import { Product } from "@/lib/definitions";

const fallbackImage =
  "https://images.unsplash.com/photo-1540317700647-ec69694d70d0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

interface ProductDetailsProps {
  product: Product | null;
  loading: boolean;
}

const ProductDetails: FC<ProductDetailsProps> = ({ product, loading }) => {
  const { addToCartWithSwal } = useCart(); // Use the custom hook

  if (loading) {
    return (
      <div className="myContainer grid grid-cols-2 lg:my-20 my-10 gap-8 mx-auto p-4">
        <Skeleton className="w-full h-100 mb-4" />
        <div>
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-3/4 mb-4" />
          <Skeleton className="h-4 w-3/4 mb-4" />
          <Skeleton className="h-4 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/4 mb-2" />
          <Skeleton className="h-8 w-1/4" />
        </div>
      </div>
    );
  }

  if (!product) {
    return <p className="text-center text-xl">Product not found.</p>;
  }

  return (
    <div className="myContainer lg:my-20 my-10 mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <div className="relative w-full h-64 md:h-96 rounded-sm overflow-hidden">
            <Image
              src={
                typeof product.image_url === "string"
                  ? product.image_url
                  : product.image_url
                  ? URL.createObjectURL(product.image_url)
                  : fallbackImage
              }
              alt={product.name}
              layout="fill"
              objectFit="cover"
              className=""
            />
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-lg text-gray-700 mb-4">{product.description}</p>
          <p className="text-2xl font-bold text-green-600 mb-4">
            ₱{product.price.toFixed(2)}
          </p>
          <Button
            className="w-full md:w-auto cursor-pointer"
            onClick={() =>
              addToCartWithSwal({
                product_id: product.product_id,
                name: product.name,
                price: product.price,
                image_url:
                  typeof product.image_url === "string"
                    ? product.image_url
                    : product.image_url
                    ? URL.createObjectURL(product.image_url)
                    : fallbackImage,
              })
            }
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
