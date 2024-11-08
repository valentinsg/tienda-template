export interface Product {
  id: number;
  images: {
    id: number;
    image_url: string;
    is_main: boolean;
    order: number;
    created_at: string;
  }[];
  created_at: string;
  updated_at: string;
  is_active: boolean;
  name: string;
  slug: string;
  sku: string;
  description: string;
  price: string;
  sale_price: string | null;
  sale_start: string | null;
  sale_end: string | null;
  featured: boolean;
  available_sizes: {
    [size: string]: {
      stock: number;
      sku: string;
    };
  };
  meta_title: string;
  meta_description: string;
  weight: number | null;
  dimensions: string | null;
  tags: string[];
  category: number;
}
