'use client';
import { Box, Container, Grid, Heading, Text, VStack, Image } from '@chakra-ui/react';
import { useColorMode, useColorModeValue } from '../components/ui/color-mode';
import Ciro from "../../../public/ciro.png";


const AboutUs = () => {
  const textColor = useColorModeValue('#555454', '#D0D0D0');
  const { colorMode } = useColorMode();

  return (
    <Box bg={colorMode === 'dark' ? 'gray.800' : 'bg.muted'} py={12}  color={textColor}>
      {/* Primera sección */}
      <Heading mb={10} textAlign="center" fontFamily={"Archivo Black"} as="h1" fontSize={{ base: "4xl", md: "4vw" }} letterSpacing={"tighter"} lineHeight={{ base: 1.2, md: "11vh" }} color={textColor}>
        Dos amigos, una visión.
      </Heading>

      {/* Segunda sección */}
      <Container maxW="65%" py={12}>
        <Grid
          templateColumns={{ base: '1fr', md: '2fr 1fr' }}
          gap={12}
        >
          {/* Texto principal */}
          <VStack align="start" gap={12}>
            <Heading fontFamily={"Archivo Black"} as="h2" fontSize={{ base: "4xl", md: "5vw" }} letterSpacing={"tighter"} lineHeight={{ base: 1.2, md: "11vh" }} color={textColor}>
              Idea central
            </Heading>
            <Text fontSize="xl" lineHeight={1.5}>
              La idea nació para ser algo más que ropa, nuestro movimiento celebra ocuparse de lo que realmente importa. Estás BUSY en esos momentos que invertís en vos, tus sueños o lo que te moviliza, por lo que, estar BUSY es lo que nos ayuda a dar pasos hacia nuestra eudaimonía, lo que se convierte en accionar constante, y un accionar constante inevitablemente trae resultados.
              Emprendedores, empleados, artistas o estudiantes: tengas la ocupación que tengas, hay que ocuparse de lo que realmente te moviliza.
              <br />Keep Calm And Stay Busy.

            </Text>
          </VStack>

          {/* Espacio para imagen */}
          <Box
            backgroundSize="cover"
            backgroundPosition="center"
            borderRadius="lg"
          >
            <Image src={Ciro.src} alt="Ciro" w={"100%"}
              h={"85%"}
              borderRadius="lg"
            />
          </Box>
        </Grid>

        {/* Tercera sección */}
        <Grid
          templateColumns={{ base: '1fr', md: '1fr 1fr' }}
          gap={10}
        >
          {/* Tarjeta 1 */}
          <Box
            color={textColor}
            bg={colorMode === 'dark' ? 'gray.800' : 'bg.muted'}
            p={8}
            borderRadius="md"
            shadow="lg"
          >
            <Heading as="h3" size="md" mb={4}>
              Nuestra historia
            </Heading>
            <Text fontSize="md" lineHeight="tall">
              Busy no existiría sin las personas que trabajaron y creyeron en este proyecto. Desde amigos cercanos que pusieron sus manos en los detalles, hasta los que compraron o aportaron energía a la distancia. Mucha gente, TODOS ellos forman parte de esto.

              Creaciones por amigos Busy en constante educación, prendas trabajadas al detalle y una comunidad de valor. Si posta compartís algo de lo que significa BUSY, cada vez que veas nuestra marca pensá en ocuparte de ESO y reafirma, por qué ESO?

            </Text>
          </Box>

          {/* Tarjeta 2 */}
          <Box
            color={textColor}
            bg={colorMode === 'dark' ? 'gray.800' : 'bg.muted'}
            p={8}
            borderRadius="md"
            shadow="lg"
          >
            <Heading as="h3" size="md" mb={4}>
              Nuestra misión
            </Heading>
            <Text fontSize="sm" lineHeight="tall">
              <Text fontSize="xl" mb={6}>
                Queremos que esta idea realmente llegue a mas personas en el futuro y logremos impulsar a alguien que lo necesite.
              </Text>
            </Text>
          </Box>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutUs;
