'use client';
import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  VStack,
  Input,
  Textarea,
  Button,
  Icon,
  Text,
  HStack,
} from '@chakra-ui/react';
import { useColorModeValue } from '../components/ui/color-mode';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });

  const bgColor = useColorModeValue('bg.muted', '#555454');
  const textColor = useColorModeValue('#555454', '#D0D0D0');
  const buttonColor = useColorModeValue('blue.500', 'blue.300');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const loadingToast = toast.loading('Enviando mensaje...');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success('¡Mensaje enviado con éxito!', {
        id: loadingToast,
        icon: '👏',
      });

      setFormData({ nombre: '', email: '', mensaje: '' }); // Limpiar formulario
    } catch (error) {
      toast.error('Hubo un error al enviar el mensaje', {
        id: loadingToast,
        icon: '😕',
      });
      console.log(error);
    }
  };

  return (
    <Box bg={bgColor} py={12} color={textColor}>
      <Container maxW="6xl">
        <VStack gap={8}>
          <Container textAlign="center" mb={10}>
            <Heading fontFamily={"Archivo Black"} as="h1" fontSize={{ base: "4xl", md: "4vw" }} letterSpacing={"tighter"} lineHeight={{ base: 1.2, md: "11vh" }} color={textColor}>
              Contáctanos.
            </Heading>
          </Container>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={10} w="full">
            {/* Información de Contacto */}
            <Box>
              <VStack gap={6} align="stretch">
                <Heading
                  size="md"
                  fontFamily="Archivo Black"
                  letterSpacing="tighter"
                >
                  Información de Contacto
                </Heading>

                <HStack gap={4}>
                  <Icon boxSize={6} color={buttonColor}>
                    <MdLocationOn />
                  </Icon>
                  <Text>Nuestra casa (por ahora :D)</Text>
                </HStack>

                <HStack gap={4}>
                  <Icon boxSize={6} color={buttonColor}>
                    <MdPhone />
                  </Icon>
                  <Text>+54 9 1158233292 o +54 9 92236680041 </Text>
                </HStack>

                <HStack gap={4}>
                  <Icon boxSize={6} color={buttonColor}>
                    <MdEmail />
                  </Icon>
                  <Text>info@mitienda.com</Text>
                </HStack>
              </VStack>
            </Box>

            {/* Formulario de Contacto */}
            <Box>
              <form onSubmit={handleSubmit}>
                <VStack gap={4}>
                  <Text fontFamily="Archivo Black">Nombre</Text>
                  <Input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    placeholder="Tu nombre"
                    borderColor={buttonColor}
                  />

                  <Text fontFamily="Archivo Black">Email</Text>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="tu@email.com"
                    borderColor={buttonColor}
                  />

                  <Text fontFamily="Archivo Black">Mensaje</Text>
                  <Textarea
                    value={formData.mensaje}
                    onChange={(e) =>
                      setFormData({ ...formData, mensaje: e.target.value })
                    }
                    placeholder="Tu mensaje"
                    borderColor={buttonColor}
                    rows={4}
                  />

                  <Button
                    type="submit"
                    bg={buttonColor}
                    color="white"
                    _hover={{ bg: 'blue.400' }}
                    size="lg"
                    w="full"
                    mt={4}
                    fontFamily="Archivo Black"
                  >
                    Enviar Mensaje
                  </Button>
                </VStack>
              </form>
            </Box>
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default Contact;
