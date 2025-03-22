export type Product = {
  product_id?: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  product_type: string;
  rating?: number;
  sku?: string;
  stock_quantity?: number;
  created_at?: string;
  updated_at?: string;
};

export type User = {
  user_id?: number;
  name?: { first: ""; middle: ""; last: "" };
  username: string;
  email: string;
  address?: string;
  mobile_number?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
};
