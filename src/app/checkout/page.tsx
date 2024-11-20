'use client';

import React, { useState } from 'react';
import {
  Box,
  Stack,
  Text,
  Fieldset,
  Input,
  Button,
  SelectRoot,
} from '@chakra-ui/react';
import { Field } from "../components/ui/field"
import { useSelector } from 'react-redux';
import { selectCartItems } from '../store/slices/cartSlice';
import { Radio, RadioGroup } from '../components/ui/radio';
import { SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValueText } from '../components/ui/select';
import { createListCollection } from "@chakra-ui/react"
import { PaymentMethod } from '@/types/checkout/payment/PaymentMethod';

const provinces = createListCollection({
  items: [
    "Buenos Aires", "Ciudad Autónoma de Buenos Aires", "Catamarca", "Chaco",
    "Chubut", "Córdoba", "Corrientes", "Entre Ríos", "Formosa", "Jujuy",
    "La Pampa", "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro",
    "Salta", "San Juan", "San Luis", "Santa Cruz", "Santa Fe",
    "Santiago del Estero", "Tierra del Fuego", "Tucumán"
  ]
})

const Checkout = () => {
  const cartItems = useSelector(selectCartItems);
  const [step, setStep] = useState(1);
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
  });

  const [shippingMethod, setShippingMethod] = useState<'home' | 'branch'>('home');

  const handleShippingMethodChange = (value: string) => {
    if (value === 'home' || value === 'branch') {
      setShippingMethod(value);

      if (value === 'home') {
        setBranchShippingDetails({ province: '', postalCode: '', branchId: '' });
      } else {
        setHomeShippingDetails({ address: '', province: '', postalCode: '', city: '' });
      }
    }
  };
  const [homeShippingDetails, setHomeShippingDetails] = useState({
    address: '',
    province: '',
    postalCode: '',
    city: '',
  });
  const [branchShippingDetails, setBranchShippingDetails] = useState({
    province: '',
    postalCode: '',
    branchId: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'creditCard' | 'debitCard' | 'transfer'>('creditCard');

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = () => {
    const checkoutData = {
      personalInfo,
      shippingDetails: shippingMethod === 'home' ? homeShippingDetails : branchShippingDetails,
      paymentMethod,
      cartItems,
      shippingCost: shippingMethod === 'home' ? 9500 : 8000,
    };
    console.log('Checkout Data:', checkoutData);
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <Stack direction={{ base: 'column', md: 'row' }} gap={6} p={6}>
      {/* Resumen del carrito */}
      <Box flex={1} borderWidth={1} borderRadius="md" p={4}>
        <Text fontWeight="bold" fontSize="lg">Resumen de Compra</Text>
        {cartItems.map((item) => (
          <Box key={item.id} mt={3}>
            <Text>{item.name} x{item.quantity}</Text>
            <Text>${item.price * item.quantity}</Text>
          </Box>
        ))}
        <Box my={4} />
        <Text>Total Productos: ${totalPrice}</Text>
        <Box height="1px" bg="gray.200" my={4} />
        <Text>Envío: ${shippingMethod === 'home' ? 9500 : 8000}</Text>
        <Text fontWeight="bold" mt={2}>Total: ${totalPrice + (shippingMethod === 'home' ? 9500 : 8000)}</Text>
      </Box>

      {/* Formulario */}
      <Box flex={2} borderWidth={1} borderRadius="md" p={4}>
        {step === 1 && (
          <Fieldset.Root>
            <Stack gap={4}>
              <Fieldset.Content>
                <Text fontWeight="bold" fontSize="lg">Datos Personales</Text>

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
                <Field label="Telefono">
                  <Input
                    value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                  />
                </Field>

                <Field label="Edad">
                  <Input
                    value={personalInfo.age}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, age: e.target.value })}
                  />
                </Field>
                <Button colorScheme="blue" onClick={handleNext}>Siguiente</Button>
              </Fieldset.Content>
            </Stack>
          </Fieldset.Root>
        )}

        {step === 2 && (
          <Stack gap={4}>
            <Text fontWeight="bold" fontSize="lg">Método de Envío</Text>
            <RadioGroup
              onChange={(event) => handleShippingMethodChange((event.target as HTMLInputElement).value as 'home' | 'branch')}
              value={shippingMethod}
            >
              <Stack direction="row">
                <Radio value="home">Envío a Domicilio</Radio>
                <Radio value="branch">Retiro en Sucursal</Radio>
              </Stack>
            </RadioGroup>
            {shippingMethod === 'home' && (
              <Fieldset.Root>
                <Stack>
                  <Fieldset.Content>
                    <SelectRoot
                      value={[homeShippingDetails.province]}
                      onChange={(e) => setHomeShippingDetails({ ...homeShippingDetails, province: (e.target as HTMLSelectElement).value })}
                    >
                      <SelectLabel>Selecciona provincia</SelectLabel>
                      <SelectTrigger>
                        <SelectValueText placeholder="Selecciona tu provincia" />
                      </SelectTrigger>
                      <SelectContent>
                        {provinces.items.map((province) => (
                          <SelectItem item={province} key={province}>
                            {province}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </SelectRoot>

                    <Field label="Código Postal">
                      <Input
                        value={homeShippingDetails.postalCode}
                        onChange={(e) => setHomeShippingDetails({ ...homeShippingDetails, postalCode: e.target.value })}
                      />
                    </Field>

                    <Fieldset.Legend>Ciudad</Fieldset.Legend>
                    <Field label="Ciudad">
                      <Input
                        value={homeShippingDetails.city}
                        onChange={(e) => setHomeShippingDetails({ ...homeShippingDetails, city: e.target.value })}
                      />
                    </Field>

                    <Fieldset.Legend>Dirección</Fieldset.Legend>
                    <Field label="Dirección">
                      <Input
                        value={homeShippingDetails.address}
                        onChange={(e) => setHomeShippingDetails({ ...homeShippingDetails, address: e.target.value })}
                      />
                    </Field>

                  </Fieldset.Content>
                </Stack>
              </Fieldset.Root>
            )}
            {shippingMethod === 'branch' && (
              <Fieldset.Root>
                <Stack>
                  <SelectRoot
                    value={[homeShippingDetails.province]}
                    onChange={(e) => setHomeShippingDetails({ ...homeShippingDetails, province: (e.target as HTMLSelectElement).value })}
                  >
                    <SelectLabel>Selecciona provincia</SelectLabel>
                    <SelectTrigger>
                      <SelectValueText placeholder="Select movie" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.items.map((province) => (
                        <SelectItem item={province} key={province}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectRoot>
                  <Field label="Código Postal">
                    <Input
                      value={homeShippingDetails.postalCode}
                      onChange={(e) => setHomeShippingDetails({ ...homeShippingDetails, postalCode: e.target.value })}
                    />
                  </Field>
                  <SelectRoot
                    value={[branchShippingDetails.branchId]}
                    onChange={(e) => setBranchShippingDetails({ ...branchShippingDetails, branchId: (e.target as HTMLSelectElement).value })}
                  >
                    <SelectLabel>Selecciona una sucursal</SelectLabel>
                    <SelectTrigger>
                      <SelectValueText placeholder="Selecciona la sucursal mas cercana" />
                    </SelectTrigger>
                    {/* Aquí harías un fetch a tu backend para las sucursales */}
                    <SelectContent>
                      {provinces.items.map((province) => (
                        <SelectItem item={province} key={province}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectRoot>
                </Stack>
              </Fieldset.Root>
            )}
            <Stack direction="row" justifyContent="space-between">
              <Button onClick={handleBack}>Volver</Button>
              <Button colorScheme="blue" onClick={handleNext}>Siguiente</Button>
            </Stack>
          </Stack>
        )}

        {step === 3 && (
          <Stack gap={4}>
            <Text fontWeight="bold" fontSize="lg">Método de Pago</Text>
            <RadioGroup onChange={(value) => setPaymentMethod(value as unknown as PaymentMethod)} value={paymentMethod}>
              <Stack direction="row">
                <Radio value="creditCard">Tarjeta de Crédito</Radio>
                <Radio value="debitCard">Tarjeta de Débito</Radio>
                <Radio value="transfer">Transferencia Bancaria</Radio>
              </Stack>
            </RadioGroup>
            <Stack direction="row" justifyContent="space-between">
              <Button onClick={handleBack}>Volver</Button>
              <Button colorScheme="green" onClick={handleSubmit}>Finalizar</Button>
            </Stack>
          </Stack>
        )}
      </Box>
    </Stack >
  );
};

export default Checkout;
