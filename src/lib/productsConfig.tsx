export interface Product {
  product_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  product_type: string;
}

export const categories = [
  "All",
  "Seeds",
  "Fertilizers",
  "Tools",
  "Pesticides",
  "Irrigation Equipment",
  "Animal Feed",
  "Machinery",
  "Greenhouse Supplies",
  "Soil Amendments",
  "Crop Protection",
];
