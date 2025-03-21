"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Swal from "sweetalert2";
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
import { Product } from "@/lib/definitions";
import AdminSidebar from "@/components/AdminSidebar";

const mockProducts: Product[] = [
  {
    product_id: "1",
    name: "Product A",
    description: "Description for Product A",
    price: 100,
    image_url: "/placeholder.png",
    product_type: "seeds",
    rating: 4.5,
  },
  {
    product_id: "2",
    name: "Product B",
    description: "Description for Product B",
    price: 200,
    image_url: "/placeholder.png",
    product_type: "fertilizers",
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
    price: "",
    image_url: "",
    product_type: categories[0].value,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
      price: "",
      image_url: "",
      product_type: categories[0].value,
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
      product_type: product.product_type,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = (product_id: string) => {
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
          (product) => product.product_id !== product_id
        );
        setProducts(updatedProducts);
        setFilteredProducts(
          updatedProducts.filter((product) =>
            selectedFilter === "All"
              ? true
              : product.product_type === selectedFilter
          )
        );
        Swal.fire("Deleted!", "The product has been deleted.", "success");
      }
    });
  };

  const handleSaveProduct = () => {
    // Form validation
    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.product_type
    ) {
      Swal.fire("Error", "Please fill in all required fields.", "error");
      return;
    }

    if (editingProduct) {
      // Update existing product
      const updatedProducts = products.map((product) =>
        product.product_id === editingProduct.product_id
          ? {
              ...editingProduct,
              ...formData,
              price: parseFloat(formData.price),
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
        price: parseFloat(formData.price),
      };
      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      Swal.fire("Success", "Product added successfully.", "success");
    }

    setIsDialogOpen(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(term)
    );
    setFilteredProducts(
      selectedFilter === "All"
        ? filtered
        : filtered.filter((product) => product.product_type === selectedFilter)
    );
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const filter = e.target.value;
    setSelectedFilter(filter);
    setFilteredProducts(
      filter === "All"
        ? products.filter((product) =>
            product.name.toLowerCase().includes(searchTerm)
          )
        : products.filter(
            (product) =>
              product.product_type === filter &&
              product.name.toLowerCase().includes(searchTerm)
          )
    );
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <section className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Product Management</h1>

        <div className="flex items-center space-x-4 mb-4">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <select
            value={selectedFilter}
            onChange={handleFilterChange}
            className="block w-1/3 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All">All</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.name}
              </option>
            ))}
          </select>
          <Button onClick={handleAddProduct}>Add Product</Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.product_id}>
                <TableCell>{product.product_id}</TableCell>
                <TableCell>
                  <Image
                    src={product.image_url || "/placeholder.png"}
                    alt={product.name}
                    width={50}
                    height={50}
                    className="rounded-md"
                  />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>
                  {
                    categories.find((cat) => cat.value === product.product_type)
                      ?.name
                  }
                </TableCell>
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
                placeholder="Price in Peso"
                value={formData.price}
                onChange={handleInputChange}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {formData.image_url && (
                  <Image
                    src={formData.image_url}
                    width={100}
                    height={100}
                    alt="Uploaded"
                    className="mt-4 w-32 h-32 object-cover rounded-md"
                  />
                )}
              </div>
              <select
                name="product_type"
                value={formData.product_type}
                onChange={handleInputChange}
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.name}
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
