import { FC, useEffect, useState } from "react";
import ProductList from "@/components/product/ProductList";
import { Product } from "@/lib/definitions";

const RecommendedItemsSection: FC = () => {
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        const response = await fetch("/api/products?is_recommended=true");
        const data = await response.json();
        setRecommendedProducts(data.products || []);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch recommended products:", error);
        setLoading(false);
      }
    };

    fetchRecommendedProducts();
  }, []);

  return <ProductList products={recommendedProducts} loading={loading} />;
};

export default RecommendedItemsSection;
