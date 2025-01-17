import React, { useState } from 'react';
import {
  VStack,
  Box,
  Image,
  Text,
  Button,
  Badge,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { useColorMode } from '../components/ui/color-mode';
import { MenuRoot, MenuTrigger, MenuContent, MenuItem } from '../components/ui/menu';
import { ChevronDownIcon, ChevronUpIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../store/slices/cartSlice';
import type { Product } from '../../types/Product';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Wrap chakra components with motion
const MotionVStack = motion(VStack);
const MotionBox = motion(Box);

interface CartItem {
  id: string;
  quantity: number;
}

interface RootState {
  cart: {
    items: CartItem[];
  };
}

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
  const [showSizes, setShowSizes] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleAddToCart = (size: string) => {
    if (product.stock[size]?.stock > 0) {
      setIsAdding(true);
      dispatch(addItem({
        id: `${product.id}-${size}`,
        name: product.name,
        price: product.price,
        size,
        sku: product.stock[size].sku,
        quantity: 1,
      }));

      setTimeout(() => {
        setIsAdding(false);
        setShowSizes(false);
      }, 500);
    }
  };

  const handleProductClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('.size-selector')) {
      onSelect(product);
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.images && product.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.images && product.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  return (
    <MotionVStack
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      gap={4}
      p={6}
      bg={colorMode === 'dark' ? 'gray.800' : 'white'}
      boxShadow="lg"
      borderRadius="xl"
      _hover={{
        boxShadow: '2xl',
        transform: 'translateY(-4px)',
      }}
      position="relative"
      overflow="hidden"
      onClick={handleProductClick}
      minW="300px"
      maxW="400px"
      w="full"
    >
      {/* Category Badge */}
      <Link href={`/category/${product.category}`} passHref>
        <Badge
          as="a"
          position="absolute"
          top={4}
          right={4}
          colorPalette="blue"
          px={3}
          py={1}
          borderRadius="full"
          cursor="pointer"
          zIndex={2}
          _hover={{ transform: 'scale(1.05)' }}
        >
          {categoryNames[product.category] || product.category}
        </Badge>
      </Link>

      {/* Product Image */}
      <MotionBox
        w="full"
        h="400px"
        position="relative"
        borderRadius="xl"
        overflow="hidden"
      >
        {product.images && product.images.length > 0 ? (
          <>
            <motion.img
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={product.images[currentImageIndex].image_url}
              alt={product.images[currentImageIndex].alt_text || product.name}
              style={{ objectFit: 'cover', height: '100%', width: '100%' }}
            />
            {product.images.length > 1 && (
              <>
                <Button
                  aria-label="Previous image"
                  position="absolute"
                  left={2}
                  top="50%"
                  transform="translateY(-50%)"
                  colorPalette="blue"
                  variant="solid"
                  onClick={prevImage}
                  opacity={0.8}
                  _hover={{ opacity: 1 }}
                >
                  <ChevronLeftIcon />
                </Button>
                <Button
                  aria-label="Next image"
                  position="absolute"
                  right={2}
                  top="50%"
                  transform="translateY(-50%)"
                  colorPalette="blue"
                  variant="solid"
                  onClick={nextImage}
                  opacity={0.8}
                  _hover={{ opacity: 1 }}
                >
                  <ChevronRightIcon />
                </Button>
                <HStack
                  position="absolute"
                  bottom={2}
                  left="50%"
                  transform="translateX(-50%)"
                  gap={2}
                >
                  {product.images.map((_, index) => (
                    <Box
                      key={index}
                      w={2}
                      h={2}
                      borderRadius="full"
                      bg={index === currentImageIndex ? "blue.500" : "gray.300"}
                    />
                  ))}
                </HStack>
              </>
            )}
          </>
        ) : (
          <Box
            h="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="gray.100"
          >
            <Text color="gray.500">Imagen no disponible</Text>
          </Box>
        )}
      </MotionBox>

      {/* Product Info */}
      <VStack align="stretch" gap={3} w="full">
        <Text fontSize="2xl" fontWeight="bold" lineHeight="tight">
          {product.name}
        </Text>
        
        <Text fontSize="2xl" fontWeight="bold" colorPalette="blue">
          ${product.price.toLocaleString()}
        </Text>

        <Text fontSize="sm" color="gray.500">
          {product.description}
        </Text>
      </VStack>

      {/* Size Selector */}
      <Box w="full" className="size-selector">
        {!showSizes ? (
          <Button
            w="full"
            h="14"
            colorPalette="blue"
            fontSize="lg"
            fontWeight="bold"
            onClick={(e) => {
              e.stopPropagation();
              setShowSizes(true);
            }}
            _hover={{ transform: 'scale(1.02)' }}
          >
            {isAdding ? 'Añadido ✓' : 'Seleccionar Talle'}
          </Button>
        ) : (
          <MenuRoot>
            <MenuTrigger
              as={Button}
              w="full"
              h="14"
              colorPalette="blue"
              onClick={(e) => e.stopPropagation()}
            >
              <HStack justify="space-between" w="full">
                <Text>Elige un talle</Text>
                {showSizes ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </HStack>
            </MenuTrigger>
            <MenuContent
              zIndex={1000}
              onClick={(e) => e.stopPropagation()}
            >
              {Object.entries(product.stock).map(([size, data]) => {
                const stockInfo = data as StockInfo;
                const inCart = cartItems.find((item) => item.id === `${product.id}-${size}`)?.quantity || 0;
                const remaining = stockInfo.stock - inCart;

                return (
                  <MenuItem
                    key={size}
                    value={size}
                    disabled={remaining <= 0}
                    onClick={() => handleAddToCart(size)}
                  >
                    <HStack justify="space-between" w="full">
                      <Text fontWeight="medium">{size.toUpperCase()}</Text>
                      <Text fontSize="sm" color={remaining > 0 ? "green.500" : "red.500"}>
                        {remaining > 0 ? `Stock: ${remaining}` : 'Sin stock'}
                      </Text>
                    </HStack>
                  </MenuItem>
                );
              })}
              <MenuItem
                value="cancel"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSizes(false);
                }}
                color="red.500"
              >
                Cancelar
              </MenuItem>
            </MenuContent>
          </MenuRoot>
        )}
      </Box>

      {/* Color Options */}
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
              borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
              transition="transform 0.2s"
              _hover={{ transform: 'scale(1.1)' }}
            />
          ))}
        </HStack>
      )}
    </MotionVStack>
  );
};
