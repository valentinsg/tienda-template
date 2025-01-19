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
import { motion } from 'framer-motion';

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
        })
      );

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

  return (
    <VStack
      position="relative"
      overflow="hidden"
      minW="350px"
      maxW="450px"
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
      >
        <Box
          position="relative"
          borderRadius="xl"
          overflow="hidden"
          cursor="pointer"
          onClick={handleProductClick}
          onMouseEnter={() => setCurrentImageIndex(1)}
          onMouseLeave={() => setCurrentImageIndex(0)}
        >
          {product.images && product.images.length > 0 && (
            <Box
              position="relative"
              width="full"
              height="full"
            >
              <motion.img
                key={currentImageIndex}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={product.images[currentImageIndex].image_url}
                alt={product.images[currentImageIndex].alt_text || product.name}
                style={{ objectFit: 'cover', height: '100%', width: '100%' }}
              />

              {/* Navigation Arrows */}
              <Box
                transition="opacity 0.3s"
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Button
                  onClick={handlePrevImage}
                  variant="ghost"
                >
                  <ChevronLeft />
                </Button>
                <Button
                  onClick={handleNextImage}
                  variant="ghost"
                >
                  <ChevronRight />
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      <Box position="relative" w="full" h="24">
        {/* Product Info - Visible by default, hidden on hover */}
        <VStack
          position="absolute"
          top="0"
          left="0"
          right="0"
          alignItems="start"
          w="full"
          mt={2}
          gap={0}
          bg="transparent"
          transition="all 0.3s"
          style={{
            transform: isHovering ? 'translateY(-20px)' : 'translateY(0)',
            opacity: isHovering ? 0 : 1
          }}
        >
          <Text
            fontSize="lg"
            letterSpacing="tighter"
            color={isDark ? 'white' : 'gray.800'}
            lineHeight={1.2}
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

        {/* Sizes - Hidden by default, visible on hover */}
        <HStack
          position="absolute"
          gap={8}
          transition="all 0.3s"
          justify="center"
          w="full"
          mt={6}
          style={{
            transform: isHovering ? 'translateY(0)' : 'translateY(20px)',
            opacity: isHovering ? 1 : 0
          }}
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
                <Text
                  color={isDark ? 'white' : remaining > 0 ? 'black' : 'gray.500'}
                  cursor={remaining > 0 ? 'pointer' : 'not-allowed'}
                  fontSize="lg"
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
      </Box>
    </VStack>
  );
};