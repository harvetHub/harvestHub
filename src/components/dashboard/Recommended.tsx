import { FC } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import Image from "next/image";

const recommendedItems = [
  {
    id: 1,
    name: "Fresh Apples",
    description: "Crisp and juicy apples from local farms.",
    price: "$3.99/lb",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    name: "Organic Carrots",
    description: "Sweet and crunchy organic carrots.",
    price: "$2.49/lb",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    name: "Free-Range Eggs",
    description: "Fresh eggs from free-range chickens.",
    price: "$4.99/dozen",
    image: "https://via.placeholder.com/150",
  },
];

const RecommendedItemsSection: FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {recommendedItems.map((item) => (
        <Card key={item.id} className="shadow-lg">
          <CardHeader>
            {/* <Image
              width={150}
              height={150}
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover"
            /> */}
            <CardTitle className="mt-4">{item.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{item.description}</p>
            <p className="font-bold mt-2">{item.price}</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Add to Cart</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default RecommendedItemsSection;
