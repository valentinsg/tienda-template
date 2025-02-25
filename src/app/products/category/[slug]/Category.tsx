// app/category/[slug]/CategoryPage.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useProducts } from '../../../hooks/useProducts';
import {ProductList} from '../../../components/ProductList';
import { useRouter } from 'next/navigation';
import { Flex, Spinner, Text, Box } from '@chakra-ui/react';
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
    if (products.length > 0 && slug) {
      // Find the category that matches the slug
      const category = categories.find(cat => cat.slug === slug);

      if (category) {
        // Filter products that belong to this category
        const productsInCategory = products.filter(product => {
          // Check if product.category matches either the category id or slug
          return (
            product.category.id === category.id ||
            product.category.slug === category.slug
          );
        });
        setFilteredProducts(productsInCategory);
      } else {
        // If category not found, set empty array
        setFilteredProducts([]);
      }
    }
  }, [products, slug, categories]);

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

  if (filteredProducts.length === 0) {
    return (
      <Box bgGradient={
        colorMode === 'dark'
          ? 'linear(to-b, gray.900, gray.800, gray.700)'
          : 'linear(to-b, #f5f5f5, #e0e0e0, #d6d6d6)'
      } py={12} color={textColor} as="section">
        <Text mb={10} textAlign="center" fontFamily="Archivo Black" fontSize={{ base: "4xl", md: "4vw" }} letterSpacing="tighter" lineHeight={{ base: 1.2, md: "11vh" }} color={textColor}>
          {category.name}
        </Text>
        <Flex justify="center" align="center" minH="40vh">
          <Text>No hay productos disponibles en esta categoría</Text>
        </Flex>
      </Box>
    );
  }

  const handleSelectProduct = (product: Product) => {
    router.push(`/products/${product.id}`);
  };

  return (
    <Box bg={colorMode === 'dark' ? 'gray.800' : 'bg.muted'} py={12} color={textColor} as="section">
      <Text as="h1" mb={{ base: 0, md: 10 }} textAlign="center" fontFamily="Archivo Black" fontSize={{ base: "4xl", md: "4vw" }} letterSpacing="tighter" lineHeight={{ base: 1.2, md: "11vh" }} color={textColor}>
        {category.name}
      </Text>
      <ProductList
        products={filteredProducts}
        onSelectProduct={handleSelectProduct}
      />
    </Box>
  );
}