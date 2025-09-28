"use client";
import { FC } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/cart/useCart"; // zustand-powered hook
import { Product } from "@/lib/definitions";
import { fallbackImage } from "@/lib/fallbackImg";
import { formatPrice } from "@/utils/formatPrice";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

interface ProductDetailsProps {
  product: Product | null;
  loading: boolean;
}

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

const humanize = (input?: string | null) =>
  input ? String(input).replace(/_/g, " ").trim() : null;

const ProductDetails: FC<ProductDetailsProps> = ({ product, loading }) => {
  const { addToCartWithSwal } = useCart(); // zustand store action

  if (loading) {
    return (
      <div className="myContainer grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto p-4">
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

  const avg = product.rating_average ?? product.rating ?? 0;
  const statusLabel = humanize(product.status) ?? "Coming Soon";
  const statusMsg = humanize(product.status_message);

  const isAvailable = product.status === "available";

  return (
    <div className="myContainer lg:my-20 my-10 mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <div className="relative w-full  border-2 shadow-lg h-64 md:h-96 rounded-sm overflow-hidden bg-gray-50">
            {/* status message badge */}
            {statusMsg && (
              <div className="absolute top-3 left-3 z-20">
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-md bg-white/90 text-slate-800">
                  {statusMsg}
                </span>
              </div>
            )}

            {/* status enum badge */}
            {product.status && product.status !== "available" && (
              <div className="absolute top-3 right-3 z-20">
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-white/90 text-slate-900">
                  {statusLabel.replace(/\b\w/g, (ch) => ch.toUpperCase())}
                </span>
              </div>
            )}

            <Image
              src={
                typeof product.image_url === "string"
                  ? product.image_url
                  : product.image_url
                  ? URL.createObjectURL(product.image_url)
                  : fallbackImage
              }
              alt={product.name}
              width={800}
              height={800}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center" aria-hidden>
              {renderStars(avg)}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-semibold">
                {avg ? Number(avg).toFixed(1) : "0.0"}
              </span>
              <span className="text-xs text-gray-500">
                {" "}
                ({product.rating_count ?? 0})
              </span>
            </div>
          </div>

          <p className="text-lg text-gray-700 mb-4">{product.description}</p>

          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-2xl font-extrabold text-green-600">
                {formatPrice(product.price)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {product.sold ?? 0} sold
              </p>
            </div>

            {/* show stock if available info exists */}
            {typeof product.stocks === "number" && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Stock:</span>{" "}
                <span className="ml-1">{product.stocks}</span>
              </div>
            )}
          </div>

          <div className="mt-auto">
            {/* hide Add to Cart entirely if status is not available */}
            {isAvailable ? (
              <Button
                className="w-full md:w-1/2"
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
            ) : (
              <div className="w-full md:w-1/2">
                <Button className="w-full" disabled>
                  {product.status
                    ? statusLabel.replace(/\b\w/g, (ch) => ch.toUpperCase())
                    : "Unavailable"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
