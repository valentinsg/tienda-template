import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeItem, clearCart } from '../store/slices/cartSlice';
import Link from 'next/link';
import {
  Box,
  Button,
  Flex,
  Text,
  VStack,
  IconButton,
  HStack,
} from '@chakra-ui/react';
import {
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogCloseTrigger,
  DialogDescription,
} from '../components/ui/dialog';
import { FaShoppingCart, FaTrash } from 'react-icons/fa';
import { useColorModeValue } from '../components/ui/color-mode';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const CartDialog = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: { cart: { items: { id: string; name: string; price: number; quantity: number; }[]; }; }) => state.cart.items);

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Theme colors
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  const handleRemoveItem = (id: string) => {
    dispatch(removeItem(id));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <Box position="relative">
          <IconButton
            aria-label="Shopping Cart"
            variant="ghost"
            colorScheme="gray"
            _hover={{ bg: hoverBg }}
          >
            <FaShoppingCart />
          </IconButton>
          {cartItems.length > 0 && (
            <MotionBox
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              position="absolute"
              top="-2"
              right="-2"
              bg="red.500"
              color="white"
              borderRadius="full"
              w="5"
              h="5"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="xs"
            >
              {cartItems.length}
            </MotionBox>
          )}
        </Box>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Your Shopping Cart</DialogTitle>
          <DialogDescription>
            {cartItems.length === 0 ?
              'Your cart is empty' :
              `You have ${cartItems.length} item${cartItems.length === 1 ? '' : 's'} in your cart`
            }
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="pb-8">
          {cartItems.length === 0 ? (
            <VStack gap={4} py={8}>
              <Box fontSize="6xl">🛒</Box>
              <Text color={mutedTextColor}>
                Start shopping to add items to your cart
              </Text>
            </VStack>
          ) : (
            <VStack gap={4}>
              {cartItems.map((item) => (
                <MotionBox
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  w="100%"
                  p={3}
                  borderWidth="1px"
                  borderColor={borderColor}
                  borderRadius="md"
                  _hover={{ bg: hoverBg }}
                  transition="all 0.2s"
                >
                  <HStack justify="space-between">
                    <VStack align="start" gap={1}>
                      <Text fontWeight="medium" color={textColor}>
                        {item.name}
                      </Text>
                      <HStack gap={4}>
                        <Text color={mutedTextColor} fontSize="sm">
                          Qty: {item.quantity}
                        </Text>
                        <Text fontWeight="bold" color={textColor}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </Text>
                      </HStack>
                    </VStack>
                    <IconButton
                      aria-label="Remove item"
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <FaTrash />
                    </IconButton>
                  </HStack>
                </MotionBox>
              ))}

              <Box as="hr" my={4} borderColor={borderColor} />


              <Flex justify="space-between" align="center" w="100%" py={2}>
                <Text fontWeight="semibold" color={textColor}>Total:</Text>
                <Text fontWeight="bold" fontSize="xl" color={textColor}>
                  ${totalAmount.toFixed(2)}
                </Text>
              </Flex>

              <VStack gap={3} w="100%" pt={4}>
                <Link href="/checkout" passHref style={{ width: '100%' }}>
                  <Button
                    w="100%"
                    colorScheme="blue"
                    size="lg"
                  >
                    Checkout
                  </Button>
                </Link>

                <HStack w="100%" gap={2}>
                  <Button
                    variant="outline"
                    colorScheme="red"
                    size="sm"
                    onClick={handleClearCart}
                    flex={1}
                  >
                    Clear Cart
                  </Button>
                  <DialogCloseTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      flex={1}
                    >
                      Continue Shopping
                    </Button>
                  </DialogCloseTrigger>
                </HStack>
              </VStack>
            </VStack>
          )}
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default CartDialog;