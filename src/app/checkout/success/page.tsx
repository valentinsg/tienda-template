'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import {
  Box,
  Container,
  VStack,
  Text,
  Heading,
  Button,
  Spinner,
} from '@chakra-ui/react';
import { useColorModeValue } from '../../components/ui/color-mode';
import { supabase } from '@/app/supabase';
import { PaymentRecord } from '@/types/checkout/payment/PaymentRecord';
import { clearCart } from '../../store/slices/cartSlice';

// Separate component that uses useSearchParams
const CheckoutSuccessContent = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<PaymentRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const orderId = searchParams.get('orderId');
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('#555454', 'white');

  useEffect(() => {
    async function fetchPaymentDetails() {
      if (!orderId) {
        setError('No se encontró el número de orden');
        setIsLoading(false);
        return;
      }

      try {
        const { data, error: supabaseError } = await supabase
          .from('payment_records')
          .select('*')
          .eq('id', orderId)
          .single();

        if (supabaseError) {
          throw supabaseError;
        }

        if (data) {
          setPaymentDetails(data);
          dispatch(clearCart());
          
          // Send confirmation email
          try {
            const response = await fetch('/api/send-confirmation', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ orderId }),
            });

            if (!response.ok) {
              console.error('Error sending confirmation email');
            }
          } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError);
          }
        }
      } catch (err) {
        setError('Error al cargar los detalles del pago');
        console.error('Error fetching payment details:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPaymentDetails();
  }, [orderId, dispatch]);

  if (isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="200px"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        bg={bgColor} 
        p={8} 
        borderRadius="lg" 
        borderWidth="1px" 
        borderColor={borderColor}
      >
        <Text color="red.500" textAlign="center">
          {error}
        </Text>
        <Button
          mt={4}
          colorScheme="blue"
          onClick={() => window.location.href = '/'}
          width="100%"
        >
          Volver al inicio
        </Button>
      </Box>
    );
  }

  return (
    <Box 
      bg={bgColor} 
      p={8} 
      borderRadius="lg" 
      borderWidth="1px" 
      borderColor={borderColor}
    >
      <VStack gap={6} align="stretch">
        <Heading textAlign="center" color="green.500">
          ¡Gracias por tu compra!
        </Heading>

        <Text textAlign="center" color={textColor}>
          Pronto vas a recibir un correo con los detalles de tu compra.
        </Text>

        {paymentDetails && (
          <>
            <Box>
              <Text fontSize="lg" fontWeight="bold">Número de orden:</Text>
              <Text>{orderId}</Text>
            </Box>

            <Box my={4} />

            <Box>
              <Text fontSize="lg" fontWeight="bold" mb={2}>
                Detalles del envío:
              </Text>
              <Text>{paymentDetails.shipping_address.address}</Text>
              <Text>
                {paymentDetails.shipping_address.city}, {paymentDetails.shipping_address.province}
              </Text>
              <Text>CP: {paymentDetails.shipping_address.postal_code}</Text>
            </Box>
          </>
        )}

        <Button
          mt={4}
          colorScheme="blue"
          onClick={() => window.location.href = '/'}
          width="100%"
        >
          Volver al inicio
        </Button>
      </VStack>
    </Box>
  );
};

const LoadingFallback = () => (
  <Container maxW="container.md" py={8}>
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="200px"
    >
      <Spinner size="xl" />
    </Box>
  </Container>
);

export default function CheckoutSuccess() {
  return (
    <Container maxW="container.md" py={8}>
      <Suspense fallback={<LoadingFallback />}>
        <CheckoutSuccessContent />
      </Suspense>
    </Container>
  );
}