export type Product = {
  product_id?: number;
  name: string;
  description: string;
  price: number;
  image_url: string | File;
  product_type: string;
  rating?: number;
  sku?: string;
  stocks?: number;
  reorder_level?: number;
  created_at?: string;
  updated_at?: string;
};

export type InventoryType = {
  id: number;
  name: string;
  category: string;
  stocks: number;
  price: number;
  image_url: string;
  sku: string;
};

export type Nametype = {
  first?: string;
  middle?: string;
  last?: string;
};

export type User = {
  user_id?: string;
  name?: Nametype;
  username: string;
  email: string;
  address?: string;
  mobile_number?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
  password?: string;
  password_confirmation?: string;
  image_url?: string | File;
};

export interface Order {
  order_id: number;
  customer_name: string;
  order_date: string;
  total_amount: number;
  status: string;
  shipping_method: string | null;
  payment_status: string;
}
