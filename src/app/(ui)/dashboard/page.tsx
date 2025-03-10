"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeaturedProductCarousel from "@/components/dashboard/Featured";
import CategoriesSection from "@/components/dashboard/Categories";
import RecommendedItemsSection from "@/components/dashboard/Recommended";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const products = [
  {
    id: 1,
    name: "Fresh Apples",
    description: "Crisp and juicy apples from local farms.",
    price: "$3.99/lb",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    name: "Organic Carrots",
    description: "Sweet and crunchy organic carrots.",
    price: "$2.49/lb",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    name: "Free-Range Eggs",
    description: "Fresh eggs from free-range chickens.",
    price: "$4.99/dozen",
    image: "https://via.placeholder.com/150",
  },
];

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          HarvestHub E-Commerce
        </h1>

        <div className="mb-8">
          <Input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
        <FeaturedProductCarousel />

        <h2 className="text-2xl font-bold mt-8 mb-4">Categories</h2>
        <CategoriesSection />

        <h2 className="text-2xl font-bold mt-8 mb-4">Recommended Items</h2>
        <RecommendedItemsSection />

        <h2 className="text-2xl font-bold mt-8 mb-4">All Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="shadow-lg">
              <CardHeader>
                {/* <Image
                  width={150}
                  height={150}
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                /> */}
                <CardTitle className="mt-4">{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{product.description}</p>
                <p className="font-bold mt-2">{product.price}</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Add to Cart</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
