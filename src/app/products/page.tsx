'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '../../types/Product';
import ProductList from '../components/ProductList';
import { useProducts } from '../context/ProductContext';

const Products = () => {
  const router = useRouter();
  const { products, isLoading, error } = useProducts();
  const [filteredProducts] = useState(products);

  const handleSelectProduct = (product: Product) => {
    router.push(`/product/${product.id}`);
  };



  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;


  return (
    <div>
      <ProductList products={filteredProducts} onSelectProduct={handleSelectProduct} />
    </div>
  );
};

export default Products;
