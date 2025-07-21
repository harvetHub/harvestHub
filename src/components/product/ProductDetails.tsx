import { FC } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/cart/useCart"; // Import the custom hook
import { Product } from "@/lib/definitions";
import { fallbackImage } from "@/lib/fallbackImg";
import { formatPrice } from "@/utils/formatPrice";

interface ProductDetailsProps {
  product: Product | null;
  loading: boolean;
}

const ProductDetails: FC<ProductDetailsProps> = ({ product, loading }) => {
  const { addToCartWithSwal } = useCart(); // Use the custom hook

  if (loading) {
    return (
      <div className="myContainer grid xs:grid-cols-1 sm:grid-cols-1 grid-cols-2 lg:my-20 my-10 gap-8 mx-auto p-4">
        {/* Image skeleton: matches the real image size */}
        <Skeleton className="w-full h-64 md:h-96 rounded-sm mb-4" />
        <div>
          {/* Title skeleton: matches the real title font size and width */}
          <Skeleton className="h-10 w-2/3 mb-4" />
          {/* Description skeleton: matches the real description lines */}
          <Skeleton className="h-5 w-full mb-2" />
          <Skeleton className="h-5 w-5/6 mb-2" />
          <Skeleton className="h-5 w-4/6 mb-2" />
          {/* Price skeleton: matches the real price font size and width */}
          <Skeleton className="h-8 w-1/3 mb-4" />
          {/* Button skeleton: matches the real button size */}
          <Skeleton className="h-12 w-full md:w-40" />
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
              width={600}
              height={500}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-lg text-gray-700 mb-4">{product.description}</p>
          <p className="text-2xl font-bold text-green-600 mb-4">
            {formatPrice(product.price)}
          </p>
          <Button
            className="w-full md:w-auto cursor-pointer"
            onClick={() =>
              addToCartWithSwal({
                product_id: product.product_id ?? 0,
                stocks: product.stocks ?? 0,
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
