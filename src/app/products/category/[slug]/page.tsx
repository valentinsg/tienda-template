'use client';
import React, { useEffect, useState } from 'react';
import { useProducts } from '../../../hooks/useProducts';
import ProductList from '../../../components/ProductList';
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
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  if (isLoading) return (
    <Box bg={colorMode === 'dark' ? 'gray.800' : 'bg.muted'} w={"100%"} h={"1000px"} display={"flex"} justifyContent={"center"} alignItems={"center"} >
      <Spinner size="xl" color={colorMode === 'dark' ? 'gray.300' : 'bg.800'} />
    </Box>
  );

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

  const handleSelectProduct = (product: Product) => {
    router.push(`/products/${product.id}`);
  };

  return (
    <Box bg={colorMode === 'dark' ? 'gray.800' : 'bg.muted'} color={textColor} as={"section"}>
      <Box
        textAlign={"center"}
        background={`
          linear-gradient(to bottom, 
            transparent, 
            rgba(128, 128, 128, 0.08) 25%, 
            rgba(128, 128, 128, 0.12) 50%, 
            rgba(128, 128, 128, 0.06) 75%),
          radial-gradient(
            circle at bottom right, 
            ${colorMode === 'dark'
            ? 'rgba(100, 100, 100, 0.1)'
            : 'rgba(180, 180, 180, 0.07)'} 0%, 
            transparent 60%
          )
        `}
        py={12}
      >
        <Heading as="h1" mb={10} textAlign="center" fontFamily={"Archivo Black"} fontSize={{ base: "4xl", md: "4vw" }} letterSpacing={"tighter"} lineHeight={{ base: 1.2, md: "11vh" }} color={textColor}>
          {category.name}
        </Heading>
        <ProductList
          products={filteredProducts}
          onSelectProduct={handleSelectProduct}
        />
      </Box>
    </Box>
  );
}