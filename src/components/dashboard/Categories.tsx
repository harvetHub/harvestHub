import { FC } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { categories } from "@/lib/productsConfig";

const CategoriesSection: FC = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 py-4">
      {categories.map((category) => (
        <div key={category.id}>
          <Link href={`/products/${category.value}`} passHref>
            <Card className="shadow-sm rounded-none   hover:scale-105 cursor-pointer h-full justify-start items-center">
              <CardHeader>
                <CardTitle className="text-4xl">{category.icon}</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="text-sm font-bold text-center">
                  {category.name}
                </h3>
              </CardContent>
            </Card>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default CategoriesSection;
