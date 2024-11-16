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
import { FaShoppingCart, FaTrash } from 'react-icons/fa';
import {  useColorModeValue } from '../components/ui/color-mode';

const CartDialog = () => {
  const borderColor = useColorModeValue('gray.400', 'gray.600');
  const dispatch = useDispatch();
  const cartItems = useSelector((state: { cart: { items: { id: string; name: string; price: number; quantity: number; }[]; }; }) => state.cart.items);

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
          >
            <FaShoppingCart />
          </IconButton>
          {cartItems.length > 0 && (
            <Box
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
            </Box>
          )}
        </Box>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Carrito de Compras</DialogTitle>
        </DialogHeader>

        <DialogBody className="pb-8">
          {cartItems.length === 0 ? (
            <Text className="text-center py-4">
              El carrito está vacío
            </Text>
          ) : (
            <VStack gap="4" align="stretch">
              {cartItems.map((item) => (
                <Flex key={item.id} justify="space-between" align="center">
                  <Box flex="1">
                    <Text className="font-medium">{item.name}</Text>
                    <Text className="text-sm text-gray-500">
                      Cantidad: {item.quantity}
                    </Text>
                    <Text>${(item.price * item.quantity).toFixed(2)}</Text>
                  </Box>
                  <IconButton
                    aria-label="Remove item"
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <FaTrash />
                  </IconButton>
                </Flex>
              ))}
              <Box as="hr" my={4} borderColor={borderColor} />

              <Flex justify="space-between" align="center" className="py-2">
                <Text className="font-bold">Total:</Text>
                <Text className="font-bold">${totalAmount.toFixed(2)}</Text>
              </Flex>

              <VStack gap="3" className="w-full">
                {cartItems.length > 0 && (
                  <>
                    <Link href="/checkout" passHref style={{ width: '100%' }}>
                      <Button
                        className="w-full"
                        variant="solid"
                      >
                        Ir a pagar
                      </Button>
                    </Link>
                    <Button
                      variant="solid"
                      onClick={handleClearCart}
                      className="w-full"
                    >
                      Vaciar carrito
                    </Button>
                  </>
                )}
                <DialogCloseTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full"
                  >
                    Cerrar
                  </Button>
                </DialogCloseTrigger>
              </VStack>
            </VStack>
          )}
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default CartDialog;