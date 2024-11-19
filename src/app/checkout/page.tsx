'use client';

import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectCartItems } from '../store/slices/cartSlice';
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { ClientData } from '../../types/ClientData';
import { useColorModeValue } from '../components/ui/color-mode';
import { SelectContent, SelectItem, SelectLabel, SelectRoot } from '../components/ui/select';

//#region Constantes
const FREE_SHIPPING_THRESHOLD = 120000;
const SHIPPING_COST = 12500;

const paymentMethods = {
  methods: [
    { label: "Tarjeta de Crédito", value: "creditCard" },
    { label: "Tarjeta de Débito", value: "debitCard" },
    { label: "Transferencia", value: "transfer" },
  ],
};
//#endregion

const Checkout = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ClientData>();

  //#region Redux: Selección del carrito
  const cartItems = useSelector(selectCartItems);

  // Calcular totales
  const { totalAmount, shippingCost, finalTotal } = useMemo(() => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = total >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    return {
      totalAmount: total,
      shippingCost: shipping,
      finalTotal: total + shipping,
    };
  }, [cartItems]);
  //#endregion

  //#region Submit Handler
  const onSubmit = (data: ClientData) => {
    console.log('Datos del Cliente:', data);
  };
  //#endregion

  return (
    <Flex maxW="6xl" mx="auto" mt={8} p={4} gap={8} direction={{ base: 'column', md: 'row' }}>
      {/* Columna Izquierda */}
      <Box flex="1" p={4} borderWidth="1px" borderRadius="md">
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          Información del Cliente
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack gap={4} align="stretch">
            {/* Nombre Completo */}
            <Box>
              <Text>Nombre Completo</Text>
              <Input
                placeholder="John Doe"
                {...register("fullName", { required: "Este campo es obligatorio" })}
              />
              {errors.fullName && <Text color="red.500">{errors.fullName.message}</Text>}
            </Box>

            {/* Teléfono */}
            <Box>
              <Text>Número de Teléfono</Text>
              <Input
                type="tel"
                placeholder="+54 223 1234567"
                {...register("phone", { required: "Este campo es obligatorio" })}
              />
              {errors.phone && <Text color="red.500">{errors.phone.message}</Text>}
            </Box>

            {/* Dirección de Envío */}
            <Box>
              <Text>Dirección de Envío</Text>
              <Input
                type="text"
                placeholder="Calle Falsa 1234"
                {...register("address", { required: "Este campo es obligatorio" })}
              />
              {errors.address && <Text color="red.500">{errors.address.message}</Text>}
            </Box>

            {/* Método de Pago */}
            <Box>
              <Text>Método de Pago</Text>
              <SelectRoot {...control.register("paymentMethod", { required: "Este campo es obligatorio" })}>
                <SelectLabel>Método de Pago</SelectLabel>
                <SelectContent>
                  {paymentMethods.methods.map((method) => (
                    <SelectItem item={method} key={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
              {errors.paymentMethod && <Text color="red.500">{errors.paymentMethod.message}</Text>}
            </Box>
            <Button type="submit" colorScheme="blue" size="lg" w="full">
              Proceder al Pago
            </Button>
          </VStack>
        </form>
      </Box>

      {/* Columna Derecha */}
      <Box flex="1" p={4} borderWidth="1px" borderRadius="md">
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          Resumen de Compra
        </Text>
        <VStack gap={4} align="stretch">
          {/* Lista de Productos */}
          {cartItems.map((item) => (
            <Flex key={item.id} justify="space-between">
              <Text>{item.name}</Text>
              <Text>${(item.price * item.quantity).toLocaleString()}</Text>
            </Flex>
          ))}

          <Box as="hr" my={4} borderColor={useColorModeValue('gray.400', 'gray.600')} />

          {/* Costos */}
          <Flex justify="space-between">
            <Text>Subtotal</Text>
            <Text>${totalAmount.toLocaleString()}</Text>
          </Flex>
          <Flex justify="space-between">
            <Text>Envío</Text>
            <Text>{shippingCost === 0 ? "Gratis" : `$${shippingCost}`}</Text>
          </Flex>
          <Box as="hr" my={4} borderColor={useColorModeValue('gray.400', 'gray.600')} />

          {/* Total */}
          <Flex justify="space-between" fontWeight="bold">
            <Text>Total</Text>
            <Text>${finalTotal.toLocaleString()}</Text>
          </Flex>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Checkout;
