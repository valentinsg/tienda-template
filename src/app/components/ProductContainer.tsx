import React, { useState } from 'react';
import {
  VStack,
  Box,
  Image,
  Text,
  Button,
  Stack,
  Badge,
  createListCollection,
  HStack,
} from '@chakra-ui/react';
import { Tooltip } from './ui/tooltip';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../store/slices/cartSlice';
import type { Product } from '../../types/Product';
import { useColorMode } from './ui/color-mode';
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from './ui/select';

interface ProductContainerProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductContainer: React.FC<ProductContainerProps> = ({
  product,
  onSelect,
}) => {
  const dispatch = useDispatch();
  const { colorMode } = useColorMode();
  const cartItems = useSelector((state: any) => state.cart.items);
  const [selectedSize, setSelectedSize] = useState<string[] | null>(null);
  const [showSizes, setShowSizes] = useState(false);

  const handleAddToCart = (size: string) => {
    if (product.stock[size]?.stock > 0) {
      dispatch(addItem({
        id: `${product.id}-${size}`,
        name: product.name,
        price: product.price,
        size,
        sku: product.stock[size].sku,
        quantity: 1,
      }));
      setShowSizes(false);
    }
  };

  const isOutOfStock = (size: string) => {
    return product.stock[size]?.stock <= 0;
  };

  return (
    <VStack
      gap={4}
      p={6}
      bg={colorMode === 'dark' ? 'gray.800' : 'white'}
      shadow="lg"
      borderRadius="xl"
      _hover={{
        shadow: '2xl',
        transform: 'translateY(-4px)',
      }}
      transition="all 0.3s ease-in-out"
      position="relative"
      overflow="hidden"
      cursor="pointer"
      role="group"
    >
      <Badge
        position="absolute"
        top={4}
        right={4}
        colorScheme="blue"
        zIndex={1}
      >
        {product.category}
      </Badge>

      <Box
        w="full"
        h="350px"
        overflow="hidden"
        borderRadius="xl"
        bg="gray.100"
        position="relative"
        onClick={() => onSelect(product)}
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
              p={3}
              transform="translateY(100%)"
              _groupHover={{ transform: 'translateY(0)' }}
              transition="transform 0.3s"
            >
              <Text fontWeight="semibold" fontSize="lg">
                {product.name}
              </Text>
              <Text fontSize="xl" fontWeight="bold">
                ${product.price.toLocaleString()}
              </Text>
              <Text fontSize="sm" mt={1} color="gray.200">
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
        {/* Color Options */}
        {product.colors && product.colors.length > 0 && (
          <Box display="flex" gap={2} justifyContent="center">
            {product.colors.map((color) => (
              <Tooltip key={color} aria-label={color} content={undefined}>
                <Box
                  w="6"
                  h="6"
                  borderRadius="full"
                  bg={color.toLowerCase()}
                  border="2px solid"
                  borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
                />
              </Tooltip>
            ))}
          </Box>
        )}

        {showSizes ? (
          <Box>
            <SelectRoot
              value={selectedSize || []}
              onValueChange={(e) => setSelectedSize(e.value)}
              collection={createListCollection(
                { items: Object.keys(product.stock).map(size => ({ value: size, label: size.toUpperCase() })) }
              )}
            >
              <SelectTrigger>
                <SelectValueText placeholder="Choose a size" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(product.stock).map(([size, data]) => {
                  const inCart = cartItems.find((item: { id: string; }) => item.id === `${product.id}-${size}`)?.quantity || 0;
                  const remaining = (data as { stock: number }).stock - inCart;
                  return (
                    <SelectItem
                      key={size}
                      item={{ value: size, label: size.toUpperCase() }}
                      onClick={() => handleAddToCart(size)}
                      _disabled={{
                        opacity: remaining <= 0 ? 0.5 : 1,
                        cursor: remaining <= 0 ? 'not-allowed' : 'pointer',
                        pointerEvents: remaining <= 0 ? 'none' : 'auto'
                      }}
                    >
                      <HStack justify="space-between" width="100%">
                        <Text>{size.toUpperCase()}</Text>
                        <Badge colorScheme={remaining > 5 ? 'green' : remaining > 0 ? 'yellow' : 'red'}>
                          {remaining} left
                        </Badge>
                      </HStack>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </SelectRoot>
          </Box>
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
            Comprar
          </Button>
        )}

        {/* SKU Display */}
        <Text fontSize="xs" color="gray.500" mt={2}>
          SKU: {product.sku}
        </Text>
      </Stack>
    </VStack>
  );
};