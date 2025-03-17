import { FC } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { recommendedItems } from "@/lib/dashboardConfig";
import Image from "next/image";

const RecommendedItemsSection: FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {recommendedItems.map((item) => (
        <Card key={item.id} className="shadow-lg">
          <CardHeader>
            <Image
              width={400}
              height={400}
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover"
            />
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
