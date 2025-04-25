import { FC, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { featuredProducts } from "@/lib/dashboardConfig";

const fallbackImage =
  "https://images.unsplash.com/photo-1475948164756-9a56289068fb?q=80&w=2020&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const FeaturedProductCarousel: FC = () => {
  const [imageSrc, setImageSrc] = useState(
    featuredProducts.map((product) => product.image)
  );

  const handleImageError = (index: number) => {
    setImageSrc((prev) => {
      const newImageSrc = [...prev];
      newImageSrc[index] = fallbackImage;
      return newImageSrc;
    });
  };

  return (
    <Carousel>
      <CarouselContent>
        {featuredProducts.map((product, index) => (
          <CarouselItem key={product.id} className=" md:basis-1/3 lg:basis-1/3">
            <div className="relative w-full h-60 rounded-sm overflow-hidden">
              <Image
                src={imageSrc[index]}
                alt={product.name}
                layout="fill"
                objectFit="cover"
                className=""
                onError={() => handleImageError(index)}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/30  bg-opacity-50 p-4 text-white">
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
