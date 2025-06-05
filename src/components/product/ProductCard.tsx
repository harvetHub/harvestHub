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
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/admin/useCart";
import { FaStar, FaRegStar } from "react-icons/fa"; // Import star icons

const fallbackImage =
  "https://images.unsplash.com/photo-1540317700647-ec69694d70d0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

interface ProductCardProps {
  product: Product;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  const { addToCartWithSwal } = useCart(); // Use the custom hook

  const handleProductClick = (id: number) => {
    router.push(`/product/details/${id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click event from propagating to the Card
    addToCartWithSwal({
      product_id: product.product_id,
      name: product.name,
      price: product.price,
      image_url:
        typeof product.image_url === "string"
          ? product.image_url
          : product.image_url instanceof File
          ? URL.createObjectURL(product.image_url)
          : null,
    }); // Use the reusable hook
  };

  // Generate star rating
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-yellow-500" />
        ) : (
          <FaRegStar key={i} className="text-gray-300" />
        )
      );
    }
    return stars;
  };

  return (
    <Card
      onClick={() =>
        product.product_id && handleProductClick(product.product_id)
      }
      className="flex rounded-sm border-none flex-col justify-between cursor-pointer hover:scale-102"
    >
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
          className="w-full object-cover min-h-35 max-h-40"
          onError={(e) => {
            e.currentTarget.src = fallbackImage;
          }}
        />
        <CardTitle className="">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="description overflow-hidden text-ellipsis">
          {product.description}
        </p>
        <div className="flex items-center space-x-1 mt-2">
          {renderStars(product.rating || 0)}{" "}
          {/* Render stars based on rating */}
          <span className="text-sm text-gray-500">({product.rating || 0})</span>
        </div>
        <div className="mt-2">
          <p className="font-bold">₱{product.price.toFixed(2)}</p>
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button
          className="w-full cursor-pointer"
          variant={"default"}
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
