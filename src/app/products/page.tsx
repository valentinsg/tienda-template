'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '../../types/Product';
import {ProductList} from '../components/ProductList';
import { useProducts } from '../context/ProductContext';
import { Box, Heading,} from '@chakra-ui/react';
import { useColorMode, useColorModeValue } from '../components/ui/color-mode';

const Products = () => {
  const router = useRouter();
  const { products, isLoading, error } = useProducts();
  const textColor = useColorModeValue('#555454', '#D0D0D0');
  const { colorMode } = useColorMode();
  const [filteredProducts] = useState(products);

  const handleSelectProduct = (product: Product) => {
    router.push(`/products/${product.id}`);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;


  return (
    <Box bg={colorMode === 'dark' ? 'gray.800' : 'bg.muted'} py={12}  color={textColor}>
      {/* Primera sección */}
      <Heading as="h1" mb={10} textAlign="center" fontFamily={"Archivo Black"} fontSize={{ base: "4xl", md: "4vw" }} letterSpacing={"tighter"} lineHeight={{ base: 1.2, md: "11vh" }} color={textColor}>
        Nuestros productos.
      </Heading>
      <ProductList products={filteredProducts} onSelectProduct={handleSelectProduct}  />
    </Box>
  );
};

export default Products;
