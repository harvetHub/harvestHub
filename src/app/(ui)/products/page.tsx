"use client";

import { useEffect, useState } from "react";
import { MainLayout } from "@/layout/MainLayout";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Product, categories } from "@/lib/productsConfig";

const fallbackImage = "";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filter !== "All" && { product_type: filter }),
      }).toString();

      const response = await fetch(`/api/products?${query}`);
      const data = await response.json();
      setProducts(data.products);
      setFilteredProducts(data.products);
      setTotal(data.total);
    };

    fetchProducts();
  }, [page, limit, filter]);

  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    setFilteredProducts(filtered);
  }, [searchTerm, priceRange, products]);

  const handleFilterChange = (category: string) => {
    setFilter(category);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <MainLayout>
      <div className="container mx-auto p-4 flex">
        <div className="w-1/4 p-4">
          <h2 className="text-xl font-bold mt-8 mb-4">Search Products</h2>
          <Input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full mb-4"
          />
          <h2 className="text-xl font-bold mb-4">Filter by Category</h2>
          <div className="space-y-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={filter === category ? "default" : "outline"}
                onClick={() => handleFilterChange(category)}
                className="w-full text-left"
              >
                {category}
              </Button>
            ))}
          </div>

          <h2 className="text-xl font-bold mt-8 mb-4">Price Range</h2>
          <Slider
            min={0}
            max={1000}
            value={priceRange}
            onValueChange={(value: number[]) =>
              setPriceRange(value as [number, number])
            }
            className="w-full"
          />
          <div className="flex justify-between mt-2">
            <span>₱{priceRange[0]}</span>
            <span>₱{priceRange[1]}</span>
          </div>
        </div>

        <div className="w-3/4 p-4">
          <h1 className="text-3xl font-bold text-center mb-8">Products</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <Card key={product.product_id} className="shadow-lg">
                <CardHeader>
                  <Image
                    src={product.image_url || fallbackImage}
                    alt={product.name}
                    width={150}
                    height={150}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = fallbackImage;
                    }}
                  />
                  <CardTitle className="mt-4">{product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{product.description}</p>
                  <p className="font-bold mt-2">₱{product.price.toFixed(2)}</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Add to Cart</Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-12 flex justify-center gap-2">
            <Button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            {[...Array(totalPages)].map((_, index) => (
              <Button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                variant={page === index + 1 ? "default" : "outline"}
              >
                {index + 1}
              </Button>
            ))}
            <Button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Products;
