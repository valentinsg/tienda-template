'use client';
import { useRouter } from 'next/navigation';
import ProductList from './components/ProductList';
import { useProducts } from './context/ProductContext';
import { Product } from '../types/Product';
import { Box, Flex, Heading, Text, Button, Link } from '@chakra-ui/react';
import Carrousell from './components/Carrousell';
import { useColorMode } from './components/ui/color-mode';
import Logo from './components/Logo';
import "./styles/globals.css";
import FrontRemerasBlack from "../../public/portada-remeras-black.png";
import FrontHoodieBlack from "../../public/portada-hoodies-black.png";
import FrontHoodieLight from "../../public/portada-hoodies-light.png";
import FrontRemerasLight from "../../public/portada-remeras-light.png";
import CategoryGrid from './components/CategoryCard';

export default function Home() {
  const router = useRouter();
  const { products, isLoading, error } = useProducts();
  const { colorMode } = useColorMode();

  const handleSelectProduct = (product: Product) => {
    router.push(`/product/${product.id}`);
  };
  const handleCategoryClick = (category: string) => {
    router.push(`/products/${category}`);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <Box bg={colorMode === 'dark' ? 'gray.800' : 'bg.muted'} w={"100%"} >
      <Logo />
      <Carrousell />
      {/* Listado completo de productos */}
      <Flex direction="column" gap={20} p={20}>
        <Heading fontFamily={"Archivo Black"} w={"80%"} as="h2" fontSize="4.5vw" letterSpacing={"tighter"} lineHeight={"11vh"} color={colorMode === 'dark' ? '#d0d0d0' : 'gray.700'}>
          Nuestra primer cápsula ya está disponible para toda Argentina.
        </Heading>
      </Flex>
      <CategoryGrid />
      <ProductList products={products} onSelectProduct={handleSelectProduct} />

    </Box >

  );
}
