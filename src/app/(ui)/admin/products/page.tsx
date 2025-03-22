"use client";

import { useState } from "react";
import ProductTable from "@/components/admin/product/ProductTable";
import ProductForm from "@/components/admin/product/ProductForm";
import { validateProduct } from "@/utils/admin/product/formValidation";
import { Product } from "@/lib/definitions";
import { categories } from "@/lib/productsConfig";
import AdminSidebar from "@/components/AdminSidebar";
import Swal from "sweetalert2";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const mockProducts: Product[] = [
  {
    product_id: "1",
    name: "Product A",
    description: "Description for Product A",
    price: 100,
    image_url: "/placeholder.png",
    product_type: "seeds",
    sku: "SEEDS-001",
    rating: 4.5,
  },
  {
    product_id: "2",
    name: "Product B",
    description: "Description for Product B",
    price: 200,
    image_url: "/placeholder.png",
    product_type: "fertilizers",
    sku: "FERT-002",
    rating: 4.0,
  },
];

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(mockProducts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    image_url: "",
    product_type: categories[0].value,
    sku: "",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear error when user types
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const mockUrl = URL.createObjectURL(file);
      setFormData({ ...formData, image_url: mockUrl });
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: 0,
      image_url: "",
      product_type: categories[0].value,
      sku: "",
    });
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image_url,
      product_type: product.product_type,
      sku: product.sku || "",
    });
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedProducts = products.filter(
          (product) => product.product_id !== productId
        );
        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
        Swal.fire("Deleted!", "The product has been deleted.", "success");
      }
    });
  };

  const handleSaveProduct = () => {
    const validationErrors = validateProduct(
      formData,
      products,
      editingProduct
    );
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (editingProduct) {
      // Update existing product
      const updatedProducts = products.map((product) =>
        product.product_id === editingProduct.product_id
          ? {
              ...editingProduct,
              ...formData,
              price: parseFloat(formData.price.toString()),
            }
          : product
      );
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      Swal.fire("Success", "Product updated successfully.", "success");
    } else {
      // Add new product
      const newProduct: Product = {
        product_id: (products.length + 1).toString(),
        ...formData,
        price: parseFloat(formData.price.toString()),
      };
      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      Swal.fire("Success", "Product added successfully.", "success");
    }

    setIsDialogOpen(false);
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <section className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Product Management</h1>

        <div className="flex items-center space-x-4 mb-4">
          <Input
            placeholder="Search products..."
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Button onClick={handleAddProduct}>Add Product</Button>
        </div>

        <ProductTable
          products={filteredProducts}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />

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
    </div>
  );
}
