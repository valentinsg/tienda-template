'use client';
import React from 'react';
import { useProducts } from '../../../context/ProductContext';
import { ProductList } from '../../../components/ProductList';
import { useRouter } from 'next/navigation';
import { Flex, Spinner, Text, Heading, Box } from '@chakra-ui/react';
import { Product } from '@/types/Product';
import { useColorMode, useColorModeValue } from '@/app/components/ui/color-mode';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = React.use(params);
  const { slug } = resolvedParams;
  const { products, categories, isLoading, error } = useProducts();
  const router = useRouter();
  const textColor = useColorModeValue('#555454', '#D0D0D0');
  const { colorMode } = useColorMode();
  
  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Text>Error al cargar los productos: {error}</Text>
      </Flex>
    );
  }

  const category = categories.find(cat => cat.slug === slug);
  
  if (!category) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Text>Categoría no encontrada</Text>
      </Flex>
    );
  }

  const filteredProducts = products.filter(product => 
    product.category === category.id
  );

  const handleSelectProduct = (product: Product) => {
    router.push(`/products/${product.id}`);
  };

  return (
    <Box bg={colorMode === 'dark' ? 'gray.800' : 'bg.muted'} py={12}  color={textColor}>
      <Heading as="h3" mb={10} textAlign="center" fontFamily={"Archivo Black"} fontSize={{ base: "4xl", md: "4vw" }} letterSpacing={"tighter"} lineHeight={{ base: 1.2, md: "11vh" }} color={textColor}>
        {category.name}
      </Heading>
      <ProductList 
        products={filteredProducts}
        onSelectProduct={handleSelectProduct}
      />
    </Box>
  );
}