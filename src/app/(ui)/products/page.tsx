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
import { Skeleton } from "@/components/ui/skeleton";
import Pagination from "@/components/Pagination";
import StarRating from "@/components/StarRating";
import { Product, categories } from "@/lib/productsConfig";

const fallbackImage =
  "https://via.placeholder.com/150?text=Image+Not+Available";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [page, setPage] = useState(1);
  const [limit] = useState(13); // Ensure limit is set to 13
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filter !== "All" && !searchTerm && { product_type: filter }),
        ...(searchTerm && { search_term: searchTerm }),
      }).toString();

      const response = await fetch(`/api/products?${query}`);
      const data = await response.json();
      setProducts(data.products || []);
      setFilteredProducts(data.products || []);
      setTotal(data.total || 0);
      setLoading(false);
    };

    fetchProducts();
  }, [page, limit, filter, searchTerm]);

  useEffect(() => {
    let filtered = products;

    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    setFilteredProducts(filtered);
  }, [priceRange, products]);

  const handleFilterChange = (category: string) => {
    setFilter(category);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <MainLayout>
      <div className="container mx-auto p-4 flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 p-4">
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
            max={10000}
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

        <div className="w-full md:w-3/4 p-4">
          <h1 className="text-3xl font-bold text-center mb-8">Products</h1>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[...Array(13)].map((_, index) => (
                <Card key={index} className="shadow-lg">
                  <CardHeader>
                    <Skeleton className="w-full h-48" />
                    <CardTitle className="mt-4">
                      <Skeleton className="h-6 w-3/4" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <p className="text-center text-xl">No products found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <Card
                  key={product.product_id}
                  className="shadow-lg flex flex-col gap-4 justify-between"
                >
                  <CardHeader>
                    <Image
                      src={product.image_url || fallbackImage}
                      alt={product.name}
                      width={150}
                      height={150}
                      className="w-full h-40 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = fallbackImage;
                      }}
                    />
                    <CardTitle className="mt-4">{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="description overflow-hidden text-ellipsis">
                      {product.description}
                    </p>
                    <div className="mt-4">
                      <p className="font-bold">₱{product.price.toFixed(2)}</p>
                      <StarRating rating={product.rating || 0} />
                    </div>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Button className="w-full">Add to Cart</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {filteredProducts.length > 0 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Products;
