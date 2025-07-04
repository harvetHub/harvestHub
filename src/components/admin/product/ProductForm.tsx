import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { categories } from "@/lib/productsConfig";
import { Product } from "@/lib/definitions";
import { useState } from "react";

interface ProductFormProps {
  formData: Product;
  errors: Partial<Record<keyof Product, string>>;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onImageUpload: (file: File) => void;
  onSave: () => void;
  onCancel: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  formData,
  errors,
  onChange,
  onImageUpload,
  onSave,
  onCancel,
  isOpen,
  onClose,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(
    typeof formData.image_url === "string" ? formData.image_url : null
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Generate a preview URL for the new image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Pass the file to the parent component
      onImageUpload(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {formData.product_id ? "Edit Product" : "Add Product"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Product Name */}
          <div>
            <Input
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={onChange}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <Input
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={onChange}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <Input
              name="price"
              type="number"
              placeholder="Price in Peso"
              value={formData.price}
              onChange={onChange}
            />
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Image
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {imagePreview && (
              <div className="mt-4">
                <Image
                  src={imagePreview}
                  width={100}
                  height={100}
                  alt="Uploaded"
                  className="w-32 h-32 object-cover rounded-md"
                />
              </div>
            )}
            {errors.image_url && (
              <p className="text-red-500 text-sm">{errors.image_url}</p>
            )}
          </div>

          {/* Product Type Dropdown */}
          <select
            name="product_type"
            value={formData.product_type || ""}
            onChange={onChange}
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option disabled value="">
              Select the product type
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.value}>
                {category.name}
              </option>
            ))}
          </select>

          {/* SKU */}
          <div>
            <Input
              name="sku"
              placeholder="Product_SKU (e.g., PROD-001)"
              value={formData.sku}
              onChange={onChange}
            />
            {errors.sku && <p className="text-red-500 text-sm">{errors.sku}</p>}
          </div>

          {/* Actions */}
          <div className="mt-4 flex justify-end space-x-2">
            <Button
              className="cursor-pointer"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button className="cursor-pointer" onClick={onSave}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductForm;
