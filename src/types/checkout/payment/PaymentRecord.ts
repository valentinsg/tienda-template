
export interface PaymentRecord {
  id: string;
  transaction_id: string;
  status: string;
  total_amount: number;
  discount_applied: boolean;
  discount_code?: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_method: string;
  shipping_address: {
    address: string;
    city: string;
    province: string;
    postal_code: string;
    country: string;
  };
  tracking_code?: string;
  cart_items: {
    product_id: string;
    product_name: string;
    quantity: number;
    price: number;
  }[];
  payment_provider: string;
  notes?: string;
  customer_document?: string;
}