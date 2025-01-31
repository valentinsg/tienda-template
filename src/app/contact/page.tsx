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
    <Box bg={colorMode === 'dark' ? 'gray.800' : 'bg.muted'} py={12} h={{ base: "auto", md: "90vh" }} color={textColor} as={"section"}>
      <Container maxW={{ base: "90%", md: "65%" }} >
        <VStack gap={8} >
          <Heading textAlign="center" mb={10} fontFamily={"Archivo Black"} as="h2" fontSize={{ base: "4xl", md: "4vw" }} letterSpacing={"tighter"} lineHeight={{ base: 1.2, md: "11vh" }} color={textColor}>
            Contáctanos.
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} w="full" as={"section"} >
            {/* Información de Contacto */}
            <Box>
              <VStack gap={4} align={{ base: "center", md: "stretch" }}>
                <Text
                  fontSize="2xl"
                  fontFamily="Archivo Black"
                  letterSpacing="tighter"
                  fontWeight={500}
                  as={"h3"}
                >
                  Información de Contacto
                </Text>

                <HStack gap={2}>
                  <Icon color={buttonColor} as={"span"}>
                    <MdLocationOn />
                  </Icon>
                  <Text as={"span"} fontSize={"lg"}>Nuestra casa (por ahora :D)</Text>
                </HStack>

                <HStack gap={2}>
                  <Icon color={buttonColor} as={"span"}>
                    <MdPhone />
                  </Icon>
                  <Text fontSize={"lg"} as={"span"}>+54 9 1158233292 o +54 9 2236680041 </Text>
                </HStack>

                <HStack gap={3}>
                  <Icon color={buttonColor} as={"span"}>
                    <MdEmail />
                  </Icon>
                  <Text fontSize={"lg"} as={"span"}>busystreetwear@gmail.com</Text>
                </HStack>
              </VStack>
            </Box>

            {/* Formulario de Contacto */}
            <Box mt={{ base: 20, md: "0" }}>
              <form onSubmit={handleSubmit}>
                <VStack gap={6}>
                  <Text fontFamily="Archivo Black" fontWeight={500} fontSize={"2xl"} as={"h2"}>
                    Nombre
                  </Text>
                  <Input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    placeholder="Tu nombre"
                    colorPalette={"blue"}
                    borderColor={buttonColor}
                    as={"input"}
                  />

                  <Text fontFamily="Archivo Black" fontWeight={500} fontSize={"2xl"} as={"h2"}>
                    Email
                  </Text>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="tu@email.com"
                    borderColor={buttonColor}
                    colorPalette={"blue"}
                    as={"input"}
                  />

                  <Text fontFamily="Archivo Black" fontWeight={500} fontSize={"2xl"} as={"h2"}>
                    Mensaje
                  </Text>
                  <Textarea
                    value={formData.mensaje}
                    as={"textarea"}
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
                    as={"button"}
                    fontWeight={700}
                    aria-label="Enviar mensaje"
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
