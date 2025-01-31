'use client';
import { useParams } from 'next/navigation';
import { useProducts } from '../../context/ProductContext';
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
  AspectRatio,
  Badge,
  Accordion,
  Spinner,
} from '@chakra-ui/react';
import { AccordionItemTrigger, AccordionItemContent } from "../../components/ui/accordion";
import {
  BreadcrumbCurrentLink,
  BreadcrumbLink,
  BreadcrumbRoot,
} from "../../components/ui/breadcrumb";
import { addItem } from '../../store/slices/cartSlice';
import { toast } from 'react-toastify';
import { FiShare2 } from 'react-icons/fi';
import { useColorMode, useColorModeValue } from '../../components/ui/color-mode';
import { Tooltip } from '../../components/ui/tooltip';
import RequestSizeDialog from '../../components/RequestSizeDialog';
import { HiCreditCard } from 'react-icons/hi';
import { toaster } from '../../components/ui/toaster';

interface StockInfo {
  stock: number;
  sku: string;
}


export default function ProductPage() {
  const params = useParams();
  const { products, isLoading, error } = useProducts();
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState<string[] | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [, setLoading] = useState(false);
  const { colorMode } = useColorMode();


  // Color mode values
  const textColor = useColorModeValue('gray.800', 'white');
  const secondaryBg = useColorModeValue('gray.50', 'gray.700');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');

  const isSizeSelected = selectedSize && selectedSize.length > 0;
  const cartItems = useSelector((state: { cart: { items: { id: string; quantity: number; }[]; }; }) => state.cart.items);

  const product = products.find(p => p.id === Number(params.id));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading product</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  if (!params) {
    return <div>Invalid product ID</div>;
  }

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

    const size = selectedSize[0];

    setLoading(true);
    try {
      // Simulate loading
      await new Promise(resolve => setTimeout(resolve, 800));

      const cartItem = {
        id: `${product.id}-${size}`,
        name: `${product.name} (${size.toUpperCase()})`,
        price: product.price,
        quantity: 1,
        imageUrl: product.images?.[0]?.image_url || '/placeholder.jpg',
      };

      dispatch(addItem(cartItem));
      // Show success toast
      toaster.create({
        title: "Producto añadido al carrito",
        description: `${product.name} (Talle: ${size})`,
        duration: 5000,
        meta: { closable: true },
      });

      setSelectedSize(null);

    }
    finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: `¡Mira este producto: ${product.name}!`,
          url: window.location.href,
        })
        .then(() => toast.success("Enlace compartido"))
        .catch(() => toast.error("Error al compartir el enlace"));
    } else {
      // Alternativa: Copiar al portapapeles
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => toast.success("Enlace copiado al portapapeles"))
        .catch(() => toast.error("No se pudo copiar el enlace"));
    }
  };

  const mainImage = product.images?.[selectedImage]?.image_url || '/placeholder.jpg';

  return (
    <Box bg={colorMode === 'dark' ? 'gray.800' : 'bg.muted'} h={{ base: "auto", md: "100vh" }} as={"section"}>
      <Container py={10} w={"100%"}>
        {/* Breadcrumb */}
        <BreadcrumbRoot mb={4} fontSize="md" color={mutedTextColor} letterSpacing={"normal"} fontWeight={"bold"} as={"nav"}>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
          <BreadcrumbLink href="/products">Products</BreadcrumbLink>
          <BreadcrumbCurrentLink>{product.name}</BreadcrumbCurrentLink>
        </BreadcrumbRoot>

        {/* Main Product Section */}
        <Grid templateColumns={{ base: '1fr', lg: '1.5fr 1fr' }} gap={10}>

          {/* Image Section */}
          <HStack gap={4} align="start">
            {/* Thumbnails on the side */}
            {product.images && product.images.length > 1 && (
              <VStack gap={2}>
                {product.images.map((img, idx) => (
                  <Box
                    key={idx}
                    borderRadius="md"
                    overflow="hidden"
                    borderWidth="2px"
                    borderColor={selectedImage === idx ? 'blue.500' : 'transparent'}
                    cursor="pointer"
                    onClick={() => setSelectedImage(idx)}
                    as={"button"}
                  >
                    <Image
                      w="120px"
                      as={"img"}
                      h="80px"
                      src={img.image_url}
                      alt={`${product.name} view ${idx + 1}`}
                      objectFit="cover"
                      transition="opacity 0.2s"
                      _hover={{ opacity: 0.8 }}
                    />
                  </Box>
                ))}
              </VStack>
            )}

            {/* Main Image */}
            <Box position="relative" w="100%" h="100%" bg={secondaryBg} borderRadius="lg" overflow="hidden">
              <AspectRatio ratio={3 / 3}>
                <Image src={mainImage} alt={product.name} objectFit="cover" as={"img"} />
              </AspectRatio>
            </Box>
          </HStack>

          {/* Product Details */}
          <VStack align="stretch" gap={6} color={textColor}>
            <Box>
              <HStack justify="space-between">
                <Heading letterSpacing={"tighter"} as="h1" size="2xl" color={textColor}>
                  {product.name}
                </Heading>
                <Button
                  aria-label="Share product"
                  aria-controls='share-menu'
                  as={"button"}
                  variant="ghost"
                  onClick={handleShare}
                >
                  <FiShare2 />
                </Button>
              </HStack>

              <HStack>
                <Text
                  fontSize="4xl"
                  fontWeight="bold"
                  color={textColor}
                  letterSpacing={"tighter"}
                  as={"span"}
                >
                  ${product.price}
                </Text>
                <Badge >In Stock</Badge>
              </HStack>

            </Box>

            {/* Size Selector with Stock Information */}
            <Box>
              <HStack fontSize="lg" justify="space-between" alignItems={"center"}>
                <Text color={textColor} as={"span"} fontWeight={"600"}>
                  Seleccionar talle
                </Text>
                <Text
                  textDecoration={"underline"}
                  fontStyle={"italic"}
                  color={textColor}
                  fontWeight={100}
                  cursor={"pointer"}
                  as={"button"}
                  aria-label={"Size guide"}
                >
                  Guía de talles
                </Text>
              </HStack>

              <HStack gap={6} justify="center" w="full" mt={6}>
                {Object.entries(product.stock).map(([size, data]) => {
                  const stockInfo = data as StockInfo;
                  const inCart =
                    cartItems.find((item) => item.id === `${product.id}-${size}`)?.quantity || 0;
                  const remaining = stockInfo.stock - inCart;

                  const isSelected = selectedSize?.includes(size);
                  const isOutOfStock = remaining <= 0;

                  return (
                    <Tooltip
                      key={size}
                      content={
                        isOutOfStock
                          ? "Sin stock"
                          : `Quedan ${remaining} unidades`
                      }
                    >
                      <Button
                        disabled={isOutOfStock}
                        size="lg"
                        p={5}
                        as={"button"}
                        bg={isSelected ? (colorMode === "dark" ? "white" : "black") : (colorMode === "dark" ? "transparent" : "white")}
                        color={isSelected ? (colorMode === "dark" ? "black" : "white") : (colorMode === "dark" ? "white" : "black")}
                        textDecoration={isOutOfStock ? "line-through" : "none"}
                        opacity={isOutOfStock ? 0.5 : 1}
                        border={isSelected ? "1px solid" : "1px solid"}
                        _hover={
                          isSelected
                            ? {}
                            : {
                              bg: isOutOfStock ? (colorMode === "dark" ? "gray.500" : "#555454") : (colorMode === "dark" ? "gray.700" : "#D0D0D0"),
                              color: isOutOfStock ? (colorMode === "dark" ? "gray.400" : "#D0D0D0") : (colorMode === "dark" ? "white" : "#555454"),
                              cursor: isOutOfStock ? "not-allowed" : "pointer",
                            }
                        }
                        _disabled={{
                          cursor: "not-allowed",
                        }}
                        transition="all 0.3s ease"
                        onClick={() => !isOutOfStock && setSelectedSize([size])}
                      >
                        {size.toUpperCase()}
                      </Button>
                    </Tooltip>
                  );
                })}
              </HStack>
            </Box>

            <RequestSizeDialog />
            <Box>
              <Button
                colorPalette={isSizeSelected && remainingStock > 0 ? 'blue' : 'gray.100'}
                color={isSizeSelected && remainingStock > 0 ? 'white' : 'gray.400'}
                width="100%"
                disabled={!isSizeSelected || remainingStock <= 0 || isLoading}
                onClick={handleAddToCart}
                size="xl"
                mt={1}
                p={6}
                fontWeight={"600"}
                borderRadius={"md"}
                letterSpacing={"tighter"}
                as={"button"}
              >
                {isLoading ? (
                  <HStack gap={2}>
                    <Spinner size="sm" />
                    <Text>Adding to Cart...</Text>
                  </HStack>
                ) : !isSizeSelected ? (
                  'Selecciona un talle'
                ) : remainingStock <= 0 ? (
                  'Out of Stock'
                ) : (
                  'Añadir al carrito'
                )}
              </Button>
              <Badge
                fontSize="md"
                borderRadius="2xl"
                bg={colorMode === 'dark' ? 'gray.900' : 'gray.200'}
                color={colorMode === 'dark' ? 'white' : 'gray.800'}
                alignItems="center"
                justifyContent="center"
                display="flex"
                p={8}
                gap={2}
                mt={2}
                as={"span"}
              >
                <HiCreditCard />
                Aceptamos hasta 3 cuotas sin interés &nbsp;
              </Badge>
            </Box>

            {/* Description and Shipping */}
            <Box>
              <Text color={textColor} fontSize={"lg"} mt={5} letterSpacing={"tighter"} as={"p"}>
                {product.description}
              </Text>
              <VStack align="stretch" mt={6} as={"section"}>
                <Accordion.Root collapsible>
                  <Accordion.Item value="shipping" py={2}>
                    <AccordionItemTrigger
                      cursor={"pointer"}
                      borderRadius="md"
                    >
                      <Box as="span" flex="1" textAlign="left" color={textColor} fontWeight={"600"}>
                        Envíos
                      </Box>
                    </AccordionItemTrigger>
                    <AccordionItemContent pb={4} bg={colorMode === 'dark' ? 'gray.800' : 'gray.100'} >
                      <Text color={textColor} as={"p"}>
                        Realizamos envíos a todo el país. El costo depende de la ubicación.
                      </Text>
                    </AccordionItemContent>
                  </Accordion.Item>


                  <Accordion.Item value="payment" py={2}>
                    <AccordionItemTrigger
                      cursor={"pointer"}
                      borderRadius="md"
                    >
                      <Box as="span" flex="1" textAlign="left" color={textColor} fontWeight={"600"}>
                        Métodos de pago
                      </Box>
                    </AccordionItemTrigger>
                    <AccordionItemContent pb={4} bg={colorMode === 'dark' ? 'gray.800' : 'gray.100'}>
                      <Text color={textColor} as={"p"}>
                        Aceptamos tarjetas de débito, crédito y transferencias bancarias.
                      </Text>
                    </AccordionItemContent>
                  </Accordion.Item>
                </Accordion.Root>
              </VStack>
            </Box>
          </VStack>
        </Grid>
      </Container>
    </Box>
  );
};