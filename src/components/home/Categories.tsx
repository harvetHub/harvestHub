import { FC } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { categories } from "@/lib/productsConfig";

const CategoriesSection: FC = () => {
  const router = useRouter();

  const handleCategoryClick = (categoryValue: string) => {
    // Ensure the category value is valid and navigate to the dynamic route
    if (categoryValue) {
      router.push(`/product/${categoryValue}`);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 ">
      {categories.map((category) => (
        <div
          key={category.id}
          onClick={() => handleCategoryClick(category.value)} // Handle click event
          className="cursor-pointer "
        >
          <Card className="shadow-sm p-6 rounded-none gap-4 hover:scale-105 h-full justify-start items-center">
            <CardHeader>
              <CardTitle className="text-4xl">{category.icon}</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-sm font-bold text-center">{category.name}</h3>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default CategoriesSection;
