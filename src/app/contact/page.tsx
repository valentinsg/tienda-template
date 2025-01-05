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
import { useColorMode, useColorModeValue } from '../components/ui/color-mode';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });

  const textColor = useColorModeValue('#555454', '#D0D0D0');
  const { colorMode } = useColorMode();
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
    <Box bg={colorMode === 'dark' ? 'gray.800' : 'bg.muted'} py={12} color={textColor}>
      <Container maxW="65%">
        <VStack gap={8}>
          <Heading textAlign="center" mb={10} fontFamily={"Archivo Black"} as="h1" fontSize={{ base: "4xl", md: "4vw" }} letterSpacing={"tighter"} lineHeight={{ base: 1.2, md: "11vh" }} color={textColor}>
            Contáctanos.
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} w="full">
            {/* Información de Contacto */}
            <Box>
              <VStack gap={6} align="stretch">
                <Heading
                  size="xl"
                  fontFamily="Archivo Black"
                  letterSpacing="tighter"
                  fontWeight={500}
                >
                  Información de Contacto
                </Heading>

                <HStack gap={2}>
                  <Icon boxSize={8} color={buttonColor}>
                    <MdLocationOn />
                  </Icon>
                  <Text fontSize={"lg"}>Nuestra casa (por ahora :D)</Text>
                </HStack>

                <HStack gap={2}>
                  <Icon boxSize={8} color={buttonColor}>
                    <MdPhone />
                  </Icon>
                  <Text fontSize={"lg"}>+54 9 1158233292 o +54 9 2236680041 </Text>
                </HStack>

                <HStack gap={2}>
                  <Icon boxSize={8} color={buttonColor}>
                    <MdEmail />
                  </Icon>
                  <Text fontSize={"lg"}>busystreetwear@gmail.com</Text>
                </HStack>
              </VStack>
            </Box>

            {/* Formulario de Contacto */}
            <Box>
              <form onSubmit={handleSubmit}>
                <VStack gap={6}>
                  <Text fontFamily="Archivo Black" fontWeight={500} fontSize={"lg"}>Nombre</Text>
                  <Input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    placeholder="Tu nombre"
                    colorPalette={"blue"}
                    borderColor={buttonColor}
                  />

                  <Text fontFamily="Archivo Black" fontSize={"lg"} fontWeight={500}>Email</Text>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="tu@email.com"
                    borderColor={buttonColor}
                    colorPalette={"blue"}
                  />

                  <Text fontFamily="Archivo Black" fontSize={"lg"} fontWeight={500}>Mensaje</Text>
                  <Textarea
                    value={formData.mensaje}
                    colorPalette={"blue"}
                    onChange={(e) =>
                      setFormData({ ...formData, mensaje: e.target.value })
                    }
                    placeholder="Tu mensaje"
                    borderColor={buttonColor}
                    rows={4}
                  />

                  <Button
                    type="submit"
                    colorPalette={"blue"}
                    w="full"
                    fontWeight={700}
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
