"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { categories } from "@/lib/productsConfig";
import Product from "@/lib/definitions";
import AdminSidebar from "@/components/AdminSidebar";

const mockProducts: Product[] = [
  {
    product_id: "1",
    name: "Product A",
    description: "Description for Product A",
    price: 100,
    image_url: "",
    category: "Seeds",
    product_type: "Agriculture",
    rating: 4.5,
  },
  {
    product_id: "2",
    name: "Product B",
    description: "Description for Product B",
    price: 200,
    image_url: "",
    category: "Fertilizers",
    product_type: "Agriculture",
    rating: 4.0,
  },
];

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    category: categories[0],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      image_url: "",
      category: categories[0],
    });
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image_url: product.image_url,
      category: product.category,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = (product_id: string) => {
    setProducts(
      products.filter((product) => product.product_id !== product_id)
    );
  };

  const handleSaveProduct = () => {
    if (editingProduct) {
      // Update existing product
      setProducts(
        products.map((product) =>
          product.product_id === editingProduct.product_id
            ? {
                ...editingProduct,
                ...formData,
                price: parseFloat(formData.price),
              }
            : product
        )
      );
    } else {
      // Add new product
      const newProduct: Product = {
        product_id: (products.length + 1).toString(),
        ...formData,
        price: parseFloat(formData.price),
        product_type: "Agriculture", // Default product type for now
      };
      setProducts([...products, newProduct]);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <AdminSidebar />
      <section className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Product Management</h1>

        <div className="mb-4">
          <Button onClick={handleAddProduct}>Add Product</Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.product_id}>
                <TableCell>{product.product_id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>₱{product.price.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handleEditProduct(product)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteProduct(product.product_id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : "Add Product"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                name="name"
                placeholder="Product Name"
                value={formData.name}
                onChange={handleInputChange}
              />
              <Input
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
              />
              <Input
                name="price"
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={handleInputChange}
              />
              <Input
                name="image_url"
                placeholder="Image URL"
                value={formData.image_url}
                onChange={handleInputChange}
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProduct}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </section>
    </div>
  );
}
