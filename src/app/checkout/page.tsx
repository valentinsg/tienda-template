'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Stack,
  Text,
  Fieldset,
  Input,
  Button,
  Group,
  Flex,
  Heading,
  Card,
} from '@chakra-ui/react';
import { Field } from "../components/ui/field"
import { SelectRoot, SelectTrigger, SelectValueText, SelectContent, SelectItem } from "../components/ui/select"
import { useSelector } from 'react-redux';
import { selectCartItems } from '../store/slices/cartSlice';
import { Radio, RadioGroup } from '../components/ui/radio';
import { createListCollection } from "@chakra-ui/react"
import { PaymentMethod } from '@/types/checkout/payment/PaymentMethod';
import { LuCalendar, LuUser, LuWallet, LuBuilding2 } from "react-icons/lu"
import { StepsCompletedContent, StepsContent, StepsItem, StepsList, StepsNextTrigger, StepsPrevTrigger, StepsRoot } from '../components/ui/steps';
import { FaHome } from 'react-icons/fa';
import { AndreaniBranch } from '../../types/checkout/shipping/AndreaniBranch';
import axios from 'axios';

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
  const [andreaniBranches, setAndreaniBranches] = useState<AndreaniBranch[]>([]);
  const cartItems = useSelector(selectCartItems);
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
  });

  const [shippingMethod, setShippingMethod] = useState<'home' | 'branch'>('home');

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
    <Stack h={"90vh"} justify={"center"} direction={{ base: 'column', md: 'row' }} gap={12} p={8} m={4}>

      {/* Resumen del carrito */}
      <Box w={"25%"} borderWidth={1} borderRadius="md" p={8} boxShadow={"md"}>
        <Text fontWeight="bold" textAlign="center" fontSize="3xl">Resumen de Compra</Text>
        {cartItems.map((item) => (
          <Box key={item.id} mt={3}>
            <Text>{item.name} x{item.quantity}</Text>
            <Text>${item.price * item.quantity}</Text>
          </Box>
        ))}
        <Box my={4} />
        <Text>Productos: ${totalPrice}</Text>
        <Text>Envío: ${shippingMethod === 'home' ? 9500 : 8000}</Text>
        <Box height="1px" bg="gray.200" my={4} />
        <Text fontWeight="bold" mt={2}>Total: ${totalPrice + (shippingMethod === 'home' ? 9500 : 8000)}</Text>
      </Box>

      {/* Formulario */}
      <Box w={"55%"} borderWidth={1} borderRadius="md" p={8} boxShadow={"md"}>

        <StepsRoot defaultValue={1} count={3}>

          <StepsList mx={10} mt={4}>
            <StepsItem index={0} icon={<LuUser />} />
            <StepsItem index={1} icon={<LuWallet />} />
            <StepsItem index={2} icon={<LuCalendar />} />
          </StepsList>

          <StepsContent index={0}>

            <Fieldset.Root>

              <Stack w={"75%"} m={"auto"}>
                <Text fontWeight="bold" fontSize="3xl" textAlign="center" mt={6} mb={2}>Datos Personales</Text>

                <Fieldset.Content>
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
                </Fieldset.Content>
              </Stack>
            </Fieldset.Root>
          </StepsContent>
          <StepsContent index={1}>

            <Flex justifyContent="space-between" alignItems="center" mb={6}>
              <Flex justifyContent="space-between" alignItems="center" mb={6}>
                <Heading size="lg">Método de Envío</Heading>
              </Flex>

              <Flex gap={6} direction={{ base: 'column', md: 'row' }}>
                {/* Home Delivery Card */}
                <Card.Root>
                  <Card.Header>
                    <Flex alignItems="center" gap={3}>
                      <FaHome />
                      <Heading size="md">Envío a Domicilio</Heading>
                    </Flex>
                  </Card.Header>
                  <Card.Body>
                    <Stack
                      gap={4}
                      flex={1}
                      border={shippingMethod === 'home' ? 'filled' : 'outline'}
                      cursor="pointer"
                      onClick={() => handleShippingMethodChange('home')}
                      _hover={{ shadow: 'lg' }}
                      transition="all 0.2s"
                    >
                      <Fieldset.Root>
                        <Fieldset.Legend>Provincia</Fieldset.Legend>
                        <SelectRoot
                          value={[homeShippingDetails.province]}
                          onChange={(e) => setHomeShippingDetails({ ...homeShippingDetails, province: (e.target as HTMLSelectElement).value })}
                        >
                          <SelectTrigger>
                            <SelectValueText>{() => homeShippingDetails.province || 'Selecciona provincia'}</SelectValueText>
                          </SelectTrigger>
                          <SelectContent>
                            {provinces.items.map((province) => (
                              <SelectItem key={province} item={province}>
                                {province}
                              </SelectItem>
                            ))}

                          </SelectContent>
                        </SelectRoot>
                      </Fieldset.Root>

                      <Fieldset.Root>
                        <Fieldset.Legend>Código Postal</Fieldset.Legend>
                        <Input
                          value={homeShippingDetails.postalCode}
                          onChange={(e) => setHomeShippingDetails({ ...homeShippingDetails, postalCode: e.target.value })}
                        />
                      </Fieldset.Root>

                      <Fieldset.Root>
                        <Fieldset.Legend>Ciudad</Fieldset.Legend>
                        <Input
                          value={homeShippingDetails.city}
                          onChange={(e) => setHomeShippingDetails({ ...homeShippingDetails, city: e.target.value })}
                        />
                      </Fieldset.Root>

                      <Fieldset.Root>
                        <Fieldset.Legend>Dirección</Fieldset.Legend>
                        <Input
                          value={homeShippingDetails.address}
                          onChange={(e) => setHomeShippingDetails({ ...homeShippingDetails, address: e.target.value })}
                        />
                      </Fieldset.Root>
                    </Stack>
                  </Card.Body>
                </Card.Root>

                {/* Branch Pickup Card */}
                <Card.Root>
                  <Card.Header>
                    <Flex alignItems="center" gap={3}>
                      <LuBuilding2 />
                      <Heading size="md">Retiro en Sucursal</Heading>
                    </Flex>
                  </Card.Header>
                  <Card.Body>
                    <Stack
                      gap={4}
                      flex={1}
                      border={shippingMethod === 'branch' ? 'filled' : 'outline'}
                      cursor="pointer"
                      onClick={() => handleShippingMethodChange('branch')}
                      _hover={{ shadow: 'lg' }}
                      transition="all 0.2s"
                    >
                      <Fieldset.Root>
                        <Fieldset.Legend>Provincia</Fieldset.Legend>
                        <SelectRoot
                          value={[branchShippingDetails.province]}
                          onChange={(e) => setBranchShippingDetails({ ...branchShippingDetails, province: (e.target as HTMLSelectElement).value })}
                        >
                          <SelectTrigger>
                            <SelectValueText>{() => branchShippingDetails.province || 'Selecciona provincia'}</SelectValueText>
                          </SelectTrigger>
                          <SelectContent>
                            {provinces.items.map((province) => (
                              <SelectItem key={province} item={province}>
                                {province}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </SelectRoot>
                      </Fieldset.Root>

                      <Fieldset.Root>
                        <Fieldset.Legend>Código Postal</Fieldset.Legend>
                        <Input
                          value={branchShippingDetails.postalCode}
                          onChange={(e) => setBranchShippingDetails({ ...branchShippingDetails, postalCode: e.target.value })}
                        />
                      </Fieldset.Root>

                      <Fieldset.Root>
                        <Fieldset.Legend>Sucursal</Fieldset.Legend>
                        <SelectRoot
                          value={[branchShippingDetails.branchId]}
                          onChange={(e) => setBranchShippingDetails({ ...branchShippingDetails, branchId: (e.target as HTMLSelectElement).value })}
                        >
                          <SelectTrigger>
                            <SelectValueText>{() => branchShippingDetails.branchId || 'Selecciona la sucursal más cercana'}</SelectValueText>
                          </SelectTrigger>
                          <SelectContent>
                            {andreaniBranches.map((branch: AndreaniBranch) => (
                              <SelectItem key={branch.id} item={branch.id}>
                                {`Sucursal ${branch.address}`}                             
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </SelectRoot>
                      </Fieldset.Root>
                    </Stack>
                  </Card.Body>
                </Card.Root>
              </Flex>
            </Flex>
          </StepsContent>
          <StepsContent index={2}>
            <Stack gap={4}>
              <Text fontWeight="bold" fontSize="lg">Método de Pago</Text>
              <RadioGroup onChange={(value) => setPaymentMethod(value as unknown as PaymentMethod)} value={paymentMethod}>
                <Stack direction="row">
                  <Radio value="creditCard">Tarjeta de Crédito</Radio>
                  <Radio value="debitCard">Tarjeta de Débito</Radio>
                  <Radio value="transfer">Transferencia Bancaria</Radio>
                </Stack>
              </RadioGroup>
              <Button colorScheme="green" onClick={handleSubmit}>Finalizar</Button>
            </Stack>
          </StepsContent>
          <StepsCompletedContent>All steps are complete!</StepsCompletedContent>

          <Group justifyContent="center">
            <StepsPrevTrigger asChild>
              <Button variant="outline" size="sm">
                Prev
              </Button>
            </StepsPrevTrigger>
            <StepsNextTrigger asChild>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </StepsNextTrigger>
          </Group>
        </StepsRoot>


      </Box>
    </Stack >
  );
};

export default Checkout;
