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
  image_url?: string;
};
