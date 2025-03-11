"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeaturedProductCarousel from "@/components/dashboard/Featured";
import CategoriesSection from "@/components/dashboard/Categories";
import RecommendedItemsSection from "@/components/dashboard/Recommended";

export default function Dashboard() {
  return (
    <div>
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-8">HarvestHub Shop</h1>

        <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
        <FeaturedProductCarousel />

        <h2 className="text-2xl font-bold mt-8 mb-4">Categories</h2>
        <CategoriesSection />

        <h2 className="text-2xl font-bold mt-8 mb-4">Recommended Items</h2>
        <RecommendedItemsSection />
      </div>
      <Footer />
    </div>
  );
}
