"use client";

import { MainLayout } from "@/layout/MainLayout";
import FeaturedProductCarousel from "@/components/home/Featured";
import CategoriesSection from "@/components/home/Categories";
import RecommendedItemsSection from "@/components/home/RecommendedItems";

export default function Home() {
  return (
    <MainLayout>
      <div className="myContainer mx-auto mb-8">
        <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
        <FeaturedProductCarousel />

        <h2 className="text-2xl font-bold mt-8">Categories</h2>
        <CategoriesSection />

        <h2 className="text-2xl font-bold mt-8 mb-4">Recommended Items</h2>
        <RecommendedItemsSection />
      </div>
    </MainLayout>
  );
}
