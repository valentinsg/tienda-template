'use client';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
} from '@chakra-ui/react';
import { useColorModeValue } from '@/app/components/ui/color-mode';
import { FaTimesCircle } from 'react-icons/fa';

export default function PaymentFailure() {
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
          <Box color="red.500">
            <FaTimesCircle size={48} />
          </Box>

          <Heading 
            as="h1" 
            size="lg" 
            color={headingColor}
          >
            ¡Pago Fallido!
          </Heading>

          <Text color={textColor}>
            Lo sentimos, ha ocurrido un error con tu pago. Por favor, intenta nuevamente.
          </Text>

          <Text fontSize="sm" color="gray.500">
            Si el problema persiste, contacta a nuestro soporte.
          </Text>

          <Button
            onClick={() => window.location.href = '/'}
            colorScheme="red"
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
