import { FC } from "react";
import { Carousel } from "@/components/ui/carousel";
// import Image from "next/image";

const featuredProducts = [
  {
    id: 1,
    name: "Fresh Apples",
    image: "https://via.placeholder.com/600x400",
  },
  {
    id: 2,
    name: "Organic Carrots",
    image: "https://via.placeholder.com/600x400",
  },
  {
    id: 3,
    name: "Free-Range Eggs",
    image: "https://via.placeholder.com/600x400",
  },
];

const FeaturedProductCarousel: FC = () => {
  return (
    <Carousel>
      {featuredProducts.map((product) => (
        <div key={product.id} className="relative w-full h-64">
          {/* <Image
            src={product.image}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          /> */}
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4 text-white">
            <h3 className="text-lg font-bold">{product.name}</h3>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default FeaturedProductCarousel;
