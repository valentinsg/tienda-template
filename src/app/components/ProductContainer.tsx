import React, { useState } from 'react';
import { VStack, Box, Text, HStack, Button, useBreakpointValue } from '@chakra-ui/react';
import { toaster } from './ui/toaster';
import { Tooltip } from './ui/tooltip';
import { useColorMode } from '../components/ui/color-mode';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../store/slices/cartSlice';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '../../types/Product';
import type { RootState } from '../store/store';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductContainerProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
}

export const ProductContainer: React.FC<ProductContainerProps> = ({
  product,
  onSelectProduct,
}) => {
  const dispatch = useDispatch();
  const { colorMode } = useColorMode();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const position = useBreakpointValue<"relative" | "absolute">({
    base: "relative",
    md: "absolute",
  });

  const availableSizes = Object.entries(product.stock || {})
    .filter(([, stockInfo]) => stockInfo.stock > 0)
    .map(([size, stockInfo]) => ({ size, stock: stockInfo.stock }));

  const handleAddToCart = (size: string) => {
    const sizeStock = product.stock[size];
    if (sizeStock && sizeStock.stock > 0) {
      dispatch(
        addItem({
          id: `${product.id}-${size}`,
          name: product.name + ' (' + size + ')',
          price: product.price,
          sku: sizeStock.sku,
          quantity: 1,
          imageUrl: product.images?.[0]?.image_url || '/placeholder.jpg',
        })
      );
      toaster.create({
        title: "Producto añadido al carrito",
        description: `${product.name} (Talle: ${size})`,
        duration: 5000,
        meta: { closable: true },
      });
    } else {
      toaster.create({
        title: "Sin stock",
        description: `${product.name} no tiene stock en talle ${size}`,
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
      onSelectProduct(product);
    }
  };

  const isDark = colorMode === 'dark';

  return (
    <VStack
      position="relative"
      minW={{ base: "160px", sm: "220px", md: "300px", lg: "25vw" }}
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
          h={{ base: "240px", sm: "400px", md: "425px", lg: "50vh" }}
        >
          {product.images && product.images.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                src={product.images[currentImageIndex].image_url}
                alt={product.images[currentImageIndex].alt_text || product.name}
                style={{
                  position: position as "relative" | "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  padding: 12,
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
          <VStack alignItems={{ base: "center", md: "start" }} w="full" gap={0}>
            <Text
              fontSize={{ base: "sm", md: "lg" }}
              letterSpacing="tighter"
              color={isDark ? 'white' : 'gray.800'}
              lineHeight={1.2}
            >
              {product.name}
            </Text>
            <Text
              fontSize={{ base: "md", md: "2xl" }}
              fontWeight="bold"
              letterSpacing="tighter"
              color={isDark ? 'white' : 'gray.800'}
            >
              ${product.price.toLocaleString()}
            </Text>
            <Box
              w="16px"
              h="16px"
              borderRadius="50%"
              backgroundColor={product.color}
              mr={"8px"}
              display={{ base: 'none', sm: 'block' }}
            />
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
            paddingTop: '1rem',
          }}
        >
          <HStack gap={8} justify="center" w="full">
            {availableSizes.map(({ size, stock }) => {
              const inCart = cartItems.find((item) => item.id === `${product.id}-${size}`)?.quantity || 0;
              const remaining = stock - inCart;

              return (
                <Tooltip
                  key={size}
                  content={remaining > 0 ? `Quedan ${remaining} unidades` : "Sin stock"}
                >
                  <Text
                    color={isDark ? '#d0d0d0' : remaining > 0 ? '#555454' : '#555454'}
                    cursor={remaining > 0 ? 'pointer' : 'not-allowed'}
                    fontSize="xl"
                    opacity={remaining > 0 ? 1 : 0.6}
                    onClick={() => remaining > 0 && handleAddToCart(size)}
                    _hover={{ textDecoration: remaining > 0 ? 'underline' : 'none' }}
                    textDecoration={remaining === 0 ? 'line-through' : 'none'}
                  >
                    {size.toUpperCase()}
                  </Text>
                </Tooltip>
              );
            })}
          </HStack>
        </motion.div>
      </Box>
    </VStack >
  );
};