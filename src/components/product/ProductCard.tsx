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
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { fallbackImage } from "@/lib/fallbackImg";
import { formatPrice } from "@/utils/formatPrice";

interface ProductCardProps {
  product: Product;
}

const statusColor = (status?: Product["status"]) => {
  switch (status) {
    case "available":
      return "bg-green-50 text-green-800";
    case "out_of_stock":
      return "bg-red-50 text-red-800";
    case "preorder":
      return "bg-indigo-50 text-indigo-800";
    case "discontinued":
      return "bg-gray-100 text-gray-700";
    case "coming_soon":
    default:
      return "bg-blue-50 text-blue-800";
  }
};

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();

  const handleProductClick = (id: number) => {
    router.push(`/product/details/${id}`);
  };

  // Generate star rating with half-star support from avg value
  const renderStars = (avg?: number | null) => {
    const value = typeof avg === "number" ? Math.max(0, Math.min(5, avg)) : 0;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (value >= i) {
        stars.push(
          <FaStar key={i} className="text-yellow-400 w-4 h-4" aria-hidden />
        );
      } else if (value >= i - 0.5) {
        stars.push(
          <FaStarHalfAlt
            key={i}
            className="text-yellow-400 w-4 h-4"
            aria-hidden
          />
        );
      } else {
        stars.push(
          <FaRegStar key={i} className="text-gray-300 w-4 h-4" aria-hidden />
        );
      }
    }
    return stars;
  };

  const avg = product.rating_average ?? product.rating ?? 0;
  const ratingCount = product.rating_count ?? 0;

  // helper: remove underscores, trim, and optionally normalize spacing
  const humanize = (input?: string | null) => {
    if (!input) return null;
    return String(input).replace(/_/g, " ").trim();
  };

  // sanitize status message by replacing underscores with spaces
  const statusMsg = humanize(product.status_message);

  // humanize the status enum (e.g. "out_of_stock" -> "Out Of Stock")
  const statusLabel = product.status
    ? humanize(String(product.status))?.replace(/\b\w/g, (ch) =>
        ch.toUpperCase()
      ) ?? "Coming Soon"
    : "Coming Soon";

  return (
    <Card
      onClick={() =>
        product.product_id && handleProductClick(product.product_id)
      }
      className="flex rounded-md border hover:shadow-md transition-transform transform hover:-translate-y-0.5 flex-col justify-between cursor-pointer"
      role="button"
      aria-label={`${product.name} — ${avg} out of 5`}
    >
      <CardHeader className="relative p-0">
        <div className="relative w-full h-fit md:h-40 lg:h-44">
          <Image
            src={
              typeof product.image_url === "string"
                ? product.image_url
                : fallbackImage
            }
            alt={product.name ?? "Product image"}
            fill
            className="object-cover rounded-t-md"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = fallbackImage;
            }}
            priority
          />
        </div>

        {/* status_message badge placed absolutely on image */}
        {statusMsg && (
          <div className="absolute top-2 left-2 z-10">
            <span
              className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-white/90 text-slate-800`}
            >
              {statusMsg}
            </span>
          </div>
        )}

        <div className="px-3  flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm md:text-base line-clamp-2">
              {product.name}
            </CardTitle>
          </div>

          <div className="ml-2">
            <span
              className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${statusColor(
                product.status
              )}`}
            >
              {statusLabel}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-3 pt-0 pb-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center" aria-hidden>
            {renderStars(avg)}
          </div>
          <div className="text-sm text-gray-600 ml-2">
            <span className="font-semibold">
              {avg ? Number(avg).toFixed(1) : "0.0"}
            </span>
            <span className="text-xs text-gray-500"> ({ratingCount})</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-2 px-3 pb-3 pt-0">
        <div>
          <p className="font-bold text-base">
            {formatPrice(product.price ?? 0)}
          </p>
          <p className="text-xs text-gray-500">
            {formatSoldCount(product.sold ?? 0)} sold
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
