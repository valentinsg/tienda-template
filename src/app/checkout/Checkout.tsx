import React, { useState, useEffect } from 'react';
import {
  Box,
  Stack,
  Text,
  Fieldset,
  Input,
  Button,
  Flex,
  Heading,
  VStack,
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
import { Province } from '@/types/checkout/shipping/Province';

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
  province: Province | string;
  postal_code: string;
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

const REQUIRED_FIELDS = {
  personalInfo: ['name', 'lastName', 'email', 'phone'],
  homeShipping: ['address', 'province', 'postalCode', 'city'],
  branchShipping: ['province', 'postalCode']
};

const Checkout: React.FC = () => {
  // State Management
  const cartItems = useSelector(selectCartItems);
  const [andreaniBranches, setAndreaniBranches] = useState<AndreaniBranch[]>([]);
  const textColor = useColorModeValue('#555454', '#D0D0D0');
  const { colorMode } = useColorMode();
  const buttonColor = useColorModeValue('blue.500', 'blue.300');
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountError, setDiscountError] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Validar datos personales
    if (!personalInfo.name) errors.name = 'El nombre es requerido';
    if (!personalInfo.lastName) errors.lastName = 'El apellido es requerido';
    if (!personalInfo.email) errors.email = 'El email es requerido';
    if (!personalInfo.phone) errors.phone = 'El teléfono es requerido';

    // Validar envío según método
    if (shippingMethod === 'home') {
      if (!homeShippingDetails.address) errors.address = 'La dirección es requerida';
      if (!homeShippingDetails.province) errors.province = 'La provincia es requerida';
      if (!homeShippingDetails.postal_code) errors.postalCode = 'El código postal es requerido';
      if (!homeShippingDetails.city) errors.city = 'La ciudad es requerida';
    } else {
      if (!branchShippingDetails.id) errors.branchId = 'Debe seleccionar una sucursal';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateField = (name: string, value: string) => {
    if (REQUIRED_FIELDS.personalInfo.includes(name) && !value) {
      return 'Este campo es requerido';
    }
    if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Email inválido';
    }
    if (name === 'phone' && !/^\+?[\d\s-]{10,}$/.test(value)) {
      return 'Teléfono inválido';
    }
    return '';
  };

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

  const DebugFormState = () => (
    <Box
      position="fixed"
      bottom="20px"
      right="20px"
      p={4}
      bg="gray.800"
      color="white"
      borderRadius="md"
      maxW="400px"
      maxH="500px"
      overflow="auto"
      opacity={0.9}
      fontSize="sm"
    >
      <VStack align="start" gap={4}>
        <Text fontWeight="bold">Debug - Estado del Formulario:</Text>
        <Box>
          <Text fontWeight="bold">Datos Personales:</Text>
          <pre>{JSON.stringify(personalInfo, null, 2)}</pre>
        </Box>
        <Box>
          <Text fontWeight="bold">Método de Envío:</Text>
          <Text>{shippingMethod}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Detalles de Envío:</Text>
          <pre>
            {JSON.stringify(
              shippingMethod === 'home'
                ? homeShippingDetails
                : branchShippingDetails,
              null,
              2
            )}
          </pre>
        </Box>
        <Box>
          <Text fontWeight="bold">Descuento:</Text>
          <Text>Aplicado: {discountApplied ? 'Sí' : 'No'}</Text>
          <Text>Código: {discountCode || 'No ingresado'}</Text>
          <Text fontWeight="bold">Productos en carrito:</Text>
          <pre>{JSON.stringify(cartItems, null, 2)}</pre>
        </Box>
      </VStack>
    </Box>
  );

  const [shippingMethod, setShippingMethod] = useState<'home' | 'branch'>('home');

  const [homeShippingDetails, setHomeShippingDetails] = useState<HomeShippingDetails>({
    address: '',
    province: '',
    postal_code: '',
    city: '',
  });

  const [branchShippingDetails, setBranchShippingDetails] = useState<AndreaniBranch>({
    address: '',
    province: '',
    city: '',
    postal_code: '',
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
    if (!validateForm()) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    try {
      // 1. Crear registro en Supabase primero
      const { data: paymentRecord, error: supabaseError } = await supabase
        .from('payment_records')
        .insert({
          status: 'pending',
          total_amount: calculateTotalPrice(),
          discount_applied: discountApplied,
          discount_code: discountCode || null,
          customer_name: personalInfo.name,
          customer_email: personalInfo.email,
          customer_phone: personalInfo.phone,
          shipping_method: shippingMethod,
          shipping_address: shippingMethod === 'home'
            ? homeShippingDetails
            : branchShippingDetails,
          cart_items: cartItems,
          payment_provider: 'mercadopago'
        })
        .select()
        .single();

      if (supabaseError) throw supabaseError;

      // 2. Llamar a tu API de MercadoPago existente
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems,
          totalPrice: calculateTotalPrice(),
          shippingMethod,
          shippingAddress: shippingMethod === 'home' 
            ? homeShippingDetails 
            : branchShippingDetails,
          orderId: paymentRecord.id
        }),
      });

      const data = await response.json();
      console.log('Payment response:', data);

      if (data.initPoint) {
        // Actualizar el registro con el ID de transacción antes de redirigir
        await supabase
          .from('payment_records')
          .update({
            transaction_id: data.external_reference,
            notes: 'Redirecting to payment gateway'
          })
          .eq('id', paymentRecord.id);

        window.location.href = data.initPoint;
      } else {
        throw new Error(data.error || 'Error al generar la preferencia de pago');
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

      <Stack justifyContent={"center"} direction={{ base: 'column', md: 'row' }} p={8} gap={10}>
        {/* Checkout Form */}
        <Box w={{ base: "100%", md: "52%" }} minH={{ base: "100vh", md: "80vh" }}>

          <Text fontSize="3xl" textAlign="left" m={4} fontFamily={"Archivo Black"} letterSpacing={"tighter"}>Datos Personales</Text>

          <Fieldset.Root>
            <Stack w={"100%"} mt={4}>

              {/* Personal Info Section */}
              <Flex
                bg={cardBg}
                borderColor={borderColor}
                gap={6} direction={{ base: 'column', md: 'row' }} w="100%" borderRadius="lg" borderWidth="1px" py={10} px={6}>
                <Stack flex={1} gap={4}>
                  <Field label="Nombre" required>
                    <Input
                      value={personalInfo.name}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                      placeholder="Ej: Juan"
                      borderColor={errors.name ? 'red.500' : colorMode === 'dark' ? 'gray.600' : 'gray.300'}
                      _dark={{
                        bg: 'gray.700',
                        borderColor: errors.name ? 'red.400' : 'gray.600',
                        color: 'white'
                      }}
                    />
                    {errors.name && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.name}
                      </Text>
                    )}
                  </Field>
                  <Field label="Apellido" required>
                    <Input
                      value={personalInfo.lastName}
                      placeholder='Ej: Pérez'
                      onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                      borderColor={errors.lastName ? 'red.500' : colorMode === 'dark' ? 'gray.600' : 'gray.300'}
                      _dark={{
                        bg: 'gray.700',
                        borderColor: errors.lastName ? 'red.400' : 'gray.600',
                        color: 'white'
                      }}
                    />
                    {errors.lastName && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.lastName}
                      </Text>
                    )}
                  </Field>
                  <Field label="Email" required>
                    <Input
                      value={personalInfo.email}
                      placeholder="Ej: busystreetwear@gmail.com"
                      onChange={(e) => {
                        setPersonalInfo({ ...personalInfo, email: e.target.value });
                        setErrors({ ...errors, email: validateField('email', e.target.value) });
                      }}
                      borderColor={errors.email ? 'red.500' : colorMode === 'dark' ? 'gray.600' : 'gray.300'}
                      _dark={{
                        bg: 'gray.700',
                        borderColor: errors.email ? 'red.400' : 'gray.600',
                        color: 'white'
                      }}
                    />
                    {errors.email && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.email}
                      </Text>
                    )}
                  </Field>
                </Stack>

                <Stack flex={1} gap={4}>
                  <Field label="Teléfono" required>
                    <Input
                      type="tel"
                      value={personalInfo.phone}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                      placeholder="Ej: +54 9 11 1234-5678"
                      borderColor={errors.phone ? 'red.500' : colorMode === 'dark' ? 'gray.600' : 'gray.300'}
                      _dark={{
                        bg: 'gray.700',
                        borderColor: errors.phone ? 'red.400' : 'gray.600',
                        color: 'white'
                      }}
                    />
                    {errors.phone && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.phone}
                      </Text>
                    )}
                  </Field>
                  <Field label="Fecha de Nacimiento" required>
                    <Input
                      type="date"
                      value={personalInfo.age}
                      placeholder='dd/mm/aaaa'
                      onChange={(e) => setPersonalInfo({ ...personalInfo, age: e.target.value })}
                      borderColor={errors.age ? 'red.500' : colorMode === 'dark' ? 'gray.600' : 'gray.300'}
                      _dark={{
                        bg: 'gray.700',
                        borderColor: errors.age ? 'red.400' : 'gray.600',
                        color: 'white'
                      }}
                    />
                    {errors.age && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.age}
                      </Text>
                    )}
                  </Field>
                  <Field label="Género">
                    <SelectRoot
                      collection={createListCollection({
                        items: ["Masculino", "Femenino", "Otro", "Prefiero-no-decir"],
                      })}
                      borderRadius='md'
                      value={personalInfo.gender ? [personalInfo.gender] : []}
                      onValueChange={(details: { value: string[] }) => setPersonalInfo({ ...personalInfo, gender: details.value[0] })}
                      style={{
                        border: '1px solid',
                        transition: 'border-color 0.2s',
                      }}
                    >
                      <SelectTrigger>
                        <SelectValueText>
                          {() => personalInfo.gender?.replace(/-/g, ' ') || "Selecciona tu género"}
                        </SelectValueText>
                      </SelectTrigger>

                      <SelectContent color={colorMode === 'dark' ? 'gray.200' : 'gray.800'}>
                        <SelectItem item="Masculino">Masculino</SelectItem>
                        <SelectItem item="Femenino">Femenino</SelectItem>
                        <SelectItem item="Otro">Otro</SelectItem>
                        <SelectItem item="Prefiero-no-decir">Prefiero no decir</SelectItem>
                      </SelectContent>
                    </SelectRoot>
                  </Field>
                </Stack>
              </Flex>

              {/* Shipping Method Section */}
              <Text pt={10} fontSize="3xl" textAlign="left" m={2} fontFamily={"Archivo Black"} letterSpacing={"tighter"}>Método de Envío</Text>

              <Stack w={"100%"} mt={6}>

                <Stack direction={{ base: 'column', md: 'row' }} gap={4} w="100%">
                  <Box
                    w="100%"
                    p={4}
                    borderWidth="2px"
                    borderRadius="md"
                    cursor="pointer"
                    onClick={() => setShippingMethod('home')}
                    bg={cardBg}
                    borderColor={borderColor}
                    _hover={{ borderColor: 'blue.200' }}
                  >
                    <Flex align="center" gap={3}>
                      <FaHome color={shippingMethod === 'home' ? '#3182CE' : '#718096'} />
                      <Text fontWeight="medium">Envío a Domicilio</Text>
                    </Flex>
                  </Box>

                  <Box
                    w="100%"
                    p={4}
                    borderWidth="2px"
                    borderRadius="md"
                    cursor="pointer"
                    onClick={() => setShippingMethod('branch')}
                    bg={cardBg}
                    borderColor={borderColor}
                    _hover={{ borderColor: 'blue.200' }}
                  >
                    <Flex align="center" gap={3}>
                      <LuBuilding2 color={shippingMethod === 'branch' ? '#3182CE' : '#718096'} />
                      <Text fontWeight="medium">Retiro en Sucursal</Text>
                    </Flex>
                  </Box>
                </Stack>

                <Box w="100%" bg={cardBg}
                  borderColor={borderColor} borderRadius="md" borderWidth="1px" p={6} mt={6}>
                  {shippingMethod === 'home' ? (
                    <VStack gap={8} align="stretch">
                      {/* Tus campos existentes para envío a domicilio */}
                      <Field label="Provincia" required>
                        <SelectRoot
                          collection={provinces}
                          value={homeShippingDetails.province ? [homeShippingDetails.province] : []}
                          onValueChange={(details: { value: string[] }) => setHomeShippingDetails({
                            ...homeShippingDetails,
                            province: details.value[0]
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
                      <Field label="Ciudad" required>
                        <Input
                          value={homeShippingDetails.city}
                          onChange={(e) => setHomeShippingDetails({
                            ...homeShippingDetails,
                            city: e.target.value
                          })}
                        />
                      </Field>
                      <Field label="Código Postal" required>
                        <Input
                          value={homeShippingDetails.postal_code}
                          onChange={(e) => setHomeShippingDetails({
                            ...homeShippingDetails,
                            postal_code: e.target.value
                          })}
                        />
                      </Field>
                      <Field label="Dirección" required>
                        <Input
                          value={homeShippingDetails.address}
                          onChange={(e) => setHomeShippingDetails({
                            ...homeShippingDetails,
                            address: e.target.value
                          })}
                        />
                      </Field>
                    </VStack>
                  ) : (
                    <VStack gap={8} align="stretch">
                      {/* Tus campos existentes para retiro en sucursal */}
                      <Field label="Provincia" required>
                        <SelectRoot
                          collection={provinces}
                          value={branchShippingDetails.province ? [branchShippingDetails.province] : []}
                          onValueChange={(details: { value: string[] }) => setBranchShippingDetails({
                            ...branchShippingDetails,
                            province: details.value[0]
                          })}
                        >
                          <SelectTrigger>
                            <SelectValueText>
                              {() => branchShippingDetails.province || 'Selecciona provincia'}
                            </SelectValueText>
                          </SelectTrigger>
                          <SelectContent>
                            {provinces.items.map((province) => (
                              <SelectItem key={province} item={province} color={textColor}>
                                {province}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </SelectRoot>
                      </Field>
                      <Field label="Ciudad" required>
                        <Input
                          value={branchShippingDetails.city}
                          onChange={(e) => setBranchShippingDetails({
                            ...branchShippingDetails,
                            city: e.target.value
                          })}
                        />
                      </Field>
                      <Field label="Código Postal" required>
                        <Input
                          value={branchShippingDetails.postal_code}
                          onChange={(e) => setBranchShippingDetails({
                            ...branchShippingDetails,
                            postal_code: e.target.value
                          })}
                        />
                      </Field>
                      <Field label="Sucursal" required>
                        <SelectRoot
                          collection={createListCollection({
                            items: andreaniBranches.map((branch) => branch.name),
                          })}
                          value={branchShippingDetails.name ? [branchShippingDetails.name] : []}
                          onValueChange={(details: { value: string[] }) => {
                            const branch = andreaniBranches.find((b) => b.name === details.value[0]);
                            setBranchShippingDetails({
                              ...branchShippingDetails,
                              ...branch,
                            });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValueText>
                              {() => branchShippingDetails.name || 'Selecciona sucursal'}
                            </SelectValueText>
                          </SelectTrigger>
                          <SelectContent>
                            {andreaniBranches.map((branch) => (
                              <SelectItem key={branch.id} item={branch.name} color={textColor}>
                                {branch.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </SelectRoot>
                      </Field>
                    </VStack>
                  )}
                </Box>
              </Stack>
            </Stack>
          </Fieldset.Root>
        </Box>

        <Box w={{ base: "100%", md: "33%" }} minH={"35vh"} maxH={"90vh"} h={"100%"} border="1px" borderColor={useColorModeValue('gray.300', 'gray.700')} borderRadius="md">
          {/* Título principal */}
          <Text fontSize="3xl" textAlign="left" m={4} fontFamily={"Archivo Black"} letterSpacing={"tighter"}>
            Tu carrito está Busy
          </Text>

          <Box w="100%" bg={cardBg}
            borderColor={borderColor} borderRadius="md" borderWidth="1px" px={6} py={8} mt={6}>

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


            {/* Resumen de precios */}
            <Box mt={8}>
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

            <Box as="hr" my={6} borderColor={useColorModeValue('gray.400', 'gray.600')} />

            <Box mt={8}>
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
                <Stack gap={4} mt={4}>
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
      <DebugFormState />
    </Box >
  );
};

export default Checkout;