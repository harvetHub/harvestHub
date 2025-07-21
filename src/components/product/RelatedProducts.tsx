import { FC, useEffect, useState } from "react";
import ProductList from "@/components/product/ProductList";
import { Product } from "@/lib/definitions";

interface RelatedProductsProps {
  category: string | null;
}

const RelatedProducts: FC<RelatedProductsProps> = ({ category }) => {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!category) return;

      try {
        const response = await fetch(
          `/api/products?product_type=${category}&limit=4`
        );
        const data = await response.json();
        setRelatedProducts(data.products || []);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch related products:", error);
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [category]);

  return <ProductList products={relatedProducts} loading={loading} />;
};

export default RelatedProducts;
