import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { categories } from "@/lib/dashboardConfig";

const CategoriesSection: FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5  gap-8">
      {categories.map((category) => (
        <Card key={category.id} className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-4xl">{category.icon}</CardTitle>
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
