'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '../../types/Product';

//#region Interfaces

// Define the shape of the context state
interface ProductContextType {
  products: Product[];
  featuredProducts: Product[];
  productsByCategory: Record<string, Product[]>;
  isLoading: boolean;
  error: Error | null;
}

//#endregion

//#region Context

// Create the ProductContext with an undefined initial value
const ProductContext = createContext<ProductContextType | undefined>(undefined);

//#endregion

//#region Provider

// Define the ProductProvider component
export function ProductProvider({ children }: { children: React.ReactNode }) {
  
  // State to hold the list of products
  const [products, setProducts] = useState<Product[]>([]);
  
  // State to indicate loading status
  const [isLoading, setIsLoading] = useState(true);
  
  // State to hold any error that occurs during fetching
  const [error, setError] = useState<Error | null>(null);

  // Fetch products from the API when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/products');
        if (!response.ok) throw new Error('Error fetching products');

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError(error as Error);
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  //#region Derived State

  // Filter the products to get the featured ones
  const featuredProducts = products.filter(product => product.featured);

  // Group the products by category
  const productsByCategory = products.reduce((acc, product) => {
    const category = typeof product.category === 'string' ? product.category.toLowerCase() : 'uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  //#endregion

  // Provide the context value to children components
  return (
    <ProductContext.Provider
      value={{
        products,
        featuredProducts,
        productsByCategory,
        isLoading,
        error
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

//#endregion

//#region Hook

// Custom hook to use the ProductContext
export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}

//#endregion