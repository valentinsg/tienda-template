import React, { useState } from 'react';
import {
  VStack,
  Box,
  Image,
  Text,
  Button,
  Stack,
  Badge,
  HStack,
  createListCollection,
} from '@chakra-ui/react';
import { Tooltip } from './ui/tooltip';
import { useDispatch, useSelector } from 'react-redux';
import { useColorMode } from './ui/color-mode';
import { keyframes } from '@emotion/react';
import { addItem } from '../store/slices/cartSlice';
import type { Product } from '../../types/Product';
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from './ui/select';
import Link from 'next/link';

// Define types for Redux state
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

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;


export const ProductContainer: React.FC<ProductContainerProps> = ({
  product,
  onSelect,
  categoryNames = {},
}) => {
  const dispatch = useDispatch();
  const { colorMode } = useColorMode();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [selectedSize, setSelectedSize] = useState<string[] | null>(null);
  const [showSizes, setShowSizes] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

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
        setSelectedSize(null);
      }, 500);
    }
  };

  return (
    <VStack
      animation={`${fadeIn} 0.5s ease-out`}
      gap={4}
      p={6}
      bg={colorMode === 'dark' ? 'gray.800' : 'white'}
      boxShadow="lg"
      borderRadius="xl"
      _hover={{
        boxShadow: '2xl',
        transform: 'translateY(-4px)',
      }}
      transition="all 0.3s ease-in-out"
      position="relative"
      overflow="hidden"
      role="group"
    >
      <Link href={`/category/${product.category}`} passHref>
        <Badge
          as="a"
          position="absolute"
          top={4}
          right={4}
          colorScheme="blue"
          zIndex={1}
          px={3}
          py={1}
          borderRadius="full"
          cursor="pointer"
          transition="all 0.2s"
          _hover={{
            transform: 'scale(1.05)',
            bg: colorMode === 'dark' ? 'blue.500' : 'blue.600',
          }}
        >
          {categoryNames[product.category] || product.category}
        </Badge>
      </Link>

      <Box
        w="full"
        h="350px"
        overflow="hidden"
        borderRadius="xl"
        bg="gray.100"
        position="relative"
        onClick={() => onSelect(product)}
        cursor="pointer"
      >
        {product.images && product.images.length > 0 ? (
          <>
            <Image
              src={product.images[0].image_url}
              alt={product.images[0].alt_text || product.name}
              objectFit="cover"
              h="full"
              w="full"
              transition="transform 0.5s"
              _groupHover={{ transform: 'scale(1.05)' }}
            />
            <Box
              position="absolute"
              bottom="0"
              left="0"
              right="0"
              bg="blackAlpha.700"
              backdropFilter="blur(4px)"
              color="white"
              p={4}
              transform="translateY(100%)"
              _groupHover={{ transform: 'translateY(0)' }}
              transition="all 0.3s ease-in-out"
            >
              <Text fontWeight="bold" fontSize="xl">
                {product.name}
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color="blue.300">
                ${product.price.toLocaleString()}
              </Text>
              <Text fontSize="sm" mt={2} color="gray.200">
                {product.description}
              </Text>
            </Box>
          </>
        ) : (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            h="full"
          >
            <Text fontSize="sm" color="gray.500">
              Imagen no disponible
            </Text>
          </Box>
        )}
      </Box>

      <Stack gap={3} textAlign="center" w="full">
        {product.colors && product.colors.length > 0 && (
          <HStack justify="center" gap={2}>
            {product.colors.map((color) => (
              <Tooltip key={color} aria-label={color} content={undefined}>
                <Box
                  w="6"
                  h="6"
                  borderRadius="full"
                  bg={color.toLowerCase()}
                  border="2px solid"
                  borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
                  transition="transform 0.2s"
                  _hover={{ transform: 'scale(1.1)' }}
                />
              </Tooltip>
            ))}
          </HStack>
        )}

        <Box
          opacity={showSizes ? 1 : 0}
          transform={showSizes ? 'translateY(0)' : 'translateY(10px)'}
          transition="all 0.3s ease-in-out"
        >
          {showSizes ? (
            <SelectRoot
              value={selectedSize || []}
              onValueChange={(e) => setSelectedSize(e.value)}
              collection={createListCollection(
                { items: Object.keys(product.stock).map(size => ({ value: size, label: size.toUpperCase() })) }
              )}
            >
              <SelectTrigger>
                <SelectValueText placeholder="Selecciona talle" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(product.stock).map(([size, data]) => {
                  const stockInfo = data as StockInfo;
                  const inCart = cartItems.find((item) => item.id === `${product.id}-${size}`)?.quantity || 0;
                  const remaining = stockInfo.stock - inCart;

                  return (
                    <SelectItem
                      key={size}
                      item={size}
                      className="flex justify-between items-center w-full"
                    >
                      <HStack justify="space-between" width="100%" px={2}>
                        <Text fontWeight="medium">{size.toUpperCase()}</Text>
                        <Button
                          size="sm"
                          colorScheme="blue"
                          disabled={remaining <= 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(size);
                          }}
                          _hover={{
                            transform: 'scale(1.05)',
                          }}
                        >
                          Añadir al carrito
                        </Button>
                      </HStack>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </SelectRoot>
          ) : (
            <Button
              w="full"
              size="lg"
              onClick={(e) => {
                e.stopPropagation();
                setShowSizes(true);
              }}
              colorScheme="blue"
              fontWeight="bold"
              _hover={{
                transform: 'scale(1.02)',
              }}
              transition="all 0.2s"
            >
              {isAdding ? 'Añadido ✓' : 'Selecciona talle'}
            </Button>
          )}
        </Box>

        <HStack justify="center" gap={2} opacity={0.7}>
          <Text fontSize="sm" color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}>
            Referencia:
          </Text>
          <Text fontSize="sm" fontWeight="medium" color={colorMode === 'dark' ? 'gray.300' : 'gray.700'}>
            {product.sku}
          </Text>
        </HStack>
      </Stack>
    </VStack>
  );
};