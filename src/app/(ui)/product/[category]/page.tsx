"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { categories } from "@/lib/productsConfig";
import { Product } from "@/lib/definitions";
import { useCartStore } from "@/store/cartStore";

const fallbackImage =
  "https://via.placeholder.com/150?text=Image+Not+Available";

const Products = () => {
  const router = useRouter();
  const params = useParams();
  const category = params?.category;

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState(category || "All"); // Default to "All" or the category from the URL
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [page, setPage] = useState(1);
  const [limit] = useState(13);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filter !== "All" &&
          !searchTerm && { product_type: String(filter) }),
        ...(searchTerm && { search_term: String(searchTerm) }),
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

  const handleFilterChange = (categoryValue: string) => {
    setFilter(categoryValue);
    router.push(`/product/${categoryValue}`); // Update the URL dynamically
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0 && value <= maxPrice) {
      setMinPrice(value);
      setPriceRange([value, priceRange[1]]);
    }
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= minPrice) {
      setMaxPrice(value);
      setPriceRange([priceRange[0], value]);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <MainLayout>
      <div className="myContainer mx-auto flex flex-col md:flex-row">
        <div className="w-full md:w-1/4">
          <h2 className="text-xl font-bold mt-8 mb-4">Search Products</h2>
          <Input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full mb-4"
          />

          <h2 className="text-xl font-bold mt-8 mb-4 border-t pt-4">
            Price Range
          </h2>
          <div className="flex items-center space-x-2 mb-4">
            <Input
              type="number"
              value={minPrice}
              onChange={handleMinPriceChange}
              className="w-1/2"
              placeholder="Min"
            />
            <Input
              type="number"
              value={maxPrice}
              onChange={handleMaxPriceChange}
              className="w-1/2"
              placeholder="Max"
            />
          </div>
          <Slider
            min={0}
            max={maxPrice}
            value={priceRange}
            onValueChange={(value: number[]) =>
              setPriceRange(value as [number, number])
            }
            className="w-full"
          />
          <div className="flex justify-between mt-2 mb-4 border-b pb-4">
            <span>₱{priceRange[0]}</span>
            <span>₱{priceRange[1]}</span>
          </div>
          <h2 className="text-xl font-bold mb-4">Filter by Category</h2>
          <div className="space-y-2">
            <Button
              key="all"
              variant={filter === "All" ? "default" : "outline"}
              onClick={() => handleFilterChange("All")}
              className="w-full text-left"
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={filter === category.value ? "default" : "outline"}
                onClick={() => handleFilterChange(category.value)}
                className="w-full text-left flex items-center space-x-2"
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </Button>
            ))}
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
                  className="flex rounded-sm border-none flex-col justify-between"
                >
                  <CardHeader>
                    <Image
                      src={
                        typeof product.image_url === "string"
                          ? product.image_url
                          : product.image_url instanceof File
                          ? URL.createObjectURL(product.image_url)
                          : fallbackImage
                      }
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
                    <Button
                      className="w-full"
                      onClick={() =>
                        addItem({
                          productId: product.product_id?.toString() || "",
                          name: product.name,
                          price: product.price,
                          quantity: 1,
                          image_url:
                            typeof product.image_url === "string"
                              ? product.image_url
                              : fallbackImage,
                        })
                      }
                    >
                      Add to Cart
                    </Button>
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
