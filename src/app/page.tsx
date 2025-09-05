"use client";

import { MainLayout } from "@/layout/MainLayout";
import FeaturedProductCarousel from "@/components/home/Featured";
import CategoriesSection from "@/components/home/Categories";
import RecommendedItemsSection from "@/components/home/RecommendedItems";

export default function Home() {
  return (
    <MainLayout>
      <div className="myContainer mx-auto mb-8">
        <h2 className="text-lg text-gray-600 font-bold mb-2 mt-4 ">
          Featured Products
        </h2>
        <FeaturedProductCarousel />
        <p className="border-b border-gray pt-4"> </p>

        <h2 className="text-lg text-gray-600 font-bold mb-2 mt-4 ">
          Categories
        </h2>
        <CategoriesSection />
        <p className="border-b border-gray pt-4"> </p>
        <h2 className="text-lg text-gray-600 font-bold mb-2 mt-4 ">
          Recommended Items
        </h2>
        <RecommendedItemsSection />
      </div>
    </MainLayout>
  );
}
