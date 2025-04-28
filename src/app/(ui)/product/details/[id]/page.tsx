"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductDetails from "@/components/product/ProductDetails";
import { Product } from "@/lib/definitions";
import { MainLayout } from "@/layout/MainLayout";
import RelatedProducts from "@/components/product/RelatedProducts";

const ProductDetailsPage = () => {
  const params = useParams();
  const productId = params?.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/productById/${productId}`);
        const data = await response.json();
        setProduct(data.product || null);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch product details:", error);
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  return (
    <MainLayout>
      <ProductDetails product={product} loading={loading} />{" "}
      {/* <RecommendedItemsSection /> */}
      <div className="myContainer mx-auto mb-10">
        <h2 className="text-2xl font-bold mb-4">Recommended Items</h2>
        <RelatedProducts category={product?.product_type ?? null} />
      </div>
    </MainLayout>
  );
};

export default ProductDetailsPage;
