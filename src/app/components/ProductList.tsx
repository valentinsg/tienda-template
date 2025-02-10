import React from 'react';
import { Flex, Grid, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ProductContainer } from './ProductContainer';
import LazyLoadComponent from './LazyLoadComponent';
import type { Product } from '../../types/Product';

const MotionGrid = motion(Grid);

interface ProductListProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  onSelectProduct,
}) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (!products?.length) {
    return (
      <Flex
        justifyContent="center"
        alignItems="center"
        width="full"
        py={10}
      >
        <Text fontSize="xl" color="gray.500">
          No hay productos disponibles.
        </Text>
      </Flex>
    );
  }

  return (
    <Flex px={{base: 0, md:20} }py={20} justifyContent="center">
      <MotionGrid
        variants={container}
        initial="hidden"
        animate="show"
        templateColumns={{
          base: 'repeat(2, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(3, 1fr)',
          xl: 'repeat(3, 1fr)',
        }}
        gap={{ base: 4, sm: 6, md: 8, lg: 14 }}
      >
        {products.map((product) => (
          <LazyLoadComponent key={product.id}>
            <ProductContainer
              product={product}
              onSelectProduct={onSelectProduct}
            />
          </LazyLoadComponent>
        ))}
      </MotionGrid>
    </Flex>
  );
};

export default ProductList;
