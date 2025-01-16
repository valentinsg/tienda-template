import React from 'react';
import { Box, Grid, Text } from '@chakra-ui/react';
import { ProductContainer } from './ProductContainer';
import type { Product } from '../../types/Product';

interface ProductListProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  onSelectProduct,
}) => {

  if (!products?.length) {
    return (
      <Box 
        textAlign="center" 
        py={20}
        px={4}
      >
        <Text 
          fontSize="xl" 
          color="gray.500"
          fontWeight="medium"
        >
          No hay productos disponibles.
        </Text>
      </Box>
    );
  }

  return (
    <Box maxW="8xl" mx="auto" px={6} py={20}>
      {/* Category Filter */}
      <Grid
        templateColumns={{
          base: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
          xl: 'repeat(4, 1fr)',
        }}
        gap={8}
      >
        {products.map((product) => (
          <ProductContainer
            key={product.id}
            product={product}
            onSelect={onSelectProduct}
          />
        ))}
      </Grid>
    </Box>
  );
};