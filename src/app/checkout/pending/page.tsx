'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Box,
  Container,
  VStack,
  Text,
  Heading,
} from '@chakra-ui/react';
import { useColorModeValue } from '../../components/ui/color-mode';
import { supabase } from '@/app/supabase';
import { PaymentRecord } from '@/types/checkout/payment/PaymentRecord';

function CheckoutPendingContent() {
  const searchParams = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<PaymentRecord | null>(null);
  const orderId = searchParams.get('order');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPaymentDetails() {
      if (!orderId) return;

      const { data, error } = await supabase
        .from('payment_records')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) {
        setError('Error al obtener los detalles del pago');
      } else {
        setPaymentDetails(data);
      }
      setIsLoading(false);
    }

    fetchPaymentDetails();
  }, [orderId]);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  if (isLoading) {
    return (
      <Container maxW="container.md" py={8}>
        <Text>Cargando detalles de la orden...</Text>
      </Container>
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
          <Heading textAlign="center" color="yellow.500">
            Pago Pendiente
          </Heading>

          {paymentDetails && (<>
            <Box>
              <Text fontSize="lg" fontWeight="bold">Número de orden:</Text>
              <Text>{orderId}</Text>
            </Box>

            <Box my={4} color="yellow.500" />

            <Box>
              <Text fontSize="lg" fontWeight="bold" mb={2}>Detalles del envío:</Text>
              <Text>{paymentDetails.shipping_address.address}</Text>
              <Text>
                {paymentDetails.shipping_address.city}, {paymentDetails.shipping_address.province}
              </Text>
              <Text>CP: {paymentDetails.shipping_address.postal_code}</Text>
            </Box>
          </>)}
        </VStack>
      </Box>
    </Container>
  );
}

export default function CheckoutPending() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <CheckoutPendingContent />
    </Suspense>
  );
}
