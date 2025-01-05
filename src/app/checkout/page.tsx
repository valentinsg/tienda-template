'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Stack,
  Text,
  Fieldset,
  Input,
  Button,
  Flex,
  Card,
  Heading,
} from '@chakra-ui/react';
import { Field } from "../components/ui/field"
import { SelectRoot, SelectTrigger, SelectValueText, SelectContent, SelectItem } from "../components/ui/select"
import { useSelector } from 'react-redux';
import { selectCartItems } from '../store/slices/cartSlice';
import { createListCollection } from "@chakra-ui/react"
import { FaHome } from 'react-icons/fa';
import { LuBuilding2 } from "react-icons/lu"
import { AndreaniBranch } from "../../types/checkout/shipping/AndreaniBranch"
import { supabase } from '../supabase';
import { useColorMode, useColorModeValue } from '../components/ui/color-mode';

// Types
interface PersonalInfo {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  age: string;
  gender?: string;
}

interface HomeShippingDetails {
  address: string;
  province: string;
  postalCode: string;
  city: string;
}

// Constants
const provinces = createListCollection({
  items: [
    "Buenos Aires", "Ciudad Autónoma de Buenos Aires", "Catamarca", "Chaco",
    "Chubut", "Córdoba", "Corrientes", "Entre Ríos", "Formosa", "Jujuy",
    "La Pampa", "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro",
    "Salta", "San Juan", "San Luis", "Santa Cruz", "Santa Fe",
    "Santiago del Estero", "Tierra del Fuego", "Tucumán"
  ]
})

const Checkout: React.FC = () => {
  // State Management
  const cartItems = useSelector(selectCartItems);
  const [andreaniBranches, setAndreaniBranches] = useState<AndreaniBranch[]>([]);
  const textColor = useColorModeValue('#555454', '#D0D0D0');
  const { colorMode } = useColorMode();
  const buttonColor = useColorModeValue('blue.500', 'blue.300');
  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountError, setDiscountError] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);

  const validDiscountCodes = [
    'HastaElFinDeLosTiempos',
    'KeepCalmAndStayBusy',
    'DosAmigosUnaVision'
  ];

  const handleApplyDiscount = () => {
    if (discountApplied) {
      alert("El descuento ya ha sido aplicado.");
      return;
    }
    setShowDiscountInput(true);
  };

  const validateDiscountCode = () => {
    if (validDiscountCodes.includes(discountCode)) {
      setDiscountApplied(true);
      setDiscountError('');
      setShowDiscountInput(false);
    } else {
      setDiscountError('Código de descuento inválido');
    }
  };

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    gender: ''
  });

  const [shippingMethod, setShippingMethod] = useState<'home' | 'branch'>('home');

  const [homeShippingDetails, setHomeShippingDetails] = useState<HomeShippingDetails>({
    address: '',
    province: '',
    postalCode: '',
    city: '',
  });
  const [branchShippingDetails, setBranchShippingDetails] = useState<AndreaniBranch>({
    id: '',
    province: '',
    postalCode: '',
    name: '',
  });

  // Fetch Branches
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const { data, error } = await supabase
          .from('andreani_branches')
          .select('*');

        if (error) {
          throw error;
        }

        setAndreaniBranches(data as AndreaniBranch[]);
      } catch (error) {
        console.error('Error fetching Andreani branches:', error);
      }
    };

    if (shippingMethod === 'branch') {
      fetchBranches();
    }
  }, [shippingMethod]);

  const handleCheckout = async () => {
    try {
      console.log('Sending payment request with:', {
        cartItems,
        totalPrice: calculateTotalPrice()
      });

      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems,
          totalPrice: calculateTotalPrice(),
        }),
      });

      const data = await response.json();
      console.log('Payment response:', data);

      if (data.initPoint) {
        window.location.href = data.initPoint;
      } else {
        console.error('Payment error:', data.error);
        alert(data.error || 'Error al generar la preferencia de pago');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Error al procesar el pago.');
    }
  };

  // Price Calculation
  const calculateTotalPrice = () => {
    const productTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const shippingCost = shippingMethod === 'home' ? 9500 : 8000;
    const subtotal = productTotal + shippingCost;
    return discountApplied ? subtotal * 0.9 : subtotal;
  };

  return (
    <Box bg={colorMode === 'dark' ? 'gray.800' : 'bg.muted'} py={12} color={textColor} minH={"90vh"} w={"100%"} >
      <Heading textAlign="center" fontFamily={"Archivo Black"} as="h1" fontSize={{ base: "4xl", md: "4vw" }} letterSpacing={"tighter"} lineHeight={{ base: 1.2, md: "11vh" }} color={textColor}>
        Checkout
      </Heading>

      <Stack justifyContent={"center"} direction={{ base: 'column', md: 'row' }} p={10} gap={20}>
        {/* Checkout Form */}
        <Box w={"52%"} minH="80vh" >
          <Text fontSize="3xl" textAlign="left" m={4} fontFamily={"Archivo Black"} letterSpacing={"tighter"}>Datos Personales</Text>

          <Fieldset.Root>
            <Stack w={"100%"} m={4}>
              {/* Personal Info Section */}
              <Flex gap={6} direction={{ base: 'column', md: 'row' }} >
                <Stack flex={1}>
                  <Field label="Nombre">
                    <Input
                      value={personalInfo.name}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                      colorPalette={"blue"}
                      borderColor={buttonColor}
                    />
                  </Field>
                  <Field label="Apellido">
                    <Input
                      colorPalette={"blue"}
                      borderColor={buttonColor}
                      value={personalInfo.lastName}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                    />
                  </Field>
                  <Field label="Email">
                    <Input
                      colorPalette={"blue"}
                      borderColor={buttonColor}
                      value={personalInfo.email}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                    />
                  </Field>
                </Stack>
                <Stack flex={1}>
                  <Field label="Teléfono">
                    <Input
                      colorPalette={"blue"}
                      borderColor={buttonColor}
                      type="tel"
                      value={personalInfo.phone}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                      placeholder="Ej: +54 9 11 1234-5678"
                    />
                  </Field>
                  <Field label="Fecha de Nacimiento">
                    <Input
                      type="date"
                      colorPalette={"blue"}
                      borderColor={buttonColor}
                      value={personalInfo.age}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, age: e.target.value })}
                    />
                  </Field>
                  <Field label="Género">
                    <SelectRoot
                      collection={createListCollection({
                        items: ["Masculino", "Femenino", "Otro", "Prefiero-No-Decir"],
                      })}
                      value={personalInfo.gender ? [personalInfo.gender] : []}
                      onValueChange={(details: { value: string[] }) => setPersonalInfo({ ...personalInfo, gender: details.value[0] })}
                    >
                      <SelectTrigger >
                        <SelectValueText>
                          {() => personalInfo.gender?.replace(/-/g, ' ') || "Selecciona tu género"}
                        </SelectValueText>
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem item="Masculino">Masculino</SelectItem>
                        <SelectItem item="Femenino">Femenino</SelectItem>
                        <SelectItem item="Otro">Otro</SelectItem>
                        <SelectItem item="Prefiero-No-Decir">Prefiero no decir</SelectItem>
                      </SelectContent>
                    </SelectRoot>
                  </Field>
                </Stack>
              </Flex>

              {/* Shipping Method Section */}
              <Text fontSize="3xl" textAlign="left" fontFamily={"Archivo Black"} letterSpacing={"tighter"} mt={10}>Método de Envío</Text>

              <Flex gap={12} direction={{ base: 'row', md: 'column' }} w={"100%"} justify={"center"} mt={10} >
                <Box display={{ base: 'block', md: 'flex' }} w={"100%"} justifyContent={"center"} gap={10}>
                  {/* Home Delivery */}
                  <Card.Root
                    border={shippingMethod === 'home' ? 'filled' : 'outline'}
                    onClick={() => setShippingMethod('home')}
                    w={"50%"}
                  >
                    <Card.Header>
                      <Flex alignItems="center" gap={3}>
                        <FaHome />
                        <Text>Envío a Domicilio</Text>
                      </Flex>
                    </Card.Header>
                    {shippingMethod === 'home' && (
                      <Card.Body gap={4}>
                        <Field label="Provincia">
                          <SelectRoot
                            collection={provinces}
                            value={homeShippingDetails.province ? [homeShippingDetails.province] : []}
                            onChange={(e) => setHomeShippingDetails({
                              ...homeShippingDetails,
                              province: (e.target as HTMLSelectElement).value
                            })}
                          >
                            <SelectTrigger>
                              <SelectValueText>
                                {() => homeShippingDetails.province || "Selecciona tu provincia"}
                              </SelectValueText>
                            </SelectTrigger>
                            <SelectContent>
                              {provinces.items.map((province) => (
                                <SelectItem key={province} item={province}>
                                  {province}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </SelectRoot>
                        </Field>
                        <Field label="Ciudad">
                          <Input
                            value={homeShippingDetails.city}
                            onChange={(e) => setHomeShippingDetails({
                              ...homeShippingDetails,
                              city: e.target.value
                            })}
                          />
                        </Field>
                        <Field label="Código Postal">
                          <Input
                            value={homeShippingDetails.postalCode}
                            onChange={(e) => setHomeShippingDetails({
                              ...homeShippingDetails,
                              postalCode: e.target.value
                            })}
                          />
                        </Field>
                        <Field label="Dirección">
                          <Input
                            value={homeShippingDetails.address}
                            onChange={(e) => setHomeShippingDetails({
                              ...homeShippingDetails,
                              address: e.target.value
                            })}
                          />
                        </Field>
                      </Card.Body>
                    )}
                  </Card.Root>

                  {/* Branch Pickup */}
                  <Card.Root
                    border={shippingMethod === 'branch' ? 'filled' : 'outline'}
                    onClick={() => setShippingMethod('branch')}
                    w={"50%"}
                  >
                    <Card.Header>
                      <Flex alignItems="center" gap={3}>
                        <LuBuilding2 />
                        <Text>Retiro en Sucursal</Text>
                      </Flex>
                    </Card.Header>
                    {shippingMethod === 'branch' && (
                      <Card.Body gap={4}>
                        <Field label="Provincia">
                          <SelectRoot
                            collection={provinces}
                            value={[branchShippingDetails.province]}
                            onChange={(e) => setBranchShippingDetails({
                              ...branchShippingDetails,
                              province: (e.target as HTMLSelectElement).value
                            })}
                          >
                            <SelectTrigger>
                              <SelectValueText>
                                {() => branchShippingDetails.province || 'Selecciona provincia'}
                              </SelectValueText>
                            </SelectTrigger>
                            <SelectContent>
                              {provinces.items.map((province) => (
                                <SelectItem key={province} item={province}>
                                  {province}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </SelectRoot>
                        </Field>
                        <Field label="Ciudad">
                          <Input
                            value={branchShippingDetails.name}
                            onChange={(e) => setBranchShippingDetails({
                              ...branchShippingDetails,
                              name: e.target.value
                            })}
                          />
                        </Field>
                        <Field label="Código Postal">
                          <Input
                            value={branchShippingDetails.postalCode}
                            onChange={(e) => setBranchShippingDetails({
                              ...branchShippingDetails,
                              postalCode: e.target.value
                            })}
                          />
                        </Field>
                        <Field label="Sucursal">
                          <SelectRoot collection={createListCollection({
                            items: andreaniBranches.map(branch => branch.id)
                          })}>
                            <SelectTrigger>
                              <SelectValueText>
                                {() => 'Selecciona sucursal'}
                              </SelectValueText>
                            </SelectTrigger>
                            <SelectContent>
                              {andreaniBranches.map((branch) => (
                                <SelectItem key={branch.id} item={branch.id}>
                                  {`${branch.postalCode}, ${branch.province}, ${branch.name}, ${branch.address}`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </SelectRoot>
                        </Field>
                      </Card.Body>
                    )}
                  </Card.Root>
                </Box>
              </Flex>
            </Stack>
          </Fieldset.Root>
        </Box>

        <Box w={"28%"} minH={"35vh"} maxH={"90vh"} h={"100%"} p={4} border="1px" borderColor={useColorModeValue('gray.300', 'gray.700')} borderRadius="md">
          {/* Título principal */}
          <Text fontSize="3xl" textAlign="left" mb={4} fontFamily={"Archivo Black"} letterSpacing={"tighter"}>
            Carrito de compras
          </Text>
          <Box as="hr" my={4} borderColor={useColorModeValue('gray.400', 'gray.600')} />

          {/* Listado de productos */}
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            Productos en tu carrito:
          </Text>
          {cartItems.map((item) => (
            <Box key={item.id} mt={3}>
              <Text fontWeight="semibold">{item.name} x{item.quantity}</Text>
              <Text>${item.price * item.quantity}</Text>
            </Box>
          ))}
          <Box as="hr" my={6} borderColor={useColorModeValue('gray.400', 'gray.600')} />
          {/* Verificar descuentos */}
          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={2}>
              Código de descuento:
            </Text>
            {!showDiscountInput ? (
                <Button
                variant={colorMode === 'dark' ? 'solid' : 'outline'}
                w="100%"
                onClick={handleApplyDiscount}
                >
                Verificar
                </Button>
            ) : (
              <Stack gap={4}>
                <Input
                  placeholder="Ingresa el código de descuento"
                  value={discountCode}
                  colorPalette={"blue"}
                  borderColor={buttonColor}
                  onChange={(e) => setDiscountCode(e.target.value)}
                />
                {discountError && (
                  <Text color="red.500" fontSize="sm">
                    {discountError}
                  </Text>
                )}
                <Button
                  colorPalette={"blue"}
                  variant={"outline"}
                  onClick={validateDiscountCode}
                >
                  Aplicar
                </Button>
              </Stack>
            )}
            {discountApplied && (
              <Text color="green.500" mt={2}>
                ¡Descuento del 10% aplicado!
              </Text>
            )}
          </Box>
          <Box as="hr" my={6} borderColor={useColorModeValue('gray.400', 'gray.600')} />

          {/* Resumen de precios */}
          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={2}>
              Resumen:
            </Text>
            <Text>Subtotal: ${calculateTotalPrice() - (shippingMethod === 'home' ? 9500 : 8000)}</Text>
            <Text>
              {shippingMethod === 'home'
                ? 'Envío a domicilio: $9500'
                : shippingMethod === 'branch'
                  ? 'Envío a sucursal (Andreani): $8000'
                  : 'Selecciona un método de envío'}
            </Text>
            <Text fontWeight="bold" mt={2}>
              Total: ${calculateTotalPrice()}
            </Text>
          </Box>

          {/* Botón para finalizar compra */}
          <Button
            colorPalette="blue"
            onClick={handleCheckout}
            w={"100%"}
            mt={6}
          >
            Ir a pagar
          </Button>
        </Box>
      </Stack >
    </Box >
  );
};

export default Checkout;