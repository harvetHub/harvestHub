"use client";

import { MainLayout } from "@/layout/MainLayout";
import FeaturedProductCarousel from "@/components/dashboard/Featured";
import CategoriesSection from "@/components/dashboard/Categories";
import RecommendedItemsSection from "@/components/dashboard/Recommended";

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="myContainer mx-auto">
        <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
        <FeaturedProductCarousel />

        <h2 className="text-2xl font-bold mt-8 mb-4">Categories</h2>
        <CategoriesSection />

        <h2 className="text-2xl font-bold mt-8 mb-4">Recommended Items</h2>
        <RecommendedItemsSection />
      </div>
    </MainLayout>
  );
}
