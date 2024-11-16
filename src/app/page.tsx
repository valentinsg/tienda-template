'use client';
import { useRouter } from 'next/navigation';
import ProductList from './components/ProductList';
import { useProducts } from './context/ProductContext';
import { Product } from '../types/Product';
import { Box, Flex } from '@chakra-ui/react';
import Home from './components/Home';
import { useColorModeValue } from './components/ui/color-mode';
import Logo from './components/Logo';


export default function HomePage() {
  const router = useRouter();
  const { products, isLoading, error } = useProducts();
  const bgColor = useColorModeValue("gray.50", 'bg.muted');

  const handleSelectProduct = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <Box bg={bgColor}>
      <Logo />
      <Home />
      {/* Listado completo de productos */}
      <Flex my={12}>
        <ProductList products={products} onSelectProduct={handleSelectProduct} />
      </Flex>
    </Box>
  );
}
