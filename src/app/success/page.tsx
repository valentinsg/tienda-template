'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Box,
  Container,
  VStack,
  Text,
  Heading,
} from '@chakra-ui/react';
import { useOrderTracking } from '../hooks/useOrderTracking';
import { useColorModeValue } from '../components/ui/color-mode';

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');
  const { orderDetails, isLoading, error } = useOrderTracking(orderId);
  
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
          <Heading textAlign="center" color="green.500">
            ¡Gracias por tu compra!
          </Heading>
          
          {orderDetails && (
            <>
              <Box>
                <Text fontSize="lg" fontWeight="bold">Número de orden:</Text>
                <Text>{orderId}</Text>
              </Box>

              <Box>
                <Text fontSize="lg" fontWeight="bold">Estado:</Text>
                <Text>{orderDetails.status}</Text>
              </Box>

              {orderDetails.tracking_code && (
                <Box>
                  <Text fontSize="lg" fontWeight="bold">Código de seguimiento:</Text>
                  <Text>{orderDetails.tracking_code}</Text>
                </Box>
              )}

              <Box my={4} color="green.500" />

              <Box>
                <Text fontSize="lg" fontWeight="bold" mb={2}>Detalles del envío:</Text>
                <Text>{orderDetails.shipping_address.address}</Text>
                <Text>
                  {orderDetails.shipping_address.city}, {orderDetails.shipping_address.province}
                </Text>
                <Text>CP: {orderDetails.shipping_address.postal_code}</Text>
              </Box>
            </>
          )}
        </VStack>
      </Box>
    </Container>
  );
}