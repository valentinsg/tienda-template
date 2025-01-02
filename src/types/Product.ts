import { ProductImage } from './ProductImage';

export interface Product {
  available_sizes: string[]; // Corresponde a "available_sizes" en la base de datos.
  id: number; // Corresponde a "id" en la base de datos.
  name: string; // Corresponde a "name".
  slug: string; // Corresponde a "slug".
  sku: string; // Corresponde a "sku".
  description: string; // Corresponde a "description".
  price: number; // Corresponde a "price".
  category: string; // Corresponde a "category".
  sizes: string[]; // Corresponde a "sizes" en la base de datos como un array de strings.
  stock: {
    [size: string]: {
      stock: number;
      sku: string;
    };
  }; // Corresponde al JSONB "stock".
  meta_title: string; // Corresponde a "meta_title".
  meta_description: string; // Corresponde a "meta_description".
  weight: number; // Corresponde a "weight".
  width: number; // Corresponde a "width".
  height: number; // Corresponde a "height".
  colors: string[]; // Corresponde a "colors".
  images: ProductImage[]; // Corresponde a "product_image".
}