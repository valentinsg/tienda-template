import { ProductImage } from "./ProductImage";

export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  description: string;
  price: number;
  category: number;
  meta_title?: string;
  meta_description?: string;
  images: ProductImage[];
  stock: {
    [size: string]: {
      stock: number;
      sku: string;
    };
  };
}
