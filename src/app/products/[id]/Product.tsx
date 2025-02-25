'use client';
import { useParams } from 'next/navigation';
import { useProducts } from '../../hooks/useProducts';
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
import { FiShare2, FiX } from 'react-icons/fi';
import { useColorMode, useColorModeValue } from '../../components/ui/color-mode';
import { Tooltip } from '../../components/ui/tooltip';
import RequestSizeDialog from '../../components/RequestSizeDialog';
import { HiCreditCard } from 'react-icons/hi';
import { toaster } from '../../components/ui/toaster';
import { ImageModal } from '../../components/ImagesModal';
import { DialogHeader, DialogRoot, DialogBody, DialogContent } from '@/app/components/ui/dialog';

interface StockInfo {
  stock: number;
  sku: string;
}


export default function Product() {
  const params = useParams();
  const { products, isLoading, error } = useProducts();
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState<string[] | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [, setLoading] = useState(false);
  const { colorMode } = useColorMode();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Color mode values
  const textColor = useColorModeValue('gray.800', 'white');
  const secondaryBg = useColorModeValue('gray.200', 'gray.900');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');

  const isSizeSelected = selectedSize && selectedSize.length > 0;
  const cartItems = useSelector((state: { cart: { items: { id: string; quantity: number; }[]; }; }) => state.cart.items);

  const product = products.find(p => p.id === Number(params.id));

  if (isLoading) return (
    <Box bg={colorMode === 'dark' ? 'gray.800' : 'bg.muted'} w={"100%"} h={"1000px"} display={"flex"} justifyContent={"center"} alignItems={"center"} >
      <Spinner size="xl" color={colorMode === 'dark' ? 'gray.300' : 'bg.800'} />
    </Box>
  );

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

  // Get the size guide image (last image from the product images)
  const getSizeGuideImage = () => {
    if (product.images && product.images.length > 0) {
      return product.images[product.images.length - 1].image_url;
    }
    return '/placeholder.jpg';
  };

  const handleOpenSizeGuide = () => {
    setIsSizeGuideOpen(true);
  };

  const handleCloseSizeGuide = () => {
    setIsSizeGuideOpen(false);
  };

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
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const mainImage = product.images?.[selectedImage]?.image_url || '/placeholder.jpg';
  return (
    <Box color={textColor} h={{ base: "auto", md: "100%" }} w={"100%"} as={"section"}
      bgGradient={
        colorMode === 'dark'
          ? 'linear(to-b, gray.900, gray.800, gray.700)'
          : 'linear(to-b, #f5f5f5, #e0e0e0, #d6d6d6)'
      }
      backdropFilter="blur(10px)"

    >
      <Box
        textAlign={"center"}
        pt={{ base: 2, md: 10 }}
      >
        <Container
          py={{ base: 4, md: 4 }} // Reducido en mobile
          w={"100%"}
          px={{ base: 2, md: 4 }} // Ajuste del padding horizontal
        >
          {/* Breadcrumb */}
          <BreadcrumbRoot mb={4} fontSize={{ base: "sm", md: "md" }} color={mutedTextColor} letterSpacing={"tighter"} fontWeight={"bold"} as={"nav"}>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
            <BreadcrumbLink href="/products">Products</BreadcrumbLink>
            <BreadcrumbCurrentLink>{product.name}</BreadcrumbCurrentLink>
          </BreadcrumbRoot>

          {/* Main Product Section */}
          <Grid
            templateColumns={{ base: '1fr', lg: '1.5fr 1fr' }}
            gap={{ base: 4, md: 14 }}
            maxW="1400px"
            mx="auto"
          >
            {/* Image Section */}
            <Box w="100%">
              {/* Desktop Layout */}
              <HStack gap={4} align="start" display={{ base: 'none', md: 'flex' }}>
                {/* Thumbnails */}
                {product.images && product.images.length > 1 && (
                  <VStack gap={4} minW="120px">
                    {product.images.slice(0, 4).map((img, idx) => (
                      <Box
                        key={idx}
                        borderRadius="md"
                        overflow="hidden"
                        borderWidth="2px"
                        borderColor={selectedImage === idx ? 'blue.500' : 'transparent'}
                        cursor="pointer"
                        onClick={() => setSelectedImage(idx)}
                        as="button"
                        w="120px"
                        h="120px"
                        position="relative"
                        bg={secondaryBg}
                      >
                        <Image
                          w="100%"
                          h="100%"
                          src={img.image_url}
                          alt={`${product.name} view ${idx + 1}`}
                          objectFit="contain"
                          transition="opacity 0.2s"
                          _hover={{ opacity: 0.8 }}
                        />
                      </Box>
                    ))}
                    {product.images.length > 4 && (
                      <Button onClick={handleOpenModal} w="120px" h="120px" bg={secondaryBg} color={textColor} _hover={{ bg: useColorModeValue('gray.300', 'gray.800') }} >
                        +{product.images.length - 4}
                      </Button>
                    )}
                  </VStack>
                )}

                {/* Main Image - Desktop */}
                <Box
                  position="relative"
                  bg={secondaryBg}
                  borderRadius="lg"
                  overflow="hidden"
                  width="100%"
                  h={{ base: "600px", md: "700px" }}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Image
                    src={mainImage}
                    alt={product.name}
                    w="100%"
                    maxH="100%"
                    objectPosition="center"
                    as="img"
                  />
                </Box>
              </HStack>

              {/* Image Modal */}
              {product.images.length > 4 && (
                <ImageModal
                  images={product.images}
                  isOpen={isModalOpen}
                  onOpen={handleOpenModal}
                  onClose={handleCloseModal}
                />
              )}

              {/* Size Guide Modal */}
              <DialogRoot open={isSizeGuideOpen} onOpenChange={(details) => {
                if (!details.open) {
                  handleCloseSizeGuide();
                }
              }}
                size={{ base: "sm", md: "lg" }}
              >
                <DialogContent  >
                  <DialogHeader>
                    <Box display="flex" justifyContent="flex-end">
                      <Button
                        aria-label="Close modal"
                        variant="ghost"
                        onClick={handleCloseSizeGuide}
                      >
                        <FiX />
                      </Button>

                    </Box>
                    <Text as="h3" fontSize="lg" fontFamily={"Archivo Black"} color={textColor} fontWeight={"100"}>Guía de talles</Text>
                  </DialogHeader>
                  <DialogBody
                  >
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      maxH={{ base: "60vh", md: "100%" }}
                    >
                      <Image
                        src={getSizeGuideImage()}
                        alt="Guía de talles"
                        maxW="100%"
                        maxH="100%"
                        borderRadius="md"
                      />
                    </Box>
                  </DialogBody>
                </DialogContent>
              </DialogRoot>
              {/* Mobile Layout */}
              <VStack gap={4} display={{ base: 'flex', md: 'none' }}>
                {/* Main Image - Mobile */}
                <Box
                  position="relative"
                  w="100%"
                  bg={secondaryBg}
                  borderRadius="lg"
                  overflow="hidden"
                  h="500px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Image
                    src={mainImage}
                    alt={product.name}
                    maxW="100%"
                    maxH="100%"
                    objectFit="contain"
                    objectPosition="center"
                    as="img"
                    p={4}
                  />
                </Box>

                {/* Horizontal Scroll for Thumbnails on Mobile */}
                {product.images && product.images.length > 1 && (
                  <Box w="100%" overflowX="auto" py={4} m={{ base: 0, md: 4 }}>
                    <HStack gap={4} px={2}>
                      {product.images.slice(0, 3).map((img, idx) => (
                        <Box
                          key={idx}
                          borderRadius="md"
                          overflow="hidden"
                          borderWidth="2px"
                          borderColor={selectedImage === idx ? 'blue.500' : 'transparent'}
                          cursor="pointer"
                          onClick={() => setSelectedImage(idx)}
                          as="button"
                          flexShrink={0}
                          w={{ base: "20vw", md: "100px" }}
                          h={{ base: "10vh", md: "100px" }}
                          bg={secondaryBg}
                        >
                          <Image
                            w="100%"
                            h="100%"
                            src={img.image_url}
                            alt={`${product.name} view ${idx + 1}`}
                            objectFit="contain"
                            transition="opacity 0.2s"
                            _hover={{ opacity: 0.8 }}
                          />
                        </Box>
                      ))}
                      {product.images.length > 5 && (
                        <Button onClick={handleOpenModal} variant="ghost" size="lg">
                          +{product.images.length - 4}
                        </Button>
                      )}
                    </HStack>
                  </Box>
                )}
              </VStack>
            </Box>

            {/* Product Details */}
            <VStack align="stretch" gap={6} p={{ base: 2, md: "" }} color={textColor}>
              <Box>
                <HStack justify="space-between">
                  <Heading letterSpacing={"tighter"} as="h1" size={{ base: "xl", md: "2xl" }} color={textColor}>
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
                    fontSize={{ base: "2xl", md: "4xl" }}
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
                    onClick={handleOpenSizeGuide}
                  >
                    Guía de talles
                  </Text>
                </HStack>

                <HStack gap={{ base: 2, md: 6 }} justify="center" w="full" mt={6}>
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
                          p={{ base: 2, md: 5 }}
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
                  size={{ base: "lg", md: "xl" }}
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
                  fontSize={{ base: "sm", md: "md" }}
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
                <Text
                  color={textColor}
                  fontSize="lg"
                  mt={5}
                  letterSpacing="tighter"
                  mb={8}
                  lineHeight="tall"
                  as="p"
                >
                  {product.description}
                </Text>

                <VStack mt={6} gap={4} m={"auto"} as="section" w={{ base: "95%", md: "full" }} >
                  <Accordion.Root collapsible>
                    {[
                      {
                        value: "measures",
                        title: "Medidas",
                        content:
                          <Image
                            src={getSizeGuideImage()}
                            alt="Guía de talles"
                            maxW="100%"
                            maxH="100%"
                            borderRadius="md"
                          />
                      },
                      { value: "shipping", title: "Envíos", content: "Realizamos envíos a todo el país. El costo depende de la ubicación." },
                      { value: "payment", title: "Métodos de pago", content: "Aceptamos tarjetas de débito, crédito y transferencias bancarias." },
                      { value: "returns", title: "Devoluciones", content: "Devoluciones en menos de 14 días." }
                    ].map((item) => (
                      <Accordion.Item
                        key={item.value}
                        value={item.value}
                        borderBottomWidth="1px"
                      >
                        <AccordionItemTrigger
                          w="full"
                          py={4}
                          transition="all 0.2s"
                          _hover={{ bg: colorMode === "dark" ? "gray.700" : "gray.100" }}
                          borderRadius="md"
                        >
                          <Box
                            as="span"
                            flex="1"
                            textAlign="left"
                            color={textColor}
                            fontWeight="600"
                            fontSize="md"
                            display="flex"
                            px={2}
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            {item.title}
                          </Box>
                        </AccordionItemTrigger>
                        <AccordionItemContent
                          pb={4}
                          pt={2}
                        >
                          <Text
                            color={textColor}
                            fontSize="md"
                            lineHeight="tall"
                            opacity="0.9"
                            as="p"
                            p={6}
                          >
                            {item.content}
                          </Text>
                        </AccordionItemContent>
                      </Accordion.Item>
                    ))}
                  </Accordion.Root>
                </VStack>
              </Box>
            </VStack>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};