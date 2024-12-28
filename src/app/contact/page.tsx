'use client'
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
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });

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
    <Container maxW="6xl" py={10}>
      <VStack gap={8}>
        <Heading as="h1" size="xl" textAlign="center">
          Contacto
        </Heading>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={10} w="full">
          <Box>
            <VStack gap={6} align="stretch">
              <Heading size="md" mb={4}>
                Información de Contacto
              </Heading>

              <HStack gap={4}>
                <Icon boxSize={6} color="blue.500">
                  <MdLocationOn />
                </Icon>
                <Text>Calle Ejemplo 123</Text>
              </HStack>

              <HStack gap={4}>
                <Icon boxSize={6} color="blue.500" >
                  <MdPhone />
                </Icon>
                <Text>(123) 456-7890</Text>
              </HStack>

              <HStack gap={4}>
                <Icon boxSize={6} color="blue.500">
                  <MdEmail />
                </Icon>
                <Text>info@mitienda.com</Text>
              </HStack>
            </VStack>
          </Box>

          <Box>
            <form onSubmit={handleSubmit}>
              <VStack gap={4}>
                <Text>Nombre</Text>
                <Input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Tu nombre"
                  borderColor="blue.500"
                />

                <Text>Email</Text>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="tu@email.com"
                  borderColor="blue.500"
                />
                <Text>Mensaje</Text>
                <Textarea
                  value={formData.mensaje}
                  onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                  placeholder="Tu mensaje"
                  borderColor="blue.500"
                  rows={4}
                />

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  w="full"
                  mt={4}
                >
                  Enviar Mensaje
                </Button>
              </VStack>
            </form>
          </Box>
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default Contact;