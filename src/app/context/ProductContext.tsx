'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '../../types/Product';
import { Category } from '../../types/Category';
import { supabase } from '../supabase';
import { ProductImage } from '../../types/ProductImage';

interface ProductContextProps {
  categories: Category[];
  products: Product[];
  productImages: ProductImage[];
  featuredProducts: Product[];
  isLoading: boolean;
  error: string | null;
}

const ProductContext = createContext<ProductContextProps | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const { data: categoryData, error } = await supabase.from('categories').select('*');
        if (error) console.error(error);

        if (categoryData) {
          setCategories(categoryData);
        } else {
          setCategories([]);
        }
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    }

    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const { data: productsData, error } = await supabase.from('products').select('*');
        if (error) console.error(error);

        if (productsData) {
          setProducts(productsData);
        } else {
          setProducts([]);
        }
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    }
    
    const fetchProductImages = async () => {
      setIsLoading(true);
      try {
        const { data: productImageData, error } = await supabase.from('product_images').select('*');
        if (error) console.error(error);

        if (productImageData) {
          setProductImages(productImageData);
        } else {
          setProductImages([]);
        }
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProductImages()
    fetchCategories();
    fetchProducts();
  }, []);


  const featuredProducts = products.filter(product => product.featured);

  return (
    <ProductContext.Provider value={{ products, categories, productImages, featuredProducts, isLoading, error }}>
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
