import { Product } from "@/lib/definitions";

export const validateProduct = (
  formData: Product,
  products: Product[],
  editingProduct: Product | null
) => {
  const errors: { [key: string]: string } = {};

  // Validate product name
  if (!formData.name) errors.name = "Product name is required.";

  // Validate description
  if (!formData.description) errors.description = "Description is required.";

  // Validate price
  if (
    !formData.price ||
    isNaN(Number(formData.price)) ||
    Number(formData.price) <= 0
  ) {
    errors.price = "Price must be a positive number.";
  }

  // Validate product type
  if (!formData.product_type || formData.product_type === "") {
    errors.product_type = "Product type is required.";
  }
  // Validate SKU
  if (!formData.sku) {
    errors.sku = "SKU is required.";
  } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.sku)) {
    errors.sku = "SKU must be alphanumeric (no special characters).";
  } else if (
    products.some(
      (product) =>
        product.sku === formData.sku &&
        product.product_id !== editingProduct?.product_id
    )
  ) {
    errors.sku = "SKU must be unique.";
  }

  // Validate image
  if (!formData.image_url) {
    errors.image_url = "Product image is required.";
  }

  return errors;
};
