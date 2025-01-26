'use client';
import React from 'react';
import { useProducts } from '../../../context/ProductContext';
import { ProductList } from '../../../components/ProductList';
import { useRouter } from 'next/navigation';
import { Flex, Spinner, Text } from '@chakra-ui/react';
import { Product } from '@/types/Product';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = React.use(params);
  const { slug } = resolvedParams;
  const { products, categories, isLoading, error } = useProducts();
  const router = useRouter();

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
    <div>
      <Text
        fontSize="2xl"
        fontWeight="bold"
        textAlign="center"
        mt={8}
        mb={4}
      >
        {category.name}
      </Text>
      <ProductList 
        products={filteredProducts}
        onSelectProduct={handleSelectProduct}
      />
    </div>
  );
}