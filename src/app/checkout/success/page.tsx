'use client';
import { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
} from '@chakra-ui/react';
import { useColorModeValue } from '@/app/components/ui/color-mode';
import { FaCheckCircle } from 'react-icons/fa';

export default function PaymentSuccess() {
  const [orderDetails, setOrderDetails] = useState(null);
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.200');
  const headingColor = useColorModeValue('gray.900', 'white');

  return (
    <Box minH="100vh" bg={bgColor} display="flex" alignItems="center" justifyContent="center" p={4}>
      <Container 
        maxW="md" 
        bg={cardBg} 
        p={8} 
        borderRadius="lg" 
        boxShadow="lg" 
        textAlign="center"
      >
        <VStack gap={4}>
          <Box color="green.500">
            <FaCheckCircle size={48} />
          </Box>

          <Heading 
            as="h1" 
            size="lg" 
            color={headingColor}
          >
            ¡Pago Exitoso!
          </Heading>

          <Text color={textColor}>
            Gracias por tu compra. Hemos enviado un email con los detalles de tu pedido
            y el código de seguimiento.
          </Text>

          <Text fontSize="sm" color="gray.500">
            Revisa tu bandeja de entrada para ver los detalles completos.
          </Text>

          <Button
            onClick={() => window.location.href = '/'}
            colorScheme="blue"
            size="lg"
            w="full"
            _hover={{ opacity: 0.9 }}
          >
            Volver al inicio
          </Button>
        </VStack>
      </Container>
    </Box>
  );
}