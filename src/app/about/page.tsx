'use client';
import { Box, Container, Grid, Heading, Text, VStack, Image } from '@chakra-ui/react';
import { useColorMode, useColorModeValue } from '../components/ui/color-mode';
import Ciro from "../../../public/ciro.png";


const AboutUs = () => {
  const textColor = useColorModeValue('#555454', '#D0D0D0');
  const { colorMode } = useColorMode();
  const dosAmigos = "https://tfufdiayyhcndcgncylf.supabase.co/storage/v1/object/sign/imagenes%20web/creadores.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZW5lcyB3ZWIvY3JlYWRvcmVzLmpwZyIsImlhdCI6MTczNTk1OTc4MSwiZXhwIjoxNzY3NDk1NzgxfQ.eMCVXQ1yX0dunuQkdmV0eBeVBF5RVwbKVa9ft3I3hLw&t=2025-01-04T03%3A03%3A01.629Z"
  const dosAmigos2 = "https://tfufdiayyhcndcgncylf.supabase.co/storage/v1/object/sign/imagenes%20web/sobre-nosotros_6.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZW5lcyB3ZWIvc29icmUtbm9zb3Ryb3NfNi5wbmciLCJpYXQiOjE3MzU5NjA1NTcsImV4cCI6MTc2NzQ5NjU1N30.jIPcnBHiswkoG2_QYM8_L-WWOBjKSiiylQ1_BwNzECw&t=2025-01-04T03%3A15%3A57.251Z"
  const community = "https://tfufdiayyhcndcgncylf.supabase.co/storage/v1/object/sign/imagenes%20web/sobre-nosotros_1.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZW5lcyB3ZWIvc29icmUtbm9zb3Ryb3NfMS5wbmciLCJpYXQiOjE3MzU5NjA1ODksImV4cCI6MTc2NzQ5NjU4OX0.53y-sG87NW8owUsOp6nsviXza9NnJ5rUTPd-ckB7L6s&t=2025-01-04T03%3A16%3A29.753Z"
  return (
    <Box bg={colorMode === 'dark' ? 'gray.800' : 'bg.muted'} py={12} color={textColor}>
      {/* Primera sección */}
      <Heading mb={10} textAlign="center" fontFamily={"Archivo Black"} as="h1" fontSize={{ base: "4xl", md: "4vw" }} letterSpacing={"tighter"} lineHeight={{ base: 1.2, md: "11vh" }} color={textColor}>
        Sobre nosotros
      </Heading>

      {/* Segunda sección */}
      <Container maxW="65%" py={20}>
        <Grid
          templateColumns={{ base: '1fr', md: '2fr 3fr' }}
          gap={6}
        >
          <Box
            backgroundSize="cover"
            backgroundPosition="center"
            borderRadius="lg"
          >
            <Image src={dosAmigos} alt="Ciro" w={"100%"}
              h={"100%"}
              borderRadius="lg"
            />
          </Box>
          <VStack gap={10}>
            <Heading textAlign={"end"} fontFamily={"Archivo Black"} as="h2" fontSize={{ base: "4xl", md: "5vw" }} letterSpacing={"tighter"} lineHeight={{ base: 1.2, md: "11vh" }} color={textColor}>
              Dos amigos, una visión.
            </Heading>
            <Text textAlign={"end"} fontSize="xl" lineHeight={1.5}>
              Busy nació de la conexión entre dos amigos que compartían una visión: crear algo más grande que ellos mismos. Pero no hubiéramos llegado acá si no fuera por la ayuda de otros amigos que, con pequeños y grandes gestos, dejaron su huella en este proyecto.
              Busy no existiría sin las personas que trabajaron y creyeron en el proyecto. Desde amigos cercanos que pusieron sus manos en los detalles, hasta los que cebaron mate los días de rodaje, aportaron energía a la distancia o nos compraron. TODOS esas personas queremos que sepan que ya forman parte de esto.
            </Text>
          </VStack>
        </Grid>

        <Grid
          templateColumns={{ base: '1fr', md: '2fr 1.2fr' }}
          gap={6}
          mt={40}
        >
          {/* Texto principal */}
          <VStack align="start" gap={10}>
            <Heading fontFamily={"Archivo Black"} as="h2" fontSize={{ base: "4xl", md: "5vw" }} letterSpacing={"tighter"} lineHeight={{ base: 1.2, md: "11vh" }} color={textColor}>
              Idea central
            </Heading>
            <Text fontSize="xl" lineHeight={1.5}>
              Busy pretende ser más que ropa, nuestro movimiento celebra ocuparse de lo que realmente importa. Estás BUSY en esos momentos que invertís en vos, tus sueños o lo que te moviliza, por lo que, estar BUSY es lo que nos ayuda a dar pasos hacia nuestra eudaimonía, lo que se convierte en accionar constante, y un accionar constante inevitablemente atrae buenos resultados. <br />
              Emprendedores, empleados, artistas o estudiantes: no importa tú ocupación, importa ocuparse, pero de eso que realmente nos moviliza, de eso que nos hace crecer.
              <br /> <br />-Keep Calm And Stay Busy.

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
          templateColumns={{ base: '1fr', md: '2fr' }}
          gap={6}
        >
          {/* Texto principal */}
          <VStack align="center" gap={10}>
            <Heading fontFamily={"Archivo Black"} as="h2" fontSize={{ base: "4xl", md: "5vw" }} letterSpacing={"tighter"} lineHeight={{ base: 1.2, md: "11vh" }} color={textColor}>
              Un Movimiento Busy
            </Heading>
            <Text fontSize="sm" lineHeight="tall">
              <Text fontSize="xl" mb={6}>
                Estamos preparando eventos, lanzamientos especiales y muchas sorpresas para la comunidad que buscamos crear. Seguí nuestras redes y suscribite a nuestra newsletter para no perderte nada de lo que se viene.

                En Busy, creemos que ocuparse de lo que importa puede transformar vidas y comunidades. Queremos inspirar a otros con nuestra filosofía y demostrar que es posible hacer las cosas de manera diferente.

                Queremos colaborar con iniciativas que reflejen esta filosofía: apoyar artistas, impulsar emprendedores y expandir este movimiento.

                Creaciones por amigos en constante educación, prendas trabajadas al detalle y la creación de una comunidad de valor. Si posta compartís algo de lo que significa BUSY, cada vez que veas nuestra marca pensá en ocuparte de ESO y reafirma, por qué ESO?
              </Text>
            </Text>
          </VStack>
          <Box
            backgroundSize="cover"
            backgroundPosition="center"
            borderRadius="lg"
          >
            <Image src={community} alt="Ciro" w={"100%"}
              h={"60%"}
              borderRadius="lg"
            />
          </Box>
        </Grid>
        
      </Container>
    </Box>
  );
};

export default AboutUs;
