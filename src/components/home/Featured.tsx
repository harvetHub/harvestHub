import { FC, useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton component
import { Product } from "@/lib/definitions";
import { useRouter } from "next/navigation";
import { fallbackImage } from "@/lib/fallbackImg";

const FeaturedProductCarousel: FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const handleProductClick = (id: number) => {
    router.push(`/product/details/${id}`);
  };

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch("/api/products?is_featured=true");
        const data = await response.json();
        setFeaturedProducts(data.products || []);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    // Skeleton loading animation while fetching data
    return (
      <Carousel>
        <CarouselContent>
          {[...Array(3)].map((_, index) => (
            <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/3">
              <div className="relative w-full h-55 rounded-sm overflow-hidden">
                <Skeleton className="w-full h-full" />
              </div>
              <div className="mt-2">
                <Skeleton className="h-4 w-3/4 mb-2 " />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    );
  }

  if (featuredProducts.length === 0) {
    return <p>No featured products available.</p>;
  }

  return (
    <Carousel>
      <CarouselContent>
        {featuredProducts.map((product, index) => (
          <CarouselItem
            key={index}
            className="md:basis-1/3 lg:basis-1/3 cursor-pointer"
            onClick={() =>
              product.product_id && handleProductClick(product.product_id)
            }
          >
            <div className="relative w-full h-60 rounded-sm overflow-hidden">
              <Image
                src={
                  typeof product.image_url === "string"
                    ? product.image_url
                    : fallbackImage
                } // Prioritize product.image, fallback to fallbackImage
                alt={product.name}
                layout="fill"
                objectFit="cover"
                className=""
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/30 bg-opacity-50 p-4 text-white">
                <h3 className="text-lg font-bold">{product.name}</h3>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default FeaturedProductCarousel;
