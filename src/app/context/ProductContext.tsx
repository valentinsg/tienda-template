// context/ProductContext.tsx
'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '../../types/Product';
import { Category } from '../../types/Category';
import { productService } from '../services/productService';

interface ProductContextProps {
  categories: Category[];
  products: Product[];
  isLoading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
  getProduct: (id: string) => Promise<Product | null>;
}

const ProductContext = createContext<ProductContextProps>({
  categories: [],
  products: [],
  isLoading: false,
  error: null,
  refreshProducts: async () => {},
  getProduct: async () => null
});

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    const { products: newProducts, categories: newCategories, error: newError } = 
      await productService.getProductsWithDetails();
    
    setProducts(newProducts);
    setCategories(newCategories);
    setError(newError);
    setIsLoading(false);
  };

  const getProduct = async (id: string) => {
    return productService.getProductById(id);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ProductContext.Provider 
      value={{ 
        products, 
        categories, 
        isLoading, 
        error,
        refreshProducts: fetchData,
        getProduct
      }}
    >
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