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
import axios from 'axios';

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

interface AndreaniBranch {
  id: string;
  address: string;
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

  // Fetch Branches
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/andreani-branches/');
        setAndreaniBranches(response.data as AndreaniBranch[]);
      } catch (error) {
        console.error('Error fetching Andreani branches:', error);
      }
    };

    if (shippingMethod === 'branch') {
      fetchBranches();
    }
  }, [shippingMethod]);

  // Validation and Submit
  const handleSubmit = () => {
    // Basic Validation
    const errors: string[] = [];

    if (!personalInfo.name) errors.push('Nombre es requerido');
    if (!personalInfo.lastName) errors.push('Apellido es requerido');
    if (!personalInfo.email) errors.push('Email es requerido');

    if (shippingMethod === 'home') {
      if (!homeShippingDetails.province) errors.push('Provincia es requerida');
      if (!homeShippingDetails.address) errors.push('Dirección es requerida');
    }

    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    // Prepare Checkout Data
    const checkoutData = {
      personalInfo,
      shippingMethod,
      shippingDetails: shippingMethod === 'home' ? homeShippingDetails : null,
      paymentMethod,
      cartItems,
      totalPrice: calculateTotalPrice()
    };

    console.log('Checkout Data:', checkoutData);
    // TODO: Implement actual checkout process
  };

  // Price Calculation
  const calculateTotalPrice = () => {
    const productTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const shippingCost = shippingMethod === 'home' ? 9500 : 8000;
    return productTotal + shippingCost;
  };

  return (
    <Stack h={"auto"} justify={"center"} direction={{ base: 'column', md: 'row' }} gap={12} p={8} m={4}>
      {/* Cart Summary */}
      <Box w={"25%"} borderWidth={1} borderRadius="md" p={8} boxShadow={"md"}>
        <Text fontWeight="bold" textAlign="center" fontSize="3xl">Resumen de Compra</Text>
        {cartItems.map((item) => (
          <Box key={item.id} mt={3}>
            <Text>{item.name} x{item.quantity}</Text>
            <Text>${item.price * item.quantity}</Text>
          </Box>
        ))}
        <Box my={4} />
        <Text>Productos: ${calculateTotalPrice() - (shippingMethod === 'home' ? 9500 : 8000)}</Text>
        <Text>Envío: ${shippingMethod === 'home' ? 9500 : 8000}</Text>
        <Box height="1px" bg="gray.200" my={4} />
        <Text fontWeight="bold" mt={2}>Total: ${calculateTotalPrice()}</Text>
      </Box>

      {/* Checkout Form */}
      <Box w={"65%"} borderWidth={1} borderRadius="md" p={8} boxShadow={"md"}>
        <Fieldset.Root>
          <Stack w={"75%"} m={"auto"}>
            {/* Personal Info Section */}
            <Text fontWeight="bold" fontSize="3xl" textAlign="center" mt={6} mb={2}>Datos Personales</Text>
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
              <SelectRoot>
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
            {/* Shipping Method Section */}
            <Text fontWeight="bold" fontSize="3xl" textAlign="center" mt={6} mb={2}>Método de Envío</Text>
            <Flex gap={12} direction={{ base: 'column', md: 'row' }} w={"100%"} justify={"center"}>
              {/* Home Delivery */}
              <Card.Root
                border={shippingMethod === 'home' ? 'filled' : 'outline'}
                onClick={() => setShippingMethod('home')}
                w={"45%"}
              >
                <Card.Header>
                  <Flex alignItems="center" gap={3}>
                    <FaHome />
                    <Text>Envío a Domicilio</Text>
                  </Flex>
                </Card.Header>
                {shippingMethod === 'home' && (
                  <Card.Body>
                    <Field label="Provincia">
                      <SelectRoot
                        value={[homeShippingDetails.province]}
                        onChange={(e) => setHomeShippingDetails({
                          ...homeShippingDetails,
                          province: (e.target as HTMLSelectElement).value
                        })}
                      >
                        <SelectTrigger>
                          <SelectValueText>
                            {() => homeShippingDetails.province || 'Selecciona provincia'}
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
                    <Field label="Dirección">
                      <Input
                        value={homeShippingDetails.address}
                        onChange={(e) => setHomeShippingDetails({
                          ...homeShippingDetails,
                          address: e.target.value
                        })}
                      />
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
                  </Card.Body>
                )}
              </Card.Root>

              {/* Branch Pickup */}
              <Card.Root
                border={shippingMethod === 'branch' ? 'filled' : 'outline'}
                onClick={() => setShippingMethod('branch')}
                w={"45%"}
              >
                <Card.Header>
                  <Flex alignItems="center" gap={3}>
                    <LuBuilding2 />
                    <Text>Retiro en Sucursal</Text>
                  </Flex>
                </Card.Header>
                {shippingMethod === 'branch' && (
                  <Card.Body>
                    <Field label="Provincia">
                      <SelectRoot
                        value={[homeShippingDetails.province]}
                        onChange={(e) => setHomeShippingDetails({
                          ...homeShippingDetails,
                          province: (e.target as HTMLSelectElement).value
                        })}
                      >
                        <SelectTrigger>
                          <SelectValueText>
                            {() => homeShippingDetails.province || 'Selecciona provincia'}
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
                    <Field label="Código Postal">
                      <Input
                        value={homeShippingDetails.postalCode}
                        onChange={(e) => setHomeShippingDetails({
                          ...homeShippingDetails,
                          postalCode: e.target.value
                        })}
                      />
                    </Field>
                    <Field label="Sucursal">
                      <SelectRoot>
                        <SelectTrigger>
                          <SelectValueText>
                            {() => 'Selecciona sucursal'}
                          </SelectValueText>
                        </SelectTrigger>
                        <SelectContent>
                          {andreaniBranches.map((branch) => (
                            <SelectItem key={branch.id} item={branch.id}>
                              {branch.address}
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
            <Text fontWeight="bold" fontSize="3xl" textAlign="center" mt={6} mb={2}>Método de Pago</Text>
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
              onClick={handleSubmit}
            >
              Finalizar Compra
            </Button>
          </Stack>
        </Fieldset.Root>
      </Box>
    </Stack>
  );
};

export default Checkout;