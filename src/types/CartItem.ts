export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  sku?: string;
  productCode?: string;
  image?: string;
}