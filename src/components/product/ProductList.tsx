import { FC } from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/lib/definitions";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductListProps {
  products: Product[];
  loading: boolean;
}

const ProductList: FC<ProductListProps> = ({ products, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {[...Array(13)].map((_, index) => (
          <div key={index} className="shadow-lg p-8">
            <Skeleton className="w-full h-30" />
            <Skeleton className="h-6 w-3/4 mt-4" />
            <Skeleton className="h-4 w-full mb-2  mt-2" />
            <Skeleton className="h-4 w-1/2  mt-2" />
            <Skeleton className="h-10 w-full mt-4" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return <p className="text-center text-xl">No products found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-4">
      {products.map((product) => (
        <ProductCard key={product.product_id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
