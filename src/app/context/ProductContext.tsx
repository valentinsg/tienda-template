'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '../../types/Product';
import { Category } from '../../types/Category';
import { supabase } from '../supabase';

interface ProductContextProps {
  categories: Category[];
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

const ProductContext = createContext<ProductContextProps>({
  categories: [],
  products: [],
  isLoading: false,
  error: null,
});

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data: categoryData, error } = await supabase
          .from('categories')
          .select('*');
        if (error) throw error;
        setCategories(categoryData || []);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    const fetchProductsWithDetails = async () => {
      try {
        // Fetch sizes to create a proper size map
        const { data: sizesData, error: sizesError } = await supabase
          .from('sizes')
          .select('*');
        if (sizesError) throw sizesError;

        // Create size map from database
        const sizeMap = sizesData.reduce((acc, size) => {
          acc[size.id] = size.name;
          return acc;
        }, {} as Record<string, string>);

        // Fetch products with their category and images
        const { data: productsData, error: productError } = await supabase
          .from('products')
          .select(`
            *,
            categories!inner(*),
            product_images(*)
          `);
        if (productError) throw productError;

        // Fetch stock information
        const { data: stockData, error: stockError } = await supabase
          .from('stock')
          .select('*');
        if (stockError) throw stockError;

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

        setProducts(processedProducts);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
    fetchProductsWithDetails();
    
  }, []);

  return (
    <ProductContext.Provider value={{ products, categories, isLoading, error }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = (): ProductContextProps => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};