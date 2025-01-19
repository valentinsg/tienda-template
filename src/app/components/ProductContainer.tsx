import React, { useEffect, useState } from 'react';
import {
  VStack,
  Box,
  Text,
  HStack,
} from '@chakra-ui/react';
import { toaster } from './ui/toaster';
import { Tooltip } from './ui/tooltip';
import { useColorMode } from '../components/ui/color-mode';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../store/slices/cartSlice';
import type { Product } from '../../types/Product';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { RootState } from '../store/store';

// Wrap chakra components with motion
const MotionVStack = motion(VStack);
const MotionBox = motion(Box);

interface StockInfo {
  stock: number;
  sku: string;
}

interface ProductContainerProps {
  product: Product;
  onSelect: (product: Product) => void;
  categoryNames?: Record<string, string>;
}

export const ProductContainer: React.FC<ProductContainerProps> = ({
  product,
  onSelect,
  categoryNames = {},
}) => {
  const dispatch = useDispatch();
  const { colorMode } = useColorMode();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const handleAddToCart = (size: string) => {
    if (product.stock[size]?.stock > 0) {
      dispatch(
        addItem({
          id: `${product.id}-${size}`,
          name: product.name,
          price: product.price,
          size,
          sku: product.stock[size].sku,
          quantity: 1,
        })
      );
      
      // Show success toast
      toaster.create({
        title: "Producto añadido al BusyCarrito",
        description: `${product.name} (${size}) `,
        duration: 5000,
        meta: {
          closable: true,
        },
      });
    } else {
      toaster.create({
        title: "Out of Stock",
        description: `Sorry, ${product.name} is currently out of stock in size ${size}`,
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovering && product.images && product.images.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isHovering, product.images]);

  const handleProductClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('.size-selector')) {
      onSelect(product);
    }
  };

  const isDark = colorMode === 'dark';

  return (
    <MotionVStack
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9 }}
      position="relative"
      overflow="hidden"
      minW="400px"
      maxW="500px"
      w="full"
      gap={0}
    >
      <Box
        bg={isDark ? 'gray.800' : 'white'}
        borderRadius="xl"
        position="relative"
      >
        <Link href={`/category/${product.category}`} passHref>
          <Box
            as="a"
            position="absolute"
            top={4}
            right={4}
            bg={isDark ? 'blue.600' : 'blue.500'}
            color={isDark ? 'white' : 'white'}
            px={3}
            py={1}
            borderRadius="md"
            cursor="pointer"
            zIndex={2}
            _hover={{ transform: 'scale(1.05)' }}
          >
            {categoryNames[product.category] || product.category}
          </Box>
        </Link>

        <MotionBox
          position="relative"
          borderRadius="xl"
          overflow="hidden"
          cursor="pointer"
          onClick={handleProductClick}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {product.images && product.images.length > 0 && (
            <motion.img
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={product.images[currentImageIndex].image_url}
              alt={product.images[currentImageIndex].alt_text || product.name}
              style={{ objectFit: 'cover', height: '100%', width: '100%' }}
            />
          )}
        </MotionBox>
      </Box>

      <VStack
        alignItems="start"
        w="full"
        mt={2}
        gap={0}
        bg={'transparent'}
      >
        <Text
          fontSize="lg"
          letterSpacing="tighter"
          color={isDark ? 'white' : 'gray.800'}
        >
          {product.name}
        </Text>

        <Text
          fontSize="lg"
          fontWeight="bold"
          letterSpacing="tighter"
          color={isDark ? 'white' : 'gray.800'}
        >
          ${product.price.toLocaleString()}
        </Text>

        {product.colors && product.colors.length > 0 && (
          <HStack justify="center" gap={2}>
            {product.colors.map((color) => (
              <Box
                key={color}
                w="6"
                h="6"
                borderRadius="full"
                bg={color.toLowerCase()}
                border="2px solid"
                borderColor={isDark ? 'gray.600' : 'gray.200'}
                transition="transform 0.2s"
                _hover={{ transform: 'scale(1.1)' }}
              />
            ))}
          </HStack>
        )}

        <HStack
          gap={2}
          className="size-selector"
          justify="center"
          w="full"
          py={2}
        >
          {Object.entries(product.stock).map(([size, data]) => {
            const stockInfo = data as StockInfo;
            const inCart = cartItems.find((item) => item.id === `${product.id}-${size}`)?.quantity || 0;
            const remaining = stockInfo.stock - inCart;

            return (
              <Tooltip
                key={size}
                aria-label={remaining > 0 ? "Añadir al carrito" : "Sin stock"}
                content={remaining > 0 ? `Quedan ${remaining} unidades` : "Sin stock"}
              >
                <Box
                  px={4}
                  py={2}
                  borderRadius="md"
                  bg={isDark ? remaining > 0 ? 'blue.600' : 'gray.700' : remaining > 0 ? 'blue.500' : 'gray.200'}
                  color={isDark ? 'white' : remaining > 0 ? 'white' : 'gray.500'}
                  cursor={remaining > 0 ? 'pointer' : 'not-allowed'}
                  opacity={remaining > 0 ? 1 : 0.6}
                  transition="all 0.2s"
                  _hover={remaining > 0 ? {
                    transform: 'scale(1.05)',
                    bg: isDark ? 'blue.500' : 'blue.400'
                  } : {}}
                  onClick={() => remaining > 0 && handleAddToCart(size)}
                >
                  {size.toUpperCase()}
                </Box>
              </Tooltip>
            );
          })}
        </HStack>
      </VStack>
    </MotionVStack>
  );
};