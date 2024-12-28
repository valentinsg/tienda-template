'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '../../types/Product';
import { Category } from '../../types/Category';
import { supabase } from '../supabase';
import { ProductImage } from '../../types/ProductImage';

interface ProductWithImages extends Product {
  images: ProductImage[]; // Añadimos un campo para las imágenes
}

interface ProductContextProps {
  categories: Category[];
  products: ProductWithImages[];
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
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const { data: categoryData, error } = await supabase.from('categories').select('*');
        if (error) console.error(error);

        setCategories(categoryData || []);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchProductsAndImages = async () => {
      setIsLoading(true);
      try {
        // Fetch products
        const { data: productsData, error: productError } = await supabase.from('products').select('*');
        if (productError) console.error(productError);

        // Fetch product images
        const { data: productImageData, error: imageError } = await supabase.from('product_images').select('*');
        if (imageError) console.error(imageError);

        if (productsData && productImageData) {
          // Combine products with their images
          const combinedProducts = productsData.map(product => ({
            ...product,
            images: productImageData.filter(image => image.product_id === product.id), // Asociar imágenes
          }));
          setProducts(combinedProducts);
        } else {
          setProducts([]);
        }
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
    fetchProductsAndImages();
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
