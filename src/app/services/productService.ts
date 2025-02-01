// services/productService.ts
import { supabase } from '../supabase';
import { Product } from '../../types/Product';
import { Category } from '../../types/Category';

interface ProductResponse {
  products: Product[];
  categories: Category[];
  error: string | null;
}

export const productService = {
  async getSizes() {
    const { data: sizesData, error } = await supabase
      .from('sizes')
      .select('*');
      
    if (error) throw error;
    return sizesData;
  },

  async getCategories(): Promise<Category[]> {
    const { data: categoryData, error } = await supabase
      .from('categories')
      .select('*');
      
    if (error) throw error;
    return categoryData || [];
  },

  async getProductsWithDetails(): Promise<ProductResponse> {
    try {
      // Get sizes mapping
      const sizesData = await this.getSizes();
      const sizeMap = sizesData.reduce((acc, size) => {
        acc[size.id] = size.name;
        return acc;
      }, {} as Record<string, string>);

      // Get products with relations
      const { data: productsData, error: productError } = await supabase
        .from('products')
        .select(`
          *,
          categories!inner(*),
          product_images(*)
        `);

      if (productError) throw productError;

      // Get stock information
      const { data: stockData, error: stockError } = await supabase
        .from('stock')
        .select('*');

      if (stockError) throw stockError;

      // Process products with stock information
      const processedProducts = productsData.map(product => {
        const productStock = stockData
          .filter(stock => stock.product_id === product.id)
          .reduce((acc, stock) => {
            const sizeName = sizeMap[stock.size] ?? String(stock.size);
            acc[sizeName] = {
              stock: stock.quantity,
              sku: `${product.sku}-${sizeName}`
            };
            return acc;
          }, {} as Record<string, { stock: number, sku: string }>);

        return {
          ...product,
          category: product.category,
          images: product.product_images,
          stock: productStock
        };
      });

      // Get categories
      const categories = await this.getCategories();

      return {
        products: processedProducts,
        categories,
        error: null
      };
    } catch (err) {
      console.error('Error fetching products:', err);
      return {
        products: [],
        categories: [],
        error: (err as Error).message
      };
    }
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const sizesData = await this.getSizes();
      const sizeMap = sizesData.reduce((acc, size) => {
        acc[size.id] = size.name;
        return acc;
      }, {} as Record<string, string>);

      const { data: product, error: productError } = await supabase
        .from('products')
        .select(`
          *,
          categories!inner(*),
          product_images(*)
        `)
        .eq('id', id)
        .single();

      if (productError) throw productError;
      if (!product) return null;

      const { data: stockData, error: stockError } = await supabase
        .from('stock')
        .select('*')
        .eq('product_id', id);

      if (stockError) throw stockError;

      const productStock = stockData.reduce((acc, stock) => {
        const sizeName = sizeMap[stock.size] ?? String(stock.size);
        acc[sizeName] = {
          stock: stock.quantity,
          sku: `${product.sku}-${sizeName}`
        };
        return acc;
      }, {} as Record<string, { stock: number; sku: string; }>);

      return {
        ...product,
        category: product.categories,
        images: product.product_images,
        stock: productStock
      };
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }
};