import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { decrementItem, incrementItem, clearCart } from '../store/slices/cartSlice';
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

const CartDialog = () => {
  // #region Hooks & State
  const dispatch = useDispatch();
  const cartItems = useSelector((state: { cart: { items: CartItem[] } }) => state.cart.items);
  
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
  const handleClearCart = () => dispatch(clearCart());
  
  // #endregion

  // #region Render Helpers
  const renderCartIcon = () => (
    <Box position="relative">
      <IconButton aria-label="Shopping Cart" variant="ghost" colorScheme="gray" _hover={{ bg: theme.hover }} h="48px" w="48px">
        <Box as={FaShoppingCart} w="24px" h="24px" color={theme.text} />
      </IconButton>
      {cartItems.length > 0 && (
        <MotionBox initial={{ scale: 0.5 }} animate={{ scale: 1 }} position="absolute" top="-2" right="-2" bg={theme.text} color="white" borderRadius="full" w="6" h="6" display="flex" alignItems="center" justifyContent="center" fontSize="sm" fontWeight="bold">
          {cartItems.length}
        </MotionBox>
      )}
    </Box>
  );

  const renderShippingProgress = () => (
    <Box mb="8" p="4" bg={theme.hover} borderRadius="lg">
      <Flex align="center" gap="3" mb="3">
        <Box as={FaTruck} color={freeShippingQualified ? 'green.500' : theme.text} />
        <Text fontSize="sm" fontWeight="medium">
          {freeShippingQualified ? "🎉 You've qualified for free shipping!" : `$${(FREE_SHIPPING_THRESHOLD - totalAmount).toLocaleString()} away from free shipping`}
        </Text>
      </Flex>
      <ProgressRoot value={shippingProgress} size="sm" borderRadius="full" bg={theme.progress.bg}>
        <HStack gap="5">
          <ProgressLabel>Free Shipping</ProgressLabel>
          <ProgressBar flex="1" />
          <ProgressValueText>{`${Math.round(shippingProgress)}%`}</ProgressValueText>
        </HStack>
      </ProgressRoot>
    </Box>
  );

  const renderCartItem = (item: CartItem) => (
    <MotionFlex key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} w="100%" p="5" bg={theme.card} borderWidth="1px" borderColor={theme.border} borderRadius="lg" transition="all 0.2s" _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}>
      <HStack gap="6" width="100%">
        <Box overflow="hidden" borderRadius="lg" w="80px" h="80px">
          <Image src={item.imageUrl || '/placeholder.jpg'} alt={item.name} w="full" h="full" objectFit="cover" transition="transform 0.2s" _hover={{ transform: 'scale(1.05)' }} />
        </Box>
        <VStack align="start" flex="1" gap="2">
          <Text fontWeight="medium" color={theme.text} fontSize="lg">{item.name}</Text>
          <Text fontWeight="bold" color={theme.text} fontSize="xl">${(item.price * item.quantity).toLocaleString()}</Text>
        </VStack>
        <HStack bg={theme.hover} p="2" borderRadius="lg" gap="3">
          <IconButton aria-label="Decrease quantity" size="sm" variant="ghost" onClick={() => handleDecrement(item.id)}>
            <FaMinus />
          </IconButton>
          <Text color={theme.text} fontSize="md" minW="8" textAlign="center" fontWeight="medium">{item.quantity}</Text>
          <IconButton aria-label="Increase quantity" size="sm" variant="ghost" onClick={() => handleIncrement(item.id)}>
            <FaPlus />
          </IconButton>
        </HStack>
      </HStack>
    </MotionFlex>
  );

 // #endregion

 return (
   <DialogRoot>
     <DialogTrigger asChild>{renderCartIcon()}</DialogTrigger>
     <DialogContent className='sm:max-w-[550px]'>
       <DialogHeader>
         <Flex justify='space-between' align='center' w='100%' pb='4' borderBottom='1px' borderColor={theme.border}>
           <DialogTitle>
             <Text fontSize='2xl' fontWeight='bold' color={theme.text}>Your Cart</Text>
           </DialogTitle>
           <DialogCloseTrigger asChild><CloseButton size='lg' /></DialogCloseTrigger>
         </Flex>
       </DialogHeader>

       <DialogBody>
         {cartItems.length === 0 ? (
           <VStack gap='6' py='12' align='center'>
             <MotionBox initial={{ scale: .5 }} animate={{ scale:1 }} fontSize='6xl'>🛒</MotionBox>
             <Text color={theme.mutedText}>Your cart is looking empty</Text>
             <DialogCloseTrigger asChild><Button bg={theme.text} color='white' size='lg' _hover={{ opacity:.9 }}>Start Shopping</Button></DialogCloseTrigger>
           </VStack>
         ) : (
           <VStack gap='6'>
             {renderShippingProgress()}
             {cartItems.map(renderCartItem)}
             <Box w='100%' pt='6' borderTop='1px' borderColor={theme.border}>
               <Flex justify='space-between' align='center' mb='6'>
                 <Text fontSize='lg' color={theme.text}>Total</Text>
                 <Text fontSize='2xl' fontWeight='bold' color={theme.text}>${totalAmount.toLocaleString()}</Text>
               </Flex>

               <VStack gap='4'>
                 <Link href='/checkout' passHref style={{ width:'100%' }}>
                   <Button w='100%' bg={theme.text} color='white' size='lg' h='16' fontSize='lg' _hover={{ opacity:.9 }}>Proceed to Checkout</Button>
                 </Link>

                 <HStack w='100%' gap='4'>
                   <Button variant='outline' colorScheme='red' onClick={handleClearCart} flex='1'>Clear Cart</Button>
                   <DialogCloseTrigger asChild><Button variant='outline' flex='1'>Continue Shopping</Button></DialogCloseTrigger>
                 </HStack>
               </VStack>
             </Box>
           </VStack>
         )}
       </DialogBody>
     </DialogContent>
   </DialogRoot>
 );
};

export default CartDialog;
