'use client';
import React, { createContext, useContext, ReactNode } from 'react';
import { Product } from '../../types/Product';
import { Category } from '../../types/Category';
import {useProducts} from '../hooks/useProducts';

interface ProductContextProps {
  categories: Category[];
  products: Product[];
  isLoading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextProps | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { products, categories, isLoading, error, refreshProducts } = useProducts();

  return (
    <ProductContext.Provider value={{ products, categories, isLoading, error, refreshProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = (): ProductContextProps => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};
