import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  Grid,
  Text,
  VStack,
  Image,
  Stack,
  Button,
} from '@chakra-ui/react';
import { Product } from '../../types/Product';
import { addItem } from "../store/slices/cartSlice";
import { useColorMode } from './ui/color-mode';
import { Tooltip } from './ui/tooltip';

interface ProductListProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export default function ProductList({ products, onSelectProduct }: ProductListProps) {
  const dispatch = useDispatch();
  const { colorMode } = useColorMode();
  const [selectedSize, setSelectedSize] = useState<Record<string, string>>({});
  const [showSizes, setShowSizes] = useState<Record<string, boolean>>({});

  const sizes = ['S', 'M', 'L', 'XL'];

  const handleProductClick = (product: Product) => {
    onSelectProduct(product);
  };

  const handleAddToCart = (product: Product, size: string) => {
    dispatch(addItem({
      id: `${product.id}-${size}`,
      name: product.name,
      price: product.price,
      quantity: 1,
    }));

    // Reset UI state
    setShowSizes(prev => ({ ...prev, [product.id]: false }));
    setSelectedSize(prev => ({ ...prev, [product.id]: '' }));
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
    <Box maxW="7xl" mx="auto" px={4} py={20}>
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
            bg={colorMode === 'dark' ? 'gray.800' : 'white'}
            shadow="md"
            borderRadius="lg"
            _hover={{
              shadow: 'xl',
              transform: 'scale(1.02)',
            }}
            transition="all 0.3s"
            position="relative"
            overflow="hidden"
            onClick={() => handleProductClick(product)}
            cursor="pointer"
          >
            <Box
              w="full"
              h="300px"
              overflow="hidden"
              borderRadius="lg"
              bg="gray.100"
              position="relative"
            >
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[0].image_url}
                  alt={product.name}
                  objectFit="cover"
                  h="full"
                  w="full"
                />
              ) : (
                <Text fontSize="sm" color="gray.500" textAlign="center">
                  Imagen no disponible
                </Text>
              )}

              {/* Hover overlay */}
              <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                bg="blackAlpha.600"
                opacity="0"
                _groupHover={{ opacity: 1 }}
                transition="opacity 0.3s"
              />
            </Box>

            <Stack gap={1} textAlign="center" w="full">
              <Text
                fontWeight="semibold"
                fontSize="md"
                color={colorMode === 'dark' ? 'gray.100' : 'gray.700'}
              >
                {product.name}
              </Text>
              <Text
                fontSize="lg"
                color={colorMode === 'dark' ? 'white' : 'gray.900'}
                fontWeight="bold"
              >
                ${product.price}
              </Text>

              {showSizes[product.id] ? (
                <Box display="flex" gap={2} mt={2} justifyContent="center">
                  {sizes.map((size) => (
                    <Button
                      key={size}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product, size);
                      }}
                      bg={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
                      color={colorMode === 'dark' ? 'white' : 'gray.800'}
                      _hover={{
                        bg: colorMode === 'dark' ? 'gray.600' : 'gray.300'
                      }}
                      variant={selectedSize[product.id] === size ? 'solid' : 'outline'}
                    >
                      {size}
                    </Button>
                  ))}
                </Box>
              ) : (
                <Box display="flex" gap={2} p={8} justifyContent="center">
                  <Button
                    w="full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(product);
                    }}
                    bg={colorMode === 'dark' ? 'gray.100' : 'gray.800'}
                    color={colorMode === 'dark' ? 'gray.800' : 'white'}
                    _hover={{
                      bg: colorMode === 'dark' ? 'white' : 'black',
                      transform: 'scale(1.03)'
                    }}
                    transition="all 0.3s"
                    fontFamily={'Archivo Black'}
                    fontSize={'md'}
                    letterSpacing={'tighter'}
                  >
                    Comprar
                  </Button>
                  <Tooltip content="Agregar al carrito"  >
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowSizes(prev => ({ ...prev, [product.id]: true }));
                      }}
                      bg={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
                      color={colorMode === 'dark' ? 'white' : 'gray.800'}
                      _hover={{
                        bg: colorMode === 'dark' ? 'gray.600' : 'gray.300'
                      }}
                      transition="all 0.3s"
                    >
                      🛒
                    </Button>
                  </Tooltip>
                </Box>
              )}
            </Stack>
          </VStack>
        ))}
      </Grid>
    </Box>
  );
}