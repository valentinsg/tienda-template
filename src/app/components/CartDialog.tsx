import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { decrementItem, incrementItem, setCheckoutAllowed } from '../store/slices/cartSlice';
import Link from 'next/link';
import {
  Box,
  Button,
  Flex,
  Text,
  VStack,
  IconButton,
  HStack,
  chakra,
  Image,
} from '@chakra-ui/react';
import {
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogCloseTrigger,
} from '../components/ui/dialog';
import { CloseButton } from './ui/close-button';
import { FaShoppingCart, FaPlus, FaMinus, FaTruck } from 'react-icons/fa';
import { useColorModeValue } from '../components/ui/color-mode';
import { motion } from 'framer-motion';
import {
  ProgressBar,
  ProgressLabel,
  ProgressRoot,
  ProgressValueText,
} from "./ui/progress";

// #region Types & Constants
type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
};

const FREE_SHIPPING_THRESHOLD = 120000;
const MotionBox = chakra(motion.div);
const MotionFlex = chakra(motion.div);
// #endregion

const CartDialog = forwardRef((_props, ref) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: { cart: { items: CartItem[] } }) => state.cart.items);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    setIsDialogOpen
  }));
  // #endregion

  // #region Theme
  const theme = {
    text: useColorModeValue('#555454', '#D0D0D0'),
    mutedText: useColorModeValue('gray.600', 'gray.400'),
    border: useColorModeValue('gray.200', 'gray.700'),
    hover: useColorModeValue('gray.50', 'gray.700'),
    card: useColorModeValue('white', 'gray.800'),
    progress: {
      bg: useColorModeValue('gray.100', 'gray.700'),
      filled: useColorModeValue('#555454', '#D0D0D0'),
    }
  };

  // #endregion

  // #region Calculations
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingProgress = Math.min((totalAmount / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const freeShippingQualified = totalAmount >= FREE_SHIPPING_THRESHOLD;

  // #endregion

  // #region Handlers
  const handleDecrement = (id: string) => dispatch(decrementItem(id));
  const handleIncrement = (id: string) => dispatch(incrementItem(id));

  // #endregion

  // #region Render Helpers
  const renderCartIcon = () => (
    <Box position="relative">
      <IconButton aria-label="Shopping Cart" variant="ghost" colorScheme="gray" _hover={{ bg: theme.hover }} h="48px" w="48px">
        <FaShoppingCart />
      </IconButton>
      {cartItems.length > 0 && (
        <MotionBox initial={{ scale: 0.5 }} animate={{ scale: 1 }} position="absolute" top="-1" right="-1" bg={"red.500"} color="white" borderRadius="full" w="4" h="4" display="flex" alignItems="center" justifyContent="center" fontSize="sm" fontWeight="bold">
          {cartItems.length}
        </MotionBox>
      )}
    </Box>
  );

  const renderShippingProgress = () => (
    <Box borderRadius="lg" w={'100%'} p={2}>
      <Flex gap="3" mb="3">
        <Box as={FaTruck} color={freeShippingQualified ? 'green.500' : theme.text} fontSize={"xl"} />
        <Text fontSize="md" fontWeight="medium" color={theme.text}>
          {freeShippingQualified ? "Contás con envío gratis " : `Gastando $${(FREE_SHIPPING_THRESHOLD - totalAmount).toLocaleString()} más, tenes envío gratis.`}
        </Text>
      </Flex>
      <ProgressRoot value={shippingProgress} size="md" borderRadius="full" mt={6}>
        <HStack gap={6} w="100%">
          <ProgressLabel fontSize={"md"} color={theme.text}>Envío gratis </ProgressLabel>
          <ProgressBar flex="1" colorPalette={"blue"} />
          <ProgressValueText fontSize={"md"} color={theme.text}>{`${Math.round(shippingProgress)}%`}</ProgressValueText>
        </HStack>
      </ProgressRoot>
    </Box>
  );

  const renderCartItem = (item: CartItem) => (
    <MotionFlex key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} w="100%" p="4" bg={theme.card} borderWidth="2px" borderColor={theme.border} borderRadius="lg" transition="all 0.2s" _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}>
      <Flex gap="4" width="100%" flexDir={{ base: "column", md: "row" }} alignItems="center">
        
        <Box display="flex" gap="4" alignItems={"center"}>
          <Box overflow="hidden" borderRadius="lg" w={{ base: "80px", md: "95px" }} h={{ base: "70px", md: "80px" }}>
            <Image src={item.imageUrl || '/placeholder.jpg'} alt={item.name} w="full" h="full" objectFit={{ base: "fill", md: "cover" }} transition="transform 0.2s" _hover={{ transform: 'scale(1.05)' }} />
          </Box>
          <VStack align="start" flex="1" gap="2">
            <Text fontWeight="medium" color={theme.text} fontSize={{ base: "sm", md: "md" }}>{item.name}</Text>
            <Text fontWeight="bold" color={theme.text} fontSize="lg">${(item.price * item.quantity).toLocaleString()}</Text>
          </VStack>
        </Box>

        <HStack bg={theme.hover} p="2" borderRadius="lg" gap="3" justifyContent={"center"}>
          <IconButton aria-label="Decrease quantity" size="sm" variant="ghost" onClick={() => handleDecrement(item.id)}>
            <FaMinus />
          </IconButton>
          <Text color={theme.text} fontSize="md" minW="8" textAlign="center" fontWeight="medium">{item.quantity}</Text>
          <IconButton aria-label="Increase quantity" size="sm" variant="ghost" onClick={() => handleIncrement(item.id)}>
            <FaPlus />
          </IconButton>
        </HStack>
      </Flex>
    </MotionFlex>
  );

  // #endregion

  return (
    <DialogRoot open={isDialogOpen} onOpenChange={(details) => setIsDialogOpen(details.open)} size={{ base: "xs", md: 'lg' }}>
      <DialogTrigger asChild>{renderCartIcon()}</DialogTrigger>
      <DialogContent >
        <DialogHeader>
          <Flex justify='space-between' align='center' w='100%' pb='4' borderBottom='1px' borderColor={theme.border}>
            <DialogTitle>
              <Text fontSize='2xl' letterSpacing={"tighter"} fontFamily={"Archivo Black"} color={theme.text}>Tú Carrito</Text>
            </DialogTitle>
            <DialogCloseTrigger asChild><CloseButton size='xl' /></DialogCloseTrigger>
          </Flex>
        </DialogHeader>

        <DialogBody >
          {cartItems.length === 0 ? (
            <VStack gap={{ base: "6", md: '10' }} py='20' align='center'>
              <MotionBox userSelect={"none"} initial={{ scale: .5 }} animate={{ scale: 1 }} fontSize='7xl' >🛒</MotionBox>
              <Text color={theme.mutedText} mt={4} fontSize={"md"}>Tú BusyCarrito está vacío, ocúpate de él</Text>
              <DialogCloseTrigger asChild>
                <Link href='/products' passHref>
                  <Button colorPalette={"blue"} size='lg' p={4} onClick={() => setIsDialogOpen(false)}>
                    Empezá a comprar
                  </Button>
                </Link>
              </DialogCloseTrigger>
            </VStack>
          ) : (
            <VStack gap='10'>
              {renderShippingProgress()}
              {cartItems.map(renderCartItem)}
              <Box w='100%' pt='6' borderTop='1px' borderColor={theme.border}>
                <Flex justify='space-between' align='center' mb='6'>
                  <Text fontSize='xl' color={theme.text}>Total</Text>
                  <Text fontSize='2xl' fontWeight='bold' color={theme.text}>${totalAmount.toLocaleString()}</Text>
                </Flex>

                <VStack gap='4'>

                  <Link
                    href='/checkout'
                    passHref
                    style={{ width: '100%' }}
                    onClick={() => {
                      dispatch(setCheckoutAllowed(true));
                      setIsDialogOpen(false);
                    }}
                  >
                    <Button w='100%' colorPalette={"blue"} size='lg' h='16' fontSize='lg' _hover={{ opacity: .9 }}>
                      Ir a pagar
                    </Button>
                  </Link>
                </VStack>
              </Box>
            </VStack>
          )}
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
});

CartDialog.displayName = 'CartDialog';

export default CartDialog;
