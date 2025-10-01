import { FC } from "react";
import { usePathname } from "next/navigation";
import ProductCard from "./ProductCard";
import { Product } from "@/lib/definitions";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductListProps {
  products: Product[];
  loading: boolean;
}

const ProductList: FC<ProductListProps> = ({ products, loading }) => {
  const pathname = usePathname();

  // Check if we're on the product page (adjust as needed for your routes)
  const isProductPage = pathname.startsWith("/product");

  if (loading) {
    return (
      <div
        className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 ${
          isProductPage ? "xl:grid-cols-5" : "xl:grid-cols-6"
        } gap-2`}
      >
        {[...Array(15)].map((_, index) => (
          <div key={index} className="shadow-lg p-8">
            <Skeleton className="w-full h-30" />
            <Skeleton className="h-6 w-3/4 mt-4" />
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-1/3  mt-2" />
          </div>
        ))}
      </div>
    );
  }

  // Show all products (including those with stocks = 0)
  const filteredProducts = products;

  if (filteredProducts.length === 0) {
    return <p className="text-center text-xl">No products found.</p>;
  }

  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 ${
        isProductPage ? "xl:grid-cols-5" : "xl:grid-cols-6"
      } gap-2`}
    >
      {filteredProducts.map((product, index) => (
        <ProductCard key={index} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
