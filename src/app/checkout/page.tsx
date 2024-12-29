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
} from '@chakra-ui/react';
import { Field } from "../components/ui/field"
import { SelectRoot, SelectTrigger, SelectValueText, SelectContent, SelectItem } from "../components/ui/select"
import { useSelector } from 'react-redux';
import { selectCartItems } from '../store/slices/cartSlice';
import { Radio, RadioGroup } from '../components/ui/radio';
import { createListCollection } from "@chakra-ui/react"
import { FaHome } from 'react-icons/fa';
import { LuBuilding2 } from "react-icons/lu"
import * as Yup from 'yup';
import { useFormik, FormikValues } from 'formik';
import {AndreaniBranch} from "../../types/checkout/shipping/AndreaniBranch"
import { supabase } from '../supabase';

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

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    gender: ''
  });

  const [shippingMethod, setShippingMethod] = useState<'home' | 'branch'>('home');
  const [paymentMethod, setPaymentMethod] = useState<'creditCard' | 'debitCard'>('creditCard');

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

  const validationSchema = Yup.object({
    name: Yup.string().required('Nombre es requerido'),
    lastName: Yup.string().required('Apellido es requerido'),
    email: Yup.string().email('Email inválido').required('Email es requerido'),
    phone: Yup.string().required('Teléfono es requerido'),
    address: Yup.string().when('shippingMethod', {
      is: (val: string) => val === 'home',
      then: (schema) => schema.required('Dirección es requerida'),
    }),
    province: Yup.string().required('Provincia es requerida'),
    city: Yup.string().required('Ciudad es requerida'),
    postalCode: Yup.string().required('Código Postal es requerido'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      province: '',
      city: '',
      postalCode: '',
      shippingMethod: 'home',
    },
    validationSchema,
    onSubmit: async (values: FormikValues) => {
      try {
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
        if (data.initPoint) window.location.href = data.initPoint;
        else alert(data.error || 'Error al generar la preferencia de pago');
      } catch (error) {
        console.error(error);
        alert('Error al procesar el pago.');
      }
    },
  });

  // Price Calculation
  const calculateTotalPrice = () => {
    const productTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const shippingCost = shippingMethod === 'home' ? 9500 : 8000;
    return productTotal + shippingCost;
  };

  const handleCheckout = () => {
    formik.handleSubmit();
  };
  return (
    <Stack minH={"90vh"} justify={"center"} direction={{ base: 'column', md: 'row' }} >
      {/* Cart Summary */}


      {/* Checkout Form */}
      <Box mx={8} w={"60%"} borderWidth={1} borderRadius="md" boxShadow={"md"} overflowY="auto" maxHeight="80vh" p={8} mt={8}>
        <Fieldset.Root>
          <Stack w={"85%"} m={"auto"}>
            {/* Personal Info Section */}
            <Text fontWeight="bold" fontSize="3xl" textAlign="left" m={4}>Datos Personales</Text>
            <Flex gap={12} direction={{ base: 'column', md: 'row' }} >
              <Stack flex={1}>
                <Field label="Nombre">
                  <Input
                    value={personalInfo.name}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                  />
                </Field>
                <Field label="Apellido">
                  <Input
                    value={personalInfo.lastName}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                  />
                </Field>
                <Field label="Email">
                  <Input
                    value={personalInfo.email}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                  />
                </Field>
              </Stack>
              <Stack flex={1}>
                <Field label="Teléfono">
                  <Input
                    type="tel"
                    value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                    placeholder="Ej: +54 9 11 1234-5678"
                  />
                </Field>
                <Field label="Fecha de Nacimiento">
                  <Input
                    type="date"
                    value={personalInfo.age}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, age: e.target.value })}
                  />
                </Field>
                <Field label="Género">
                  <SelectRoot
                    collection={createListCollection({
                      items: ['masculino', 'femenino', 'otro', 'prefiero-no-decir']
                    })}
                  >
                    <SelectTrigger>
                      <SelectValueText>
                        {() => personalInfo.gender || 'Selecciona género'}
                      </SelectValueText>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem item="masculino">Masculino</SelectItem>
                      <SelectItem item="femenino">Femenino</SelectItem>
                      <SelectItem item="otro">Otro</SelectItem>
                      <SelectItem item="prefiero-no-decir">Prefiero no decir</SelectItem>
                    </SelectContent>
                  </SelectRoot>
                </Field>

              </Stack>

            </Flex>
            {/* Shipping Method Section */}
            <Text fontWeight="bold" fontSize="3xl" textAlign="center" m={10}>Método de Envío</Text>
            <Flex gap={12} direction={{ base: 'column', md: 'row' }} w={"100%"} justify={"center"}>
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
            </Flex>

            {/* Payment Method Section */}
            <Text fontWeight="bold" fontSize="3xl" textAlign="center" m={10}>Método de Pago</Text>
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => {
                const value = (e.target as HTMLInputElement).value as 'creditCard' | 'debitCard';
                setPaymentMethod(value);
              }}

            >
              <Flex
                gap={4}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Radio value="creditCard">Tarjeta de Crédito</Radio>
                <Radio value="debitCard">Tarjeta de Débito</Radio>

              </Flex>
            </RadioGroup>

            {/* Submit Button */}
            <Button
              mt={6}
              colorScheme="green"
              onClick={handleCheckout}
            >
              Ir a pagar
            </Button>
          </Stack>
        </Fieldset.Root>
      </Box>
      <Box w={"25%"} minH={"35vh"} maxH={"90vh"} h={"100%"} borderWidth={1} borderRadius="md" boxShadow={"md"} gap={12} p={8} mx={8} mt={8}>
        <Text fontWeight="bold" textAlign="center" fontSize="3xl" m={6}>Resumen de Compra</Text>
        {cartItems.map((item) => (
          <Box key={item.id} mt={3}>
            <Text>{item.name} x{item.quantity}</Text>
            <Text>${item.price * item.quantity}</Text>
          </Box>
        ))}
        <Box my={4} />
        <Text>Productos: ${calculateTotalPrice() - (shippingMethod === 'home' ? 9500 : 8000)}</Text>
        <Text>
          {shippingMethod === 'home'
            ? 'Envío a domicilio: $9500'
            : shippingMethod === 'branch'
              ? 'Envío a sucursal (Andreani): $8000'
              : 'Selecciona un método de envío'}
        </Text>
        <Box height="1px" bg="gray.200" my={4} />
        <Text fontWeight="bold" mt={2}>Total: ${calculateTotalPrice()}</Text>
      </Box>
    </Stack>
  );
};

export default Checkout;

// Removed the local declaration of useFormik to avoid conflict with the imported one.
