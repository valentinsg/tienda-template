'use client';
import { Box, Container, Grid, Heading, Text, VStack, Button } from '@chakra-ui/react';
import { useColorModeValue } from '../components/ui/color-mode';

const AboutUs = () => {
  const bgColor = useColorModeValue('bg.muted', '#555454'); 
  const textColor = useColorModeValue('#555454', '#D0D0D0');
  const buttonColor = useColorModeValue('black', 'white');
  const buttonBg = useColorModeValue('#D0D0D0', '#555454'); 

  return (
    <Box bg={bgColor} py={12} color={textColor}>
      {/* Primera sección */}
      <Container maxW="6xl" textAlign="center" mb={10}>
        <Heading as="h1" size="2xl" fontWeight="bold" mb={6}>
          Empoderando a descubrir y despertar tu confianza inquebrantable
        </Heading>
        <Text fontSize="lg" mb={6}>
          Descubre cómo podemos ayudarte a alcanzar tu mejor versión.
        </Text>
        <Button
          size="lg"
          bg={buttonBg}
          color={buttonColor}
          _hover={{ bg: textColor, color: bgColor }}
        >
          Descubre más
        </Button>
      </Container>

      {/* Segunda sección */}
      <Container maxW="6xl">
        <Grid
          templateColumns={{ base: '1fr', md: '2fr 1fr' }}
          gap={10}
          mb={12}
        >
          {/* Texto principal */}
          <VStack align="start" gap={6}>
            <Heading as="h2" size="lg">
              Bienvenido a nuestro mundo
            </Heading>
            <Text fontSize="md" lineHeight="tall">
              Este es el espacio donde compartimos nuestra historia y misión.
              Hemos trabajado durante años para traer a nuestros clientes no
              solo productos de calidad, sino una experiencia que transforma
              vidas. Todo comenzó con una visión clara y el deseo de marcar la
              diferencia.
            </Text>
            <Button
              bg={buttonBg}
              color={buttonColor}
              _hover={{ bg: textColor, color: bgColor }}
            >
              Ver más
            </Button>
          </VStack>

          {/* Espacio para imagen */}
          <Box
            bg="gray.300"
            w="full"
            h="300px"
            borderRadius="md"
            backgroundSize="cover"
            backgroundPosition="center"
          >
            {/* Aquí puedes agregar una imagen de fondo */}
          </Box>
        </Grid>

        {/* Tercera sección */}
        <Grid
          templateColumns={{ base: '1fr', md: '1fr 1fr' }}
          gap={10}
        >
          {/* Tarjeta 1 */}
          <Box
            bg={textColor}
            color={bgColor}
            p={8}
            borderRadius="md"
            shadow="lg"
          >
            <Heading as="h3" size="md" mb={4}>
              Nuestra historia
            </Heading>
            <Text fontSize="sm" lineHeight="tall">
              Fundada en 2020, nuestra misión siempre ha sido ofrecer lo mejor
              en diseño y calidad. Con el tiempo, hemos crecido gracias a la
              confianza de nuestros clientes.
            </Text>
          </Box>

          {/* Tarjeta 2 */}
          <Box
            bg={textColor}
            color={bgColor}
            p={8}
            borderRadius="md"
            shadow="lg"
          >
            <Heading as="h3" size="md" mb={4}>
              Nuestra misión
            </Heading>
            <Text fontSize="sm" lineHeight="tall">
              Queremos inspirar confianza y estilo, garantizando que cada pieza
              que llevamos a nuestros clientes refleje nuestra pasión por la
              excelencia.
            </Text>
          </Box>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutUs;
