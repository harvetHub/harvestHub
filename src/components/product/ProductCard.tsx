import { FC } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { formatSoldCount } from "@/utils/formatSoldCount";

import { Product } from "@/lib/definitions";
import { useRouter } from "next/navigation";
import { FaStar, FaRegStar } from "react-icons/fa"; // Import star icons
import { fallbackImage } from "@/lib/fallbackImg";
import { formatPrice } from "@/utils/formatPrice";

interface ProductCardProps {
  product: Product;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();

  const handleProductClick = (id: number) => {
    router.push(`/product/details/${id}`);
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
          alt={product.name ?? "Product image"}
          width={150}
          height={150}
          className="w-full object-cover  h-30  md:h-40 lg:h-40 xl:h-40"
          onError={(e) => {
            e.currentTarget.src = fallbackImage;
          }}
          priority
        />
        <CardTitle className="ml-2 mt-2">{product.name}</CardTitle>
      </CardHeader>

      <CardContent className="w-full flex-grow">
        <div className="flex items-center space-x-1 -mt-4">
          {renderStars(product.rating || 0)}{" "}
          {/* Render stars based on rating */}
          <span className="text-sm text-gray-500">({product.rating || 0})</span>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pb-4 -mt-4 w-full   ">
        <p className="font-bold">{formatPrice(product.price ?? 0)}</p>
        <p className="font-normal text-xs">
          {formatSoldCount(product.sold ?? 0)} sold
        </p>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
