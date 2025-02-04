'use client';
import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Box,
  Container,
  VStack,
  Text,
  Heading,
  Button,
} from '@chakra-ui/react';
import { useColorModeValue } from '../components/ui/color-mode';

function FailureContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams?.get("order") || "Desconocido";

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Container maxW="container.md" py={8}>
      <Box bg={bgColor} p={8} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
        <VStack gap={6}>
          <Heading color="red.500" textAlign="center">
            Hubo un problema con tu pago
          </Heading>

          <Text fontSize="lg" textAlign="center">
            Lo sentimos, pero no pudimos procesar tu pago correctamente.
          </Text>

          <Text>Número de orden: {orderId}</Text>

          <Box display="flex" gap={4}>
            <Button onClick={() => router.push('/cart')} variant="outline">
              Volver al carrito
            </Button>
            <Button onClick={() => router.push('/checkout')} colorScheme="blue">
              Intentar nuevamente
            </Button>
          </Box>
        </VStack>
      </Box>
    </Container>
  );
}

export default function CheckoutFailure() {
  return (
    <Suspense fallback={<Text>Cargando...</Text>}>
      <FailureContent />
    </Suspense>
  );
}
