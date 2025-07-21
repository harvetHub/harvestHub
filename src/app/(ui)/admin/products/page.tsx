"use client";

import { useState, useEffect } from "react";
import ProductTable from "@/components/admin/product/ProductTable";
import ProductForm from "@/components/admin/product/ProductForm";
import { validateProduct } from "@/utils/admin/product/formValidation";
import { Product } from "@/lib/definitions";
import { categories } from "@/lib/productsConfig";
import Swal from "sweetalert2";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/Pagination";
import { AdminMainLayout } from "@/layout/AdminMainLayout";
import useAuthCheck from "@/hooks/admin/useAuthCheck";

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Product>({
    product_id: 0,
    name: "",
    description: "",
    price: 0,
    image_url: "",
    product_type: "",
    sku: "",
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1); // Total pages

  // Fetch products from the API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/products?page=${page}&limit=10&product_type=${selectedCategory}&search_term=${searchTerm}`
      );
      const data = await response.json();

      if (response.ok) {
        setProducts(data.products);
        setFilteredProducts(data.products);
        setTotalPages(Math.ceil(data.total / 10)); // Calculate total pages
      } else {
        Swal.fire("Error", data.error || "Failed to fetch products", "error");
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
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedCategory, page]);

  const handleInputChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear error when user types
  };

  const handleImageUpload = (file: File) => {
    // Set the file for backend processing
    setFormData({ ...formData, image_url: file });

    // Optionally, generate a preview URL for the frontend
    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, imagePreview: previewUrl }));
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      product_id: 0,
      name: "",
      description: "",
      price: 0,
      image_url: "",
      product_type: "",
      sku: "",
    });
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      product_id: product.product_id ?? 0,
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: typeof product.image_url === "string" ? product.image_url : "",
      product_type: product.product_type,
      sku: product.sku || "",
    });
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `/api/admin/products?product_id=${productId}`,
            {
              method: "DELETE",
            }
          );

          const data = await response.json();

          if (response.ok) {
            Swal.fire("Deleted!", "The product has been deleted.", "success");
            fetchProducts(); // Refresh the product list
          } else {
            Swal.fire(
              "Error",
              data.error || "Failed to delete product.",
              "error"
            );
          }
        } catch {
          Swal.fire("Error", "An unexpected error occurred.", "error");
        }
      }
    });
  };

  const handleSaveProduct = async () => {
    const validationErrors = validateProduct(
      formData,
      products,
      editingProduct
    );
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append(
        "product_id",
        (formData.product_id ?? 0).toString()
      );
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price.toString());
      formDataToSend.append("product_type", formData.product_type);
      formDataToSend.append("sku", formData.sku || "");

      // Append the image file if it exists
      if (
        typeof formData.image_url === "object" &&
        formData.image_url instanceof File
      ) {
        formDataToSend.append("image_url", formData.image_url);
      }

      const response = await fetch(`/api/admin/products`, {
        method: editingProduct ? "PUT" : "POST",
        body: formDataToSend, // Use FormData
      });

      if (response.ok) {
        Swal.fire(
          "Success",
          editingProduct
            ? "Product updated successfully."
            : "Product added successfully.",
          "success"
        );
        setIsDialogOpen(false);
        fetchProducts(); // Refresh the product list
      } else {
        const data = await response.json();
        Swal.fire("Error", data.error || "Failed to save product", "error");
      }
    } catch {
      Swal.fire("Error", "An unexpected error occurred", "error");
    }
  };

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

  // Check if the user is authenticated
  useAuthCheck();

  return (
    <AdminMainLayout>
      <section className="mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Product Management</h1>

        <div className="flex items-center space-x-4 mb-4">
          <Input
            placeholder="Search products..."
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
          <Button className="cursor-pointer" onClick={handleAddProduct}>
            Add Product
          </Button>
        </div>

        <div className="flex m-4">
          <ProductTable
            products={filteredProducts}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            loading={loading}
          />
        </div>
        {filteredProducts.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        {isDialogOpen && (
          <ProductForm
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            formData={formData}
            errors={errors}
            onChange={handleInputChange}
            onImageUpload={handleImageUpload}
            onSave={handleSaveProduct}
            onCancel={() => setIsDialogOpen(false)}
          />
        )}
      </section>
    </AdminMainLayout>
  );
}
