import { FC, useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
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
        <CarouselPrevious />
        <CarouselNext />
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
            className="md:basis-1/3 lg:basis-1/3 cursor-pointer py-2"
            onClick={() =>
              product.product_id && handleProductClick(product.product_id)
            }
          >
            <div className="relative w-full h-80 rounded-sm overflow-hidden  bg-white shadow border">
              <Image
                src={
                  typeof product.image_url === "string"
                    ? product.image_url
                    : fallbackImage
                }
                alt={product.name}
                width={400}
                height={300}
                className="w-full h-full object-fit"
                priority
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 bg-opacity-50 p-4 text-white">
                <h3 className="text-lg font-bold">{product.name}</h3>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="ml-18" />
      <CarouselNext className="mr-18" />
    </Carousel>
  );
};

export default FeaturedProductCarousel;
