import { FC } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { categories } from "@/lib/productsConfig";

const CategoriesSection: FC = () => {
  return (
    <div className="flex gap-4 overflow-x-auto w-full py-4">
      {categories.map((category) => (
        <div key={category.id} className="flex-shrink-0 w-32">
          <Link href={`/products/${category.value}`} passHref>
            <Card className="shadow-sm cursor-pointer h-full justify-start items-center">
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
