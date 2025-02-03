'use client';
import { lazy } from 'react';
import { useRouter } from 'next/navigation';
import { useProducts } from './context/ProductContext';
import { Product } from '../types/Product';
import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { useColorMode } from './components/ui/color-mode';
import Logo from './components/Logo';
import "./styles/globals.css";
import LazyLoadComponent from './components/LazyLoadComponent';
import ProductList from './components/ProductList';

const Carrousell = lazy(() => import('./components/Carrousell'));
const PromoCarousel = lazy(() => import('./components/PromoCarrousell'));
const CategoryGrid = lazy(() => import('./components/CategoryCard'));

export default function Home() {
  const router = useRouter();
  const { products, isLoading, error } = useProducts();
  const { colorMode } = useColorMode();

  const handleSelectProduct = (product: Product) => {
    router.push(`/products/${product.id}`);
  };

  if (isLoading) return (
    <Box bg={colorMode === 'dark' ? 'gray.800' : 'bg.muted'} w={"100%"} h={"1000px"} display={"flex"} justifyContent={"center"} alignItems={"center"} >
      <Spinner size="xl" color={colorMode === 'dark' ? 'gray.300' : 'bg.800'} />
    </Box>
  );

  if (error) return (
    <Box bg={colorMode === 'dark' ? 'gray.800' : 'bg.muted'} w={"100%"} h={"1000px"} display={"flex"} justifyContent={"center"} alignItems={"center"} >
      <Text color={colorMode === 'dark' ? 'gray.300' : 'gray.700'}>Hubo un error al cargar los productos. Por favor, intenta nuevamente más tarde.</Text>
    </Box>
  );


  return (
    <Box bg={colorMode === 'dark' ? 'gray.800' : 'bg.muted'} w={"100%"} as={"main"}>
      <Logo />

      <LazyLoadComponent>
        <PromoCarousel text1='Envíos disponibles para toda Argentina' text2='Envíos gratis a partir de $120.000' />
        <Carrousell />
        <PromoCarousel text1="Suscribite a nuestro newsletter y obtené un 10% de descuento en tu primera compra." text2='Envíos gratis dentro de Mar Del Plata' />
      </LazyLoadComponent >

      <LazyLoadComponent>
        <Flex direction="column" gap={20} p={2} py={{ base: 20, md: "" }} textAlign={"center"} align={"center"}>
          <Text fontFamily={"Archivo Black"} w={{ base: "100%", md: "80%" }} as="h2" fontSize={{ base: "4xl", md: "4vw" }} letterSpacing={"tighter"} lineHeight={{ base: 1.2, md: "11vh" }} color={colorMode === 'dark' ? '#d0d0d0' : 'gray.700'}>
            Ya disponible nuestra primer cápsula.
          </Text>
        </Flex>
      </LazyLoadComponent>

      <LazyLoadComponent>
        <CategoryGrid />
      </LazyLoadComponent>

      <Flex direction="column" p={2} align={"center"}>
        <LazyLoadComponent>
          <Text fontFamily={"Archivo Black"} as="h3" fontSize={{ base: "4xl", md: "4vw" }} letterSpacing={"tighter"} color={colorMode === 'dark' ? '#d0d0d0' : 'gray.700'}>
            Nuevos productos.
          </Text>
        </LazyLoadComponent>
        <ProductList products={products} onSelectProduct={handleSelectProduct} />
      </Flex>

    </Box >
  );
}
