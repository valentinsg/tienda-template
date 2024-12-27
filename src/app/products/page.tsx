'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '../../types/Product';
import ProductList from '../components/ProductList';
import { useProducts } from '../context/ProductContext';
import { Box } from '@chakra-ui/react';

const Products = () => {
  const router = useRouter();
  const { products, isLoading, error, productImages } = useProducts();
  const [filteredProducts] = useState(products);

  const handleSelectProduct = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;


  return (
    <Box minH={"100vh"} p={6}>
      <ProductList products={filteredProducts} onSelectProduct={handleSelectProduct} productImages={productImages}  />
    </Box>
  );
};

export default Products;
