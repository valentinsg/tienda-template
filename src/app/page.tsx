'use client';
import { useRouter } from 'next/navigation';
import ProductList from './components/ProductList';
import { useProducts } from './context/ProductContext';
import { Product } from '../types/Product';
import { Box, Flex } from '@chakra-ui/react';
import Carrousell from './components/Carrousell';
import { useColorModeValue } from './components/ui/color-mode';
import Logo from './components/Logo';
import "./styles/globals.css";

export default function Home() {
  const router = useRouter();
  const { products, productImages, isLoading, error } = useProducts();
  const bgColor = useColorModeValue("gray.50", 'bg.muted');

  const handleSelectProduct = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  if (isLoading) return <div>Loading.v..</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <Box>
      <Box bg={bgColor}>
        <Logo />
        <Carrousell />
        {/* Listado completo de productos */}
        <Flex mt={12}>
          <ProductList products={products} productImages={productImages} onSelectProduct={handleSelectProduct} />
        </Flex>
      </Box>

    </Box>
  );
}
