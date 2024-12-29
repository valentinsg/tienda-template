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
        <Heading fontFamily={"Archivo Black"} w={"75%"} as="h2" fontSize="4.5vw" letterSpacing={"tighter"} lineHeight={"11vh"} color={colorMode === 'dark' ? 'white' : 'gray.800'}>
          Nuestra primer cápsula ya está disponible.
        </Heading>
        <ProductList products={products} onSelectProduct={handleSelectProduct} />
      </Flex>
      <Flex justify="space-around" wrap="wrap" h={"90vh"} p={10}>
        {/* Card Hoodies */}
        <Box
          bgImage={}
          bgSize="cover"
          borderRadius="lg"
          p={6}
          w="30%"
          textAlign="center"
          shadow="md"
          onClick={() => handleCategoryClick('hoodies')}
        >
          <Flex textAlign={"left"} flexDir={"column"} w="50%">
            <Heading fontSize="xl" mb={4}>
              Hoodies
            </Heading>
            <Button
              colorScheme="teal"
            >
              Ver Hoodies
            </Button>
          </Flex>
        </Box>

        {/* Card Remeras */}
        <Box
          bg={colorMode === 'dark' ? 'gray.700' : 'gray.100'}
          borderRadius="lg"
          p={6}
          w="30%"
          textAlign="center"
          shadow="md"
          onClick={() => handleCategoryClick('remeras')}

        >
          <Flex textAlign={"left"} flexDir={"column"} w="50%">
            <Heading fontSize="4.5vw" mb={4}>
              Remeras
            </Heading>
            <Button
              colorScheme="teal"
            >
              Ver Remeras
            </Button>
          </Flex>
        </Box>

        {/* Card Todos los productos */}
        <Box
          bg={colorMode === 'dark' ? 'gray.700' : 'gray.100'}
          borderRadius="lg"
          p={6}
          w="30%"
          textAlign="center"
          shadow="md"
          onClick={() => router.push('/products')}
        >
          <Flex textAlign={"left"} flexDir={"column"} w="50%">
            <Heading fontSize="xl" mb={4}>
              Todos los productos
            </Heading>

            <Button colorScheme="teal" >
              Ver Todos
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Box>

  );
}
