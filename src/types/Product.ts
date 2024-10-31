export interface Product {
  id: number;
  name: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  price: string;
  color: string;
  sizes: string[];
  stock: number;
  description: string;
  category: string;
  colors: string[];
  additionalImages?: string[];
}
