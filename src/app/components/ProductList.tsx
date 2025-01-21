import React from 'react';
import { Box, Grid, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ProductContainer } from './ProductContainer';
import type { Product } from '../../types/Product';

const MotionGrid = motion(Grid);

interface ProductListProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  onSelectProduct,
}) => {

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (!products?.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ textAlign: 'center', padding: '20px 4px' }}
      >
        <Text
          fontSize="xl"
          color="gray.500"
          fontWeight="medium"
        >
          No hay productos disponibles.
        </Text>
      </motion.div>
    );
  }
  return (
    <Box maxW="8xl" mx="auto" py={16} >
      <MotionGrid
        variants={container}
        initial="hidden"
        animate="show"
        templateColumns={{
          base: 'repeat(2, 1fr)',  // Changed to show 2 items on mobile
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(3, 1fr)',
          xl: 'repeat(4, 1fr)',
        }}
        gap={{ base: 4, sm: 6, md: 8, lg: 10 }}  // Responsive gap
      >
        {products.map((product) => (
          <ProductContainer
            key={product.id}
            product={product}
            onSelect={onSelectProduct}
          />
        ))}
      </MotionGrid>
    </Box>
  );
};