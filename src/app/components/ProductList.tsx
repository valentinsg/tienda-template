import React from 'react';
import { Box, Grid, Heading, Text, VStack, Image, Stack } from '@chakra-ui/react';
import { Product } from '../../types/Product';

interface ProductListProps {
  products: Product[]; 
  onSelectProduct: (product: Product) => void;
}

export default function ProductList({ products, onSelectProduct }: ProductListProps) {
  const handleProductClick = (product: Product) => {
    onSelectProduct(product);
  };

  if (!products || products.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Text fontSize="lg" color="gray.500">
          No hay productos disponibles.
        </Text>
      </Box>
    );
  }

  return (
    <Box maxW="7xl" mx="auto" px={4} py={10}>
      <Heading as="h2" size="lg" textAlign="center" mb={8}>
        Productos
      </Heading>
      <Grid
        templateColumns={{
          base: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
        }}
        gap={6}
      >
        {products.map((product) => (
          <VStack
            key={product.id}
            gap={4}
            p={4}
            bg="white"
            shadow="md"
            borderRadius="lg"
            _hover={{
              shadow: 'lg',
              transform: 'scale(1.05)',
            }}
            transition="all 0.3s"
            onClick={() => handleProductClick(product)}
            cursor="pointer"
          >
            <Box
              w="full"
              h="200px"
              overflow="hidden"
              borderRadius="lg"
              bg="gray.100"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {product.images && product.images.length > 0 ? ( // Validación de imágenes
                <Image
                  src={product.images[0].image_url}
                  alt={product.name}
                  objectFit="cover"
                  h="full"
                  w="full"
                />
              ) : (
                <Text fontSize="sm" color="gray.500">
                  Imagen no disponible
                </Text>
              )}
            </Box>
            <Stack gap={1} textAlign="center" w="full">
              <Text fontWeight="semibold" fontSize="md" color="gray.700">
                {product.name}
              </Text>
              <Text fontSize="lg" color="gray.900" fontWeight="bold">
                ${product.price}
              </Text>
            </Stack>
          </VStack>
        ))}
      </Grid>
    </Box>
  );
}
