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
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from './ui/select';
import { Product } from '../../types/Product';
import { addItem } from '../store/slices/cartSlice';
import { toast } from 'react-toastify';
import { FiHeart, FiShare2 } from 'react-icons/fi';

interface ProductOverviewProps {
  product: Product;
  relatedProducts?: Product[];
}

const ProductOverview: React.FC<ProductOverviewProps> = ({
  product,
  relatedProducts = []
}) => {
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState<string[] | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const cartItems = useSelector((state: { cart: { items: { id: string; quantity: number; }[]; }; }) => state.cart.items);

  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const secondaryBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');

  const getCurrentStock = () => {
    if (!selectedSize) return 0;
    const size = selectedSize[0];
    return product.available_sizes[size]?.stock || 0;
  };

  const getCurrentCartQuantity = () => {
    if (!selectedSize) return 0;
    const productId = `${product.id}-${selectedSize[0]}`;
    const cartItem = cartItems.find(item => item.id === productId);
    return cartItem?.quantity || 0;
  };

  const remainingStock = getCurrentStock() - getCurrentCartQuantity();

  const handleAddToCart = async () => {
    if (!selectedSize || remainingStock <= 0) return;

    setIsLoading(true);
    try {
      // Simulamos una carga
      await new Promise(resolve => setTimeout(resolve, 800));

      const cartItem = {
        id: `${product.id}-${selectedSize[0]}`,
        name: `${product.name} (${selectedSize[0].toUpperCase()})`,
        price: parseFloat(product.price),
        quantity: 1,
      };

      dispatch(addItem(cartItem));
      toast.success('Product added to cart!');
    } catch {
      toast.error('Error adding product to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const mainImage = product.images?.[selectedImage]?.image_url || '/placeholder.jpg';

  return (
    <Box bg={useColorModeValue('gray.50', 'gray.900')} minH="100vh">
      <Container maxW="7xl" py={8}>
        {/* Breadcrumb */}
        <BreadcrumbRoot mb={6} fontSize="sm" color={mutedTextColor}>
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
              <IconButton
                aria-label="Add to favorites"
                position="absolute"
                top={4}
                right={4}
                colorScheme="gray"
                variant="solid"
                bg={bgColor}
                _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
              >
                <FiHeart />
              </IconButton>
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
          <VStack align="stretch" gap={6}>
            <Box>
              <HStack justify="space-between" mb={4}>
                <Heading as="h1" size="xl" color={textColor}>
                  {product.name}
                </Heading>
                <IconButton
                  aria-label="Share product"
                  variant="ghost"
                >
                  <FiShare2 />
                </IconButton>
              </HStack>

              <HStack mb={2}>
                <Text
                  fontSize="3xl"
                  fontWeight="bold"
                  color={textColor}
                >
                  ${product.price}
                </Text>
                <Badge colorScheme="green">In Stock</Badge>
              </HStack>
              <Text fontSize="sm" color={mutedTextColor}>
                Taxes included
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="md" mb={3}>
                Description
              </Heading>
              <Text color={mutedTextColor}>
                {product.description}
              </Text>
            </Box>

            {/* Size Selector */}
            {/* Size Selector with Stock Information */}
            <Box>
              <Heading as="h2" size="md" mb={3}>
                Select Size
              </Heading>
              <SelectRoot
                value={selectedSize || []}
                onValueChange={(e) => setSelectedSize(e.value)}
              >
                <SelectTrigger>
                  <SelectValueText placeholder="Choose a size" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(product.available_sizes).map(([size, data]) => {
                    const inCart = cartItems.find(item => item.id === `${product.id}-${size}`)?.quantity || 0;
                    const remaining = data.stock - inCart;
                    return (
                      <SelectItem
                        key={size}
                        item={{ value: size, label: size.toUpperCase() }}
                        isDisabled={remaining <= 0}
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

            <Button
              colorScheme={selectedSize && remainingStock > 0 ? 'blue' : 'gray'}
              width="100%"
              disabled={!selectedSize || remainingStock <= 0 || isLoading}
              onClick={handleAddToCart}
              size="lg"
            >
              {isLoading ? (
                <HStack gap={2}>
                  <Spinner size="sm" />
                  <Text>Adding to Cart...</Text>
                </HStack>
              ) : remainingStock <= 0 ? (
                'Out of Stock'
              ) : (
                'Add to Cart'
              )}
            </Button>
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