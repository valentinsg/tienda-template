import React, { useState } from 'react';
import { VStack, Box, Text, HStack, Button } from '@chakra-ui/react';
import { toaster } from './ui/toaster';
import { Tooltip } from './ui/tooltip';
import { useColorMode } from '../components/ui/color-mode';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../store/slices/cartSlice';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '../../types/Product';
import type { RootState } from '../store/store';
import { motion, AnimatePresence } from 'framer-motion';

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
          imageUrl: product.images?.[0]?.image_url || '/placeholder.jpg',
        })
      );
      toaster.create({
        title: "Producto añadido al BusyCarrito",
        description: `${product.name} (Talle: ${size}) `,
        duration: 5000,
        meta: {
          closable: true,
        },
      });

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

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.images && product.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.images && product.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const handleProductClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('.size-selector')) {
      onSelect(product);
    }
  };

  const isDark = colorMode === 'dark';

  const aspectRatio = 4 / 3;

  return (
    <VStack
      position="relative"
      minW={{ base: "100%", sm: "200px", md: "300px", lg: "500px" }}
      maxW={{ base: "100%", sm: "240px", md: "400px", lg: "500px" }}
      w="full"
      gap={0}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="group"
    >
      <Box
        bg={isDark ? 'gray.800' : 'white'}
        borderRadius="md"
        position="relative"
        width="100%"
      >
        <Box
          position="relative"
          borderRadius="xl"
          overflow="hidden"
          cursor="pointer"
          onClick={handleProductClick}
          onMouseEnter={() => setCurrentImageIndex(1)}
          onMouseLeave={() => setCurrentImageIndex(0)}
          paddingBottom={{ base: "133%", md: `${(1 / aspectRatio) * 100}%` }}
        >
          {product.images && product.images.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                src={product.images[currentImageIndex].image_url}
                alt={product.images[currentImageIndex].alt_text || product.name}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </AnimatePresence>
          )}
          {/* Navigation Arrows */}
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            opacity={isHovering ? 1 : 0}
            transition="opacity 0.3s"
          >
            <Button
              onClick={handlePrevImage}
              variant="ghost"
              aria-label="Previous image"
            >
              <ChevronLeft />
            </Button>
            <Button
              onClick={handleNextImage}
              variant="ghost"
              aria-label="Next image"
            >
              <ChevronRight />
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Product Info Container with fixed height */}
      <Box position="relative" w="full" h="24" overflow="hidden">
        {/* Product Info */}
        <motion.div
          initial={false}
          animate={{
            y: isHovering ? -20 : 0,
            opacity: isHovering ? 0 : 1,
          }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute',
            width: '100%',
            paddingTop: '0.5rem',
          }}
        >
          <VStack alignItems="start" w="full" gap={0}>
            <Text
              fontSize="lg"
              letterSpacing="tighter"
              color={isDark ? 'white' : 'gray.800'}
              lineHeight={1.2}
            >
              {product.name}
            </Text>
            <Text
              fontSize="2xl"
              fontWeight="bold"
              letterSpacing="tighter"
              color={isDark ? 'white' : 'gray.800'}
            >
              ${product.price.toLocaleString()}
            </Text>
            {product.colors && product.colors.length > 0 && (
              <HStack justify="start" gap={2} mt={1}>
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
          </VStack>
        </motion.div>

        {/* Sizes */}
        <motion.div
          initial={false}
          animate={{
            y: isHovering ? 0 : 20,
            opacity: isHovering ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute',
            width: '100%',
            paddingTop: '0.8rem',
          }}
        >
          <HStack gap={8} justify="center" w="full">
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
                  <Text
                    color={isDark ? 'white' : remaining > 0 ? 'black' : 'gray.500'}
                    cursor={remaining > 0 ? 'pointer' : 'not-allowed'}
                    fontSize="2xl"
                    opacity={remaining > 0 ? 1 : 0.6}
                    transition="all 0.3s"
                    onClick={() => remaining > 0 && handleAddToCart(size)}
                    _hover={{ textDecoration: remaining > 0 ? 'underline' : 'none' }}
                  >
                    {size.toUpperCase()}
                  </Text>
                </Tooltip>
              );
            })}
          </HStack>
        </motion.div>
      </Box>
    </VStack>
  );
};