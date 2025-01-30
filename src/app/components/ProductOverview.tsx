import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Grid,
  Image,
  Text,
  Heading,
  Button,
  HStack,
  VStack,
  IconButton,
  AspectRatio,
  SimpleGrid,
  Badge,
  Spinner,
} from '@chakra-ui/react';
import {
  BreadcrumbCurrentLink,
  BreadcrumbLink,
  BreadcrumbRoot,
} from "../components/ui/breadcrumb";
import { useColorModeValue } from '../components/ui/color-mode';
import { Product } from '../../types/Product';
import { addItem } from '../store/slices/cartSlice';
import { toast } from 'react-toastify';
import { FiShare2 } from 'react-icons/fi';
import { useColorMode } from '../components/ui/color-mode';
import { Tooltip } from './ui/tooltip';
import RequestSizeDialog from './RequestSizeDialog';
import { toaster } from './ui/toaster';

interface ProductOverviewProps {
  product: Product;
  relatedProducts?: Product[];
}

interface StockInfo {
  stock: number;
  sku: string;
}

const ProductOverview: React.FC<ProductOverviewProps> = ({
  product,
  relatedProducts = []
}) => {
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState<string[] | null>(null);  
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { colorMode } = useColorMode();

  const isSizeSelected = selectedSize && selectedSize.length > 0;
  const cartItems = useSelector((state: { cart: { items: { id: string; quantity: number; }[]; }; }) => state.cart.items);

  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const secondaryBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');

  const cartDialogRef = React.useRef<{ setIsDialogOpen: (open: boolean) => void }>(null);

  const getCurrentStock = () => {
    if (!selectedSize || selectedSize.length === 0) return 0;
    const size = selectedSize[0];
    return product.stock[size]?.stock || 0;
  };

  const getCurrentCartQuantity = () => {
    if (!selectedSize) return 0;
    const productId = `${product.id}-${selectedSize[0]}`;
    const cartItem = cartItems.find(item => item.id === productId);
    return cartItem?.quantity || 0;
  };

  const remainingStock = Math.max(0, getCurrentStock() - getCurrentCartQuantity());

  const handleAddToCart = async () => {
    if (!isSizeSelected || remainingStock <= 0) return;

    setIsLoading(true);
    try {
      // Simulate loading
      await new Promise(resolve => setTimeout(resolve, 800));

      const cartItem = {
        id: `${product.id}-${selectedSize[0]}`,
        name: `${product.name} (${selectedSize[0].toUpperCase()})`,
        price: product.price,
        quantity: 1,
        imageUrl: product.images?.[0]?.image_url || '/placeholder.jpg',
      };

      dispatch(addItem(cartItem));
      
      // Show notification
      toaster.create({
        title: "Producto añadido al carrito",
        description: `${product.name} (Talle: ${selectedSize[0]})`,
        duration: 5000,
        meta: { closable: true },
      });

      // Reset selected size
      setSelectedSize(null);

      // Open cart dialog
      if (cartDialogRef.current) {
        cartDialogRef.current.setIsDialogOpen(true);
      }
    } catch {
      toaster.create({
        title: "Error",
        description: "Error adding product to cart",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize([size]);
  };

  const mainImage = product.images?.[selectedImage]?.image_url || '/placeholder.jpg';

  return (
    <Box bg={colorMode === 'dark' ? 'gray.800' : 'bg.muted'} minH="100vh" letterSpacing={"tighter"} >
      <Container py={8}>
        {/* Breadcrumb */}
        <BreadcrumbRoot mb={4} fontSize="md" color={mutedTextColor} letterSpacing={"normal"} fontWeight={"bold"} >
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
          <BreadcrumbLink href="/products">Products</BreadcrumbLink>
          <BreadcrumbCurrentLink>{product.name}</BreadcrumbCurrentLink>
        </BreadcrumbRoot>

        {/* Main Product Section */}
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8}>

          {/* Image Section */}
          <VStack gap={4}>
            <Box
              position="relative"
              w="100%"
              bg={secondaryBg}
              borderRadius="lg"
              overflow="hidden"
            >
              <AspectRatio ratio={1}>
                <Image
                  src={mainImage}
                  alt={product.name}
                  objectFit="cover"
                />
              </AspectRatio>
            </Box>

            {/* Thumbnail Grid */}
            {product.images && product.images.length > 1 && (
              <SimpleGrid columns={4} gap={2} w="100%">
                {product.images.map((img, idx) => (
                  <Box
                    key={idx}
                    borderRadius="md"
                    overflow="hidden"
                    borderWidth="2px"
                    borderColor={selectedImage === idx ? 'blue.500' : 'transparent'}
                    cursor="pointer"
                    onClick={() => setSelectedImage(idx)}
                  >
                    <AspectRatio ratio={1}>
                      <Image
                        src={img.image_url}
                        alt={`${product.name} view ${idx + 1}`}
                        objectFit="cover"
                        transition="opacity 0.2s"
                        _hover={{ opacity: 0.8 }}
                      />
                    </AspectRatio>
                  </Box>
                ))}
              </SimpleGrid>
            )}
          </VStack>

          {/* Product Details */}
          <VStack align="stretch" gap={4} w={{ base: "100%", md: "70%" }}>
            <Box>
              <Badge fontSize="sm" p={1} bg={"black"} color={"white"} borderRadius="md">
                {product.category.toString()}
              </Badge>

              <HStack justify="space-between">
                <Heading letterSpacing={"tighter"} as="h1" size="xl" color={textColor}>
                  {product.name}
                </Heading>
                <IconButton
                  aria-label="Share product"
                  variant="ghost"
                >
                  <FiShare2 />
                </IconButton>
              </HStack>

              <HStack>
                <Text
                  fontSize="3xl"
                  fontWeight="bold"
                  color={textColor}
                >
                  ${product.price}
                </Text>
                <Badge >In Stock</Badge>
              </HStack>
              <Text fontSize="sm" color={mutedTextColor} >
                Impuestos incluídos
              </Text>
            </Box>

            {/* Size Selector with Stock Information */}
            <Box>

              <HStack fontSize="lg" justify="space-between" alignItems={"center"} mb={2}>
                <Text color={textColor} >
                  Selecciona un talle
                </Text>
                <Text
                  color={mutedTextColor}
                  textDecoration={"underline"}
                  fontStyle={"italic"}
                >
                  Guía de talles
                </Text>
              </HStack>

              <HStack gap={4} justify="center" w="full">
                {Object.entries(product.stock).map(([size, data]) => {
                  const stockInfo = data as StockInfo;
                  const inCart = cartItems.find((item) => item.id === `${product.id}-${size}`)?.quantity || 0;
                  const remaining = stockInfo.stock - inCart;

                  return (
                    <Tooltip
                      key={size}
                      aria-label={remaining > 0 ? `Quedan ${remaining} unidades` : "Sin stock"}
                      content={undefined}
                    >
                      <Button
                        disabled={remaining <= 0}
                        size="lg"
                        variant="outline"
                        colorScheme={remaining > 0 ? "blue" : "gray"}
                        onClick={() => handleSizeSelect(size)}
                        _hover={{
                          bg: remaining > 0 ? "blue.50" : "gray.100",
                        }}
                        _disabled={{
                          bg: "gray.100",
                          cursor: "not-allowed",
                        }}
                        borderColor={remaining > 0 ? "blue.400" : "gray.300"}
                        color={remaining > 0 ? "blue.600" : "gray.500"}
                        textDecoration={remaining === 0 ? "line-through" : "none"}
                        transition="all 0.3s ease"
                      >
                        {size.toUpperCase()}
                      </Button>
                    </Tooltip>
                  );
                })}
              </HStack>
              <RequestSizeDialog />
            </Box>
            <Button
              colorPalette={isSizeSelected && remainingStock > 0 ? 'blue' : 'gray'}
              width="100%"
              disabled={!isSizeSelected || remainingStock <= 0 || isLoading}
              onClick={handleAddToCart}
              size="lg"
            >
              {isLoading ? (
                <HStack gap={2}>
                  <Spinner size="sm" />
                  <Text>Adding to Cart...</Text>
                </HStack>
              ) : !isSizeSelected ? (
                'Select a Size'
              ) : remainingStock <= 0 ? (
                'Out of Stock'
              ) : (
                'Add to Cart'
              )}
            </Button>
            <Box>
              <Heading as="h2" size="md" mb={3}>
                Description
              </Heading>
              <Text color={mutedTextColor}>
                {product.description}
              </Text>
            </Box>
          </VStack>
        </Grid>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <Box mt={16}>
            <Heading as="h2" size="lg" mb={6}>
              Related Products
            </Heading>
            <SimpleGrid
              columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
              gap={6}
            >
              {relatedProducts.map((relatedProduct) => (
                <Box
                  key={relatedProduct.id}
                  bg={bgColor}
                  borderRadius="lg"
                  overflow="hidden"
                  borderWidth="1px"
                  borderColor={borderColor}
                  transition="transform 0.2s"
                  _hover={{ transform: 'translateY(-4px)' }}
                >
                  <AspectRatio ratio={1}>
                    <Image
                      src={relatedProduct.images?.[0]?.image_url || '/placeholder.jpg'}
                      alt={relatedProduct.name}
                      objectFit="cover"
                    />
                  </AspectRatio>
                  <Box p={4}>
                    <Text fontWeight="semibold" color={textColor}>
                      {relatedProduct.name}
                    </Text>
                    <Text color={mutedTextColor}>
                      ${relatedProduct.price}
                    </Text>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ProductOverview;