"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Import useRouter
import { MainLayout } from "@/layout/MainLayout";
import ProductList from "@/components/product/ProductList";
import FilterSidebar from "@/components/product/FilterSidebar";
import Pagination from "@/components/Pagination";
import { Product } from "@/lib/definitions";

const Products = () => {
  const params = useParams();
  const router = useRouter(); // Initialize useRouter
  const category = params?.category;

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState(category || "All");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      // Build the query parameters
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filter !== "All" && {
          product_type: Array.isArray(filter) ? filter.join(",") : filter,
        }), // Ensure product_type is a string
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
  const filtered = products.filter((product) => {
    // Exclude if name is null, undefined, or empty string
    if (!product.name || product.name.trim().length === 0) {
      return false;
    }

    // Apply price range filter
    if (priceRange[0] !== 0 || priceRange[1] !== 1000) {
      return (
        product.price >= priceRange[0] &&
        product.price <= priceRange[1]
      );
    }

    // If default range, include all valid-name products
    return true;
  });

  setFilteredProducts(filtered);
}, [priceRange, products]);


  // Update the URL dynamically when the filter changes
  useEffect(() => {
    if (filter !== category) {
      const newPath = filter === "All" ? "/product/All" : `/product/${filter}`;
      router.push(newPath); // Update the URL dynamically
    }
  }, [filter, category, router]);

  const totalPages = Math.ceil(total / limit);

  return (
    <MainLayout>
      <div className="myContainer mx-auto flex flex-col md:flex-row">
        <FilterSidebar
          filter={Array.isArray(filter) ? filter.join(",") : filter}
          setFilter={setFilter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          minPrice={minPrice}
          maxPrice={maxPrice}
          setMinPrice={setMinPrice}
          setMaxPrice={setMaxPrice}
        />
        <div className="w-full md:w-3/4 p-4">
          <h1 className="text-3xl font-bold text-center mb-8">Products</h1>
          <ProductList products={filteredProducts} loading={loading} />
          {filteredProducts.length > 0 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Products;
