'use client';
import { Box, Container, Grid, Heading, Text, VStack, Image } from '@chakra-ui/react';
import { useColorMode, useColorModeValue } from '../components/ui/color-mode';
import Ciro from "../../../public/ciro.png";
import { useEffect, useState } from 'react';

const AboutUs = () => {
  const textColor = useColorModeValue('#555454', '#D0D0D0');
  const { colorMode } = useColorMode();
  const dosAmigos = "https://tfufdiayyhcndcgncylf.supabase.co/storage/v1/object/sign/imagenes%20web/creadores.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZW5lcyB3ZWIvY3JlYWRvcmVzLmpwZyIsImlhdCI6MTczNTk1OTc4MSwiZXhwIjoxNzY3NDk1NzgxfQ.eMCVXQ1yX0dunuQkdmV0eBeVBF5RVwbKVa9ft3I3hLw&t=2025-01-04T03%3A03%3A01.629Z"
  const community = "https://tfufdiayyhcndcgncylf.supabase.co/storage/v1/object/sign/imagenes%20web/cosas-enelpiso.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZW5lcyB3ZWIvY29zYXMtZW5lbHBpc28uanBnIiwiaWF0IjoxNzM2MDQwNjg5LCJleHAiOjE3Njc1NzY2ODl9.e4lqOJtoC87dXUTsdHaedz_vKv_SWHEaqBtdZJC7xDI&t=2025-01-05T01%3A31%3A32.108Z"
  const community2 = "https://tfufdiayyhcndcgncylf.supabase.co/storage/v1/object/sign/imagenes%20web/sobre-nosotros_6.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZW5lcyB3ZWIvc29icmUtbm9zb3Ryb3NfNi5qcGciLCJpYXQiOjE3MzYwNDA2NzEsImV4cCI6MTc2NzU3NjY3MX0.umAfXeFc0-z7t54MqJr79q2amTMEUCo05yLrOfeSyac&t=2025-01-05T01%3A31%3A13.358Z"
  const community3 = "https://tfufdiayyhcndcgncylf.supabase.co/storage/v1/object/sign/imagenes%20web/sobre-nosotros_5.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZW5lcyB3ZWIvc29icmUtbm9zb3Ryb3NfNS5qcGciLCJpYXQiOjE3MzYwNDA2NDIsImV4cCI6MTc2NzU3NjY0Mn0.rFFZkbFYzD7yHZMfIgTtP-S16OLMP9UU98FxbGnMc0A&t=2025-01-05T01%3A30%3A44.177Z"
  const [currentSlide, setCurrentSlide] = useState(1);

  const slides = [
    {
      id: 1,
      image: community,
      alt: "Comunidad Busy - Eventos y actividades",      
      objectFit: "contain",
      objectPosition: "top"
    },
    {
      id: 2,
      image: community2,
      alt: "Comunidad Busy - Momentos compartidos",      
      objectFit: "contain",
      objectPosition: "center"
    },
    {
      id: 3,
      image: community3,
      alt: "Comunidad Busy - Filosofía de ocuparse",      
      objectFit: "contain",
      objectPosition: "center"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <Box bg={colorMode === 'dark' ? 'gray.800' : 'bg.muted'} py={12} color={textColor} as={"section"}>
      {/* Primera sección */}
      <Heading mb={10} textAlign="center" fontFamily={"Archivo Black"} as="h1" fontSize={{ base: "4xl", md: "4vw" }} letterSpacing={"tighter"} lineHeight={{ base: 1.2, md: "11vh" }} color={textColor}>
        Sobre nosotros
      </Heading>

      {/* Segunda sección */}
      <Container maxW={{ base: "100%", md: "75%" }} py={20}>
        <Grid
          templateColumns={{ base: '1fr', md: '2fr 2fr' }}
          gap={6}
        >
          <Box
            backgroundSize="cover"
            backgroundPosition="center"
            borderRadius="lg"
          >
            <Image src={dosAmigos} alt="Dos amigos fundadores de Busy" w={"100%"}
              h={"100%"}
              borderRadius="lg"
            />
          </Box>
          <VStack gap={10}>
            <Text textAlign={{ base: "center", md: "end" }} fontFamily={"Archivo Black"} as="h2" fontSize={{ base: "4xl", md: "4.8vw" }} letterSpacing={"tighter"} lineHeight={{ base: 1.2, md: "11vh" }} color={textColor}>
              Dos amigos, una visión.
            </Text>
            <Text textAlign={{ base: "start", md: "end" }} fontSize="xl" lineHeight={1.5} as={"p"}>
              Busy nació de la conexión entre dos amigos que compartían una visión: crear algo más grande que ellos mismos. Pero no hubiéramos llegado acá si no fuera por la ayuda de nuestros amigos que dejaron su huella en el proyecto, con gestos grandes y pequeños.
              Busy no existiría sin las personas que trabajaron y creyeron en el proyecto. Desde amigos cercanos que pusieron sus manos en los detalles, hasta los que cebaron mate los días de rodaje, aportaron energía a la distancia o compraron. TODOS esas personas queremos que sepan que forman parte de esto.
            </Text>
          </VStack>
        </Grid>

        <Grid
          templateColumns={{ base: '1fr', md: '2fr 2fr' }}
          gap={6}
          mt={40}
        >
          {/* Texto principal */}
          <VStack align={{ base: "center", md: "start" }} gap={10}>
            <Text fontFamily={"Archivo Black"} as="h2" fontSize={{ base: "4xl", md: "4.8vw" }} letterSpacing={"tighter"} lineHeight={{ base: 1.2, md: "11vh" }} color={textColor}>
              Idea central
            </Text>
            <Text fontSize="xl" lineHeight={1.5}>
              Busy pretende ser un movimiento que celebre ocuparse de lo que realmente importa. Estás BUSY en esos momentos que invertís en vos, tus sueños o lo que te moviliza, por lo que estar BUSY nos ayuda a dar pasos hacia nuestra eudaimonía, lo que se traduce en un accionar constante, y un accionar constante inevitablemente atrae buenos resultados. <br />

              <br /> Por esto todos nuestros productos van a estar intrínsecamente de este concepto que tanto nos motiva. Nuestro pequeño aporte a la cultura de la moda viene con este mensaje que esperamos se expanda y logré abrir cabezas o ayude a alguien que necesite encontrar/alcanzar su pasión.
              <br /><br /> Emprendedores, empleados, artistas o estudiantes: no importa tú ocupación, lo que importa es ocuparse, no preocuparse, eso que realmente nos moviliza, eso que nos hace crecer es lo que pregona BUSY.
              <br /> <br />-Keep Calm And Stay

            </Text>

          </VStack>

          {/* Espacio para imagen */}
          <Box
            backgroundSize="cover"
            backgroundPosition="center"
            borderRadius="lg"
          >
            <Image
              src={Ciro.src}
              alt="Ciro"
              w={"100%"}
              h={"90%"}
              borderRadius="lg"
            />
          </Box>
        </Grid>

        {/* Texto principal */}
        <VStack align="center" gap={10}>
          <Text fontFamily={"Archivo Black"} as="h2" fontSize={{ base: "4xl", md: "5vw" }} letterSpacing={"tighter"} lineHeight={{ base: 1.2, md: "11vh" }} color={textColor}>
            Un Movimiento Busy
          </Text>
          <Text fontSize="sm" lineHeight="tall">
            <Text fontSize="xl" mb={6}>
              Estamos preparando eventos, lanzamientos especiales y muchas sorpresas para la comunidad que buscamos crear. Seguí nuestras redes y suscribite a nuestra newsletter para no perderte nada de lo que se viene.

              En Busy, creemos que algo tan sencillo y obvio como ocuparse de lo que importa, puede cambiar vidas y comunidades.

              Queremos colaborar con iniciativas que reflejen esta filosofía: apoyar artistas, impulsar emprendedores y expandir este movimiento.

              Creaciones por amigos en constante educación, prendas trabajadas al detalle y la intención de crear una comunidad de valor.

              Si posta compartís algo de lo que significa BUSY, cada vez que veas nuestra marca pensá en ocuparte de ESO y reafirma, por qué ESO?

            </Text>
          </Text>
          <Box
            position="relative"
            width="100%"
            height="800px"
          >
            {slides.map((slide, index) => (
              <Box
                key={slide.id}
                opacity={index === currentSlide ? 1 : 0}
                visibility={index === currentSlide ? "visible" : "hidden"}
                transition="opacity 0.8s ease-in-out"
                borderRadius="lg"
                position={index === currentSlide ? "relative" : "absolute"}
                width="100%"
                height="100%"
              >
                <Image
                  borderRadius="lg"
                  src={slide.image}
                  width="100%"
                  height="100%"
                  alt={slide.alt}
                />
              </Box>
            ))}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default AboutUs;
