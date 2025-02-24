'use client';
import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import {
  Box,
  Container,
  VStack,
  Text,
  Heading,
  Button,
} from '@chakra-ui/react';
import { useColorModeValue } from '../../components/ui/color-mode';
import { supabase } from '@/app/supabase';
import { PaymentRecord } from '@/types/checkout/payment/PaymentRecord';
import { clearCart } from '../../store/slices/cartSlice';

function CheckoutSuccessContent() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<PaymentRecord | null>(null);
  const orderId = searchParams.get('id');
  const [isLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const textColor = useColorModeValue('#555454', 'white');

  useEffect(() => {
    async function fetchPaymentDetails() {
      if (!orderId) return;

      const { data, error } = await supabase
        .from('payment_records')
        .select('*')
        .eq('id', orderId)
        .single();

      if (!error && data) {
        setPaymentDetails(data);
        dispatch(clearCart());
      }
    }
    dispatch(clearCart());
    fetchPaymentDetails();
  }, [orderId, dispatch]);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  if (isLoading) {
    return (
      <Box bg={bgColor} p={8} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
        <Text textAlign="center" color={textColor}>
          ¡Gracias por tu compra!
        </Text>
        <Text textAlign="center" color={textColor}>
          Si recibiste un correo de Mercado Pago quiere decir que ya estamos procesando tu orden.
          Pronto te enviamos un correo con los detalles de tu compra.
          Si no lo ves en tu bandeja de entrada, probá en tu bandeja de spam para confirmar los datos de envío.
        </Text>
        <Button
          alignSelf={'center'}
          m={"auto"}
          colorScheme="blue"
          onClick={() => window.location.href = '/'}
        >
          Volver al inicio
        </Button>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxW="container.md" py={8}>
        <Text color="red.500">{error}</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.md" py={8}>
      <Box bg={bgColor} p={8} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
        <VStack gap={6} align="stretch">
          <Heading textAlign="center" color="green.500">
            ¡Gracias por tu compra!
          </Heading>

          {paymentDetails && (<>
            <Box>
              <Text fontSize="lg" fontWeight="bold">Número de orden:</Text>
              <Text>{orderId}</Text>
            </Box>

            <Box my={4} color="green.500" />

            <Box>
              <Text fontSize="lg" fontWeight="bold" mb={2}>Detalles del envío:</Text>
              <Text>{paymentDetails.shipping_address.address}</Text>
              <Text>
                {paymentDetails.shipping_address.city}, {paymentDetails.shipping_address.province}
              </Text>
              <Text>CP: {paymentDetails.shipping_address.postal_code}</Text>
            </Box>
          </>
          )}
        </VStack>
        <Button
          colorScheme="blue"
          onClick={() => window.location.href = '/'}
        >
          Volver al inicio
        </Button>
      </Box>
    </Container>
  );
}

export default function CheckoutSuccess() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}