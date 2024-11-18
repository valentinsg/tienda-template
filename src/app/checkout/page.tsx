'use client';
import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, Flex, Input, Text, VStack, HStack, Select, RadioGroup } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import GooglePlacesAutocomplete from "react-places-autocomplete";
import { useColorModeValue } from '../components/ui/color-mode';

const FREE_SHIPPING_THRESHOLD = 120000;

const Checkout = () => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const cartItems = useSelector((state) => state.cart.items);

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = totalAmount >= FREE_SHIPPING_THRESHOLD ? 0 : 1500; // Envío gratis si aplica
  const finalTotal = totalAmount + shippingCost;

  const onSubmit = (data) => {
    console.log('Datos del Cliente:', data);
    // Lógica para procesar el pago (se desarrollará después)
  };

  return (
    <Flex maxW="6xl" mx="auto" mt={8} p={4} gap={8}>
      {/* Columna Izquierda */}
      <Box flex="1" p={4} borderWidth="1px" borderRadius="md">
        <Text fontSize="2xl" fontWeight="bold" mb={4}>Información del Cliente</Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack gap={4} align="stretch">
            {/* Nombre Completo */}
            <Box>
              <Text>Nombre Completo</Text>
              <Input
                placeholder="John Doe"
                {...control.register("fullName", { required: "Este campo es obligatorio" })}
              />
              {errors.fullName && <Text color="red.500">{errors.fullName.message}</Text>}
            </Box>

            {/* Edad */}
            <Box>
              <Text>Edad</Text>
              <Input
                type="number"
                placeholder="30"
                {...control.register("age", { required: "Este campo es obligatorio" })}
              />
              {errors.age && <Text color="red.500">{errors.age.message}</Text>}
            </Box>

            {/* Teléfono */}
            <Box>
              <Text>Número de Teléfono</Text>
              <Input
                type="tel"
                placeholder="+54 223 1234567"
                {...control.register("phone", { required: "Este campo es obligatorio" })}
              />
              {errors.phone && <Text color="red.500">{errors.phone.message}</Text>}
            </Box>

            {/* Dirección de Envío */}
            <Box>
              <Text>Dirección de Envío</Text>
              <GooglePlacesAutocomplete
                selectProps={{
                  onChange: (value) => console.log(value.label), // Aquí guardas la dirección seleccionada
                  placeholder: "1234 Main Street",
                }}
              />
            </Box>

            {/* Método de Entrega */}
            <Box>
              <Text>Método de Entrega</Text>
              <RadioGroup defaultValue="homeDelivery">
                <HStack gap={4}>
                  <Radio value="homeDelivery">Domicilio</Radio>
                  <Radio value="pickupPoint">Punto de Entrega</Radio>
                </HStack>
              </RadioGroup>
            </Box>

            {/* Método de Pago */}
            <Box>
              <Text>Método de Pago</Text>
              <Select {...control.register("paymentMethod", { required: "Este campo es obligatorio" })}>
                <option value="creditCard">Tarjeta de Crédito</option>
                <option value="debitCard">Tarjeta de Débito</option>
                <option value="transfer">Transferencia</option>
              </Select>
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
        <Text fontSize="2xl" fontWeight="bold" mb={4}>Resumen de Compra</Text>
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
