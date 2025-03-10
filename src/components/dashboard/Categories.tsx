import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const categories = [
  {
    id: 1,
    name: "Fruits",
    icon: "🍎",
  },
  {
    id: 2,
    name: "Vegetables",
    icon: "🥕",
  },
  {
    id: 3,
    name: "Dairy",
    icon: "🥛",
  },
];

const CategoriesSection: FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {categories.map((category) => (
        <Card key={category.id} className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">{category.icon}</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-bold">{category.name}</h3>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CategoriesSection;
