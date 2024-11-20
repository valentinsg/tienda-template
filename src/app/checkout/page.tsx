'use client';

import React, { useEffect, useMemo, useState } from 'react';
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
import { ClientData } from '../../types/client/ClientData';
import { AndreaniBranch } from "../../types/checkout/shipping/AndreaniBranch";
import { useColorModeValue } from '../components/ui/color-mode';
import { SelectRoot, SelectItem, SelectTrigger, SelectValueText, SelectContent } from '../components/ui/select';

const FREE_SHIPPING_THRESHOLD = 120000;

const HOME_SHIPPING_COST = 9500;
const BRANCH_SHIPPING_COST = 8000;

const PROVINCES = [
  "Buenos Aires",
  "Ciudad Autónoma de Buenos Aires",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
];

const paymentMethods = [
  { label: "Tarjeta de Crédito", value: "creditCard" },
  { label: "Tarjeta de Débito", value: "debitCard" },
  { label: "Transferencia", value: "transfer" },
];

const Checkout = () => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ClientData>();
  const cartItems = useSelector(selectCartItems);
  const [, setBranches] = useState<AndreaniBranch[]>([]);
  const [, setLoadingBranches] = useState(false);

  const [selectedProvince, setSelectedProvince] = useState<string[] | null>(null);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<'home' | 'branch'>('home');

  const postalCode = watch('postal_code');

  // Calcular totales
  const { totalAmount, shippingCost, finalTotal } = useMemo(() => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = selectedShippingMethod === 'home' ? HOME_SHIPPING_COST : BRANCH_SHIPPING_COST;
    return {
      totalAmount: total,
      shippingCost: total >= FREE_SHIPPING_THRESHOLD ? 0 : shipping,
      finalTotal: total + (total >= FREE_SHIPPING_THRESHOLD ? 0 : shipping),
    };
  }, [cartItems, selectedShippingMethod]);

  // Fetch branches when shipping method is "branch"
  const fetchBranches = async () => {
    if (!selectedProvince || !postalCode) return;
    setLoadingBranches(true);
    try {
      const response = await fetch(`/api/andreani-branches?province=${selectedProvince}&postalCode=${postalCode}`);
      const data = await response.json();
      setBranches(data);
    } catch (error) {
      console.error("Error fetching branches:", error);
      setBranches([]);
    } finally {
      setLoadingBranches(false);
    }
  };

  useEffect(() => {
    if (shippingMethod === 'branch') {
      fetchBranches();
    }
  }, [selectedProvince, postalCode, shippingMethod]);

  // Handle form submission
  const onSubmit = (data: ClientData) => {
    console.log('Datos del Cliente:', data);
    // Aquí puedes enviar los datos a un backend o manejarlos como desees
  };

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

            {/* Provincia */}
            <Box>
              <Text>Provincia</Text>
              <SelectRoot
                value={selectedProvince || []}
                onValueChange={(e) => setSelectedProvince(e.value)}
              >
                <SelectTrigger>
                  <SelectValueText placeholder="Seleccione una provincia" />
                </SelectTrigger>
                <SelectContent>
                  {PROVINCES.map((province) => (
                    <SelectItem key={province} value={province}>
                      {province}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
              {errors.province && <Text color="red.500">{errors.province.message}</Text>}
            </Box>

            {/* Código Postal */}
            <Box>
              <Text>Código Postal</Text>
              <Input
                placeholder="7600"
                {...register("postal_code", { required: "Este campo es obligatorio" })}
              />
              {errors.postal_code && <Text color="red.500">{errors.postal_code.message}</Text>}
            </Box>

            {/* Método de Pago */}
            <Box>
              <Text>Método de Pago</Text>
              <SelectRoot
                onValueChange={(value) => setValue('paymentMethod', value, { shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValueText placeholder="Seleccione un método de pago" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
              {errors.paymentMethod && <Text color="red.500">{errors.paymentMethod.message}</Text>}
            </Box>

            {/* Botón de Envío */}
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
          <Flex justify="space-between">
            <Text>Subtotal</Text>
            <Text>${totalAmount.toLocaleString()}</Text>
          </Flex>
          <Flex justify="space-between">
            <Text>Envío</Text>
            <Text>{shippingCost === 0 ? "Gratis" : `$${shippingCost}`}</Text>
          </Flex>
          <Box as="hr" my={4} borderColor={useColorModeValue('gray.400', 'gray.600')} />
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
