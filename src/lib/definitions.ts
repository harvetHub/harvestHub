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

export type Region = {
  region_id: string;
  region_name: string;
};

export type Province = {
  province_id: string;
  region_id: string;
  province_name: string;
};

export type Municipality = {
  municipality_id: string;
  province_id: string;
  municipality_name: string;
};

export type Barangay = {
  barangay_id: string;
  municipality_id: string;
  barangay_name: string;
};

export type Address = {
  id: number;
  name: string;
  phone: string;
  address: {
    region: Region;
    province: Province;
    cityMunicipality: Municipality;
    barangay: Barangay;
  };
  postal: string;
  street: string;
  label: string;
  isDefault: boolean;
  isPickup: boolean;
  isReturn: boolean;
};

export type User = {
  user_id?: string;
  name?: Nametype;
  username: string;
  email: string;
  address?: Address | string;
  mobile_number?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
  password?: string;
  password_confirmation?: string;
  image_url?: string | File;
  gender?: string ;
  birthDay?: string | null ;
};

export type Order = {
  order_id: number;
  customer_name: string;
  order_date: string;
  total_amount: number;
  status: string;
  shipping_method: string | null;
  payment_status: string;
}


export type CartItem = {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

