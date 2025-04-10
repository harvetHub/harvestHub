/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/Pagination";
import { AdminMainLayout } from "@/layout/AdminMainLayout";
import InventoryTable from "@/components/admin/inventory/InvenTable";

import { categories } from "@/lib/productsConfig";
import Swal from "sweetalert2";
import { InventoryType } from "@/lib/definitions";

export default function InventoryManagement() {
  const [inventory, setInventory] = useState<InventoryType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1); // Total pages

  // Fetch inventory items from the API
  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(selectedCategory ? { product_type: selectedCategory } : {}),
        ...(searchTerm ? { search_term: searchTerm } : {}),
      });

      const response = await fetch(`/api/products?${queryParams.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setInventory(
          data.products
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((product: any) => ({
              id: product.product_id,
              sku: product.sku,
              name: product.name,
              category:
                categories.find((cat) => cat.value === product.product_type)
                  ?.name || "Unknown",
              stocks: product.stocks,
              price: product.price,
              image_url: product.image_url,
            }))
            .sort((a: { name: string }, b: { name: string }) =>
              a.name.localeCompare(b.name)
            )
        );
        setTotalPages(Math.ceil(data.total / 10)); // Calculate total pages
      } else {
        Swal.fire("Error", data.error || "Failed to fetch inventory", "error");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      Swal.fire(
        "Error",
        `An unexpected error occurred: ${errorMessage}`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [page, selectedCategory, searchTerm]);
  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
    setPage(1); // Reset to the first page when searching
  };

  const handleCategoryFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setPage(1); // Reset to the first page when filtering by category
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleAddStock = (item: InventoryType) => {
    Swal.fire({
      title: "Add Stock",
      input: "number",
      inputLabel: `Enter quantity to add for ${item.name}`,
      inputAttributes: {
        min: "1",
      },
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const quantityToAdd = parseInt(result.value, 10);
        if (isNaN(quantityToAdd) || quantityToAdd <= 0) {
          Swal.fire("Error", "Invalid quantity entered.", "error");
          return;
        }

        try {
          const response = await fetch(`/api/admin/inventory`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: item.id,
              quantity: item.stocks + quantityToAdd,
            }),
          });

          if (response.ok) {
            Swal.fire("Success", "Stock added successfully.", "success");
            fetchInventory(); // Refresh inventory
          } else {
            const data = await response.json();
            Swal.fire("Error", data.error || "Failed to add stock.", "error");
          }
        } catch (error) {
          Swal.fire("Error", "An unexpected error occurred.", "error");
        }
      }
    });
  };

  const handleReduceStock = (item: InventoryType) => {
    Swal.fire({
      title: "Reduce Stock",
      input: "number",
      inputLabel: `Enter quantity to reduce for ${item.name}`,
      inputAttributes: {
        min: "1",
        max: item.stocks.toString(),
      },
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const quantityToReduce = parseInt(result.value, 10);
        if (
          isNaN(quantityToReduce) ||
          quantityToReduce <= 0 ||
          quantityToReduce > item.stocks
        ) {
          Swal.fire("Error", "Invalid quantity entered.", "error");
          return;
        }

        try {
          const response = await fetch(`/api/admin/inventory`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: item.id,
              quantity: item.stocks - quantityToReduce,
            }),
          });

          if (response.ok) {
            Swal.fire("Success", "Stock reduced successfully.", "success");
            fetchInventory(); // Refresh inventory
          } else {
            const data = await response.json();
            Swal.fire(
              "Error",
              data.error || "Failed to reduce stock.",
              "error"
            );
          }
        } catch (error) {
          Swal.fire("Error", "An unexpected error occurred.", "error");
        }
      }
    });
  };

  return (
    <AdminMainLayout>
      <section className="mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Inventory Management</h1>

        <div className="flex items-center space-x-4 mb-4">
          <Input
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <select
            value={selectedCategory}
            onChange={handleCategoryFilter}
            className="block w-1/3 min-w-fit py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex m-4">
          <InventoryTable
            inventory={inventory}
            onAddStock={handleAddStock}
            onReduceStock={handleReduceStock}
            loading={loading}
          />
        </div>
        {inventory.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </section>
    </AdminMainLayout>
  );
}
