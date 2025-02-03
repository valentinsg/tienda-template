import { StockUpdate } from '@/types/StockUpdate';
import { supabase } from '../supabase';

export const useStock = () => {
  const updateStock = async (items: StockUpdate[]) => {
    const updates = items.map(async (item) => {
      const { data: currentProduct } = await supabase
        .from('products')
        .select('stock')
        .eq('id', item.id)
        .single();

      if (!currentProduct?.stock?.[item.size]?.stock) {
        throw new Error(`No stock available for product ${item.id} size ${item.size}`);
      }

      const currentStock = currentProduct.stock[item.size].stock;
      if (currentStock < item.quantity) {
        throw new Error(`Insufficient stock for product ${item.id} size ${item.size}`);
      }

      const newStock = {
        ...currentProduct.stock,
        [item.size]: {
          ...currentProduct.stock[item.size],
          stock: currentStock - item.quantity
        }
      };

      return supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', item.id);
    });

    return Promise.all(updates);
  };

  return { updateStock };
};