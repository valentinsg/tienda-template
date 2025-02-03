import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { AndreaniBranch } from '@/types/checkout/shipping/AndreaniBranch';
import { HomeShippingDetails } from '@/types/checkout/shipping/HomeShipping';

export interface OrderDetails {
  id: string;
  status: string;
  tracking_code?: string;
  shipping_address: HomeShippingDetails | AndreaniBranch;
  cart_items: string[];
  payment_status?: string;
  customer_name: string;
  total_amount: number;
}

export const useOrderTracking = (orderId: string | null) => {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrderDetails() {
      if (!orderId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('payment_records')
          .select('*')
          .eq('id', orderId)
          .single();

        if (error) throw error;
        setOrderDetails(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar los detalles de la orden');
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrderDetails();
  }, [orderId]);

  return { orderDetails, isLoading, error };
};