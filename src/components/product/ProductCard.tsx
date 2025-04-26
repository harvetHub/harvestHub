import { FC } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Product } from "@/lib/definitions";
import { useCartStore } from "@/store/cartStore";

const fallbackImage =
  "https://via.placeholder.com/150?text=Image+Not+Available";

interface ProductCardProps {
  product: Product;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <Card className="flex rounded-sm border-none flex-col justify-between">
      <CardHeader>
        <Image
          src={
            typeof product.image_url === "string"
              ? product.image_url
              : fallbackImage
          }
          alt={product.name}
          width={150}
          height={150}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.currentTarget.src = fallbackImage;
          }}
        />
        <CardTitle className="mt-4">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="description overflow-hidden text-ellipsis">
          {product.description}
        </p>
        <div className="mt-4">
          <p className="font-bold">₱{product.price.toFixed(2)}</p>
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button
          className="w-full"
          onClick={() =>
            addItem({
              productId: product.product_id?.toString() || "",
              name: product.name,
              price: product.price,
              quantity: 1,
              image_url:
                typeof product.image_url === "string"
                  ? product.image_url
                  : fallbackImage,
            })
          }
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
