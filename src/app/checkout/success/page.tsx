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
import { toaster } from '../../components/ui/toaster';

function CheckoutSuccessContent() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<PaymentRecord | null>(null);
  const orderId = searchParams.get('order');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  const textColor = useColorModeValue('#555454', 'white');

  useEffect(() => {
    async function handleCheckoutSuccess() {
      if (!orderId) return;

      try {
        // Fetch payment details
        const { data, error } = await supabase
          .from('payment_records')
          .select('*')
          .eq('id', orderId)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Payment record not found');

        setPaymentDetails(data);
        dispatch(clearCart());

        // Send confirmation email
        const response = await fetch('/api/send-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to send confirmation email');
        }

      toaster.create({
          title: 'Confirmación enviada',
          description: 'Te hemos enviado un email con los detalles de tu compra',
          duration: 5000,
        });
      } catch (err) {
        console.error('Error in checkout success:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        
      toaster.create({
          title: 'Error',
          description: 'Hubo un problema al procesar tu orden. Por favor, contacta a soporte.',
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    }

    handleCheckoutSuccess();
  }, [orderId, dispatch, toast]);
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  if (isLoading) {
    return (
      <Box bg={bgColor} p={8} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
        <Text textAlign="center" color={textColor}>
          ¡Gracias por tu compra!
        </Text>
        <Text textAlign="center" color={textColor}>
          Pronto vas a recibir un correo con los detalles de tu compra.
        </Text>
        <Text>
          <Text>
            Recibimos estos datos:
          </Text>
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
        </Text>
        <Button
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

function useToast() {
  throw new Error('Function not implemented.');
}
