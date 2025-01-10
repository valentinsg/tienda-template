'use client'
import React, { useState } from "react";
import { remove as removeDiacritics } from 'diacritics';
import {
  Box,
  Heading,
  Accordion,
  Input,
  VStack,
  Container,
  Button
} from "@chakra-ui/react";
import { AccordionItemTrigger, AccordionItemContent } from "@chakra-ui/react";
import { useColorMode, useColorModeValue } from '../components/ui/color-mode';
import "../styles/globals.css";

const FAQs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { colorMode } = useColorMode();
  const textColor = useColorModeValue('#555454', '#D0D0D0');
  const buttonColor = useColorModeValue('blue.500', 'blue.300');

  const faqData = [
    {
      category: "Sobre Busy",
      questions: [
        {
          question: "¿Qué significa Busy?",
          answer:
            "Busy es un lifestyle en el cuál nos identificamos antes de iniciar el proyecto."
        },
        {
          question: "¿Qué hace diferente a Busy de otras marcas?",
          answer:
            "En Busy priorizamos calidad, diseño único y un compromiso fuerte con nuestra comunidad.",
        },
        {
          question: "¿Cuál es la visión de Busy?",
          answer:
            "No solo queremos entregar productos de calidad y contenido elaborado, sino construir algo mas allá de lo empresarial, que las personas se hallen en nuestros valores y visión. Queremos que Busy sea una experiencia auténtica, ser parte de la vida de nuestros clientes y que se sientan parte de la comunidad que estamos construyendo entre todos.",
        }
      ],
    },
    {
      category: "Sobre los Productos",
      questions: [
        {
          question: "¿Qué tipó de calidad tienen sus productos?",
          answer:
            "Trabajamos mucho tiempo nuestros productos para no salir al mercado con algo que no nos guste, por eso, nos aseguramos de que cada prenda sea de la mejor calidad posible, tanto en su confección, como en las estampas o en sus materiales utilizados.",
        },
        {
          question: "¿Cómo cuidar mis prendas Busy?",
          answer:
            "Lava tus prendas con agua fría, usa un ciclo suave y evita secar a altas temperaturas. Igualmente recomendamos leer las instrucciones de lavado que vienen con la compra de tu prenda.",
        },
      ],
    },
    {
      category: "Sobre Compras Online",
      questions: [
        {
          question: "¿Es seguro comprar en su sitio web?",
          answer:
            "Sí, implementamos medidas de seguridad como certificados SSL y métodos de pago seguros.",
        },
        {
          question: "¿Cómo sé cuál es mi talla?",
          answer:
            "Consulta nuestra guía de tallas con medidas detalladas para pecho, cintura y cadera.",
        },
      ],
    },
    {
      category: "Sobre Métodos de Pago",
      questions: [
        {
          question: "¿Qué métodos de pago aceptan?",
          answer:
            "Aceptamos todos los métodos de pago.",
        },
        {
          question: "¿Puedo pagar en cuotas?",
          answer:
            "Sí, ofrecemos cuotas.",
        },
        {
          question: "¿Qué hago si mi pago fue rechazado?",
          answer:
            "Verifica los datos ingresados y asegúrate de que la tarjeta esté habilitada para compras online.",
        }
      ],
    },
    {
      category: "Sobre Envíos",
      questions: [
        {
          question: "¿Cuánto cuesta el envío?",
          answer:
            "Ofrecemos envíos gratuitos en compras superiores a $120000. Para otros pedidos, el costo varía según la ubicación.",
        },
        {
          question: "¿Cuánto tiempo tarda en llegar mi pedido?",
          answer:
            "El tiempo estimado de entrega puede variar entre 3 a 7 días hábiles.",
        },
      ],
    },
    {
      category: "Sobre Devoluciones",
      questions: [
        {
          question: "¿Cuál es la política de devoluciones?",
          answer:
            "Aceptamos devoluciones dentro de los 30 días posteriores a la compra, siempre que la prenda esté en perfecto estado.",
        },
        {
          question: "¿Cómo hago para cambiar una prenda?",
          answer:
            "Comunicate por Instagram @busy.streetwear o envianos un mail a busystreetwear@gmail.com para coordinar el cambio de la prenda y recibir instrucciones detalladas.",
        },
      ],
    },
    {
      category: "Sobre el Soporte al Cliente",
      questions: [
        {
          question: "¿Cómo puedo contactar al servicio al cliente?",
          answer:
            "Podes contactarnos a través de nuestro formulario de contacto en la web o enviando un email a busystreetwear@gmail.com",
        },
        {
          question: "¿Cuánto tardan en responder?",
          answer:
            "Responderemos todas sus consultas en un plazo de 24 horas hábiles.",
        },
      ],
    },
    {
      category: "Preguntas Generales",
      questions: [
        {
          question: "¿Puedo comprar desde mi celular?",
          answer:
            "Sí, nuestro sitio web es totalmente responsive y puedes realizar compras desde tu celular o dispositivo móvil.",
        },
        {
          question: "¿Qué hago si no recibo el email de confirmación?",
          answer:
            "Revisa tu bandeja de spam o correo no deseado. Si no encuentras el email, contáctanos para verificar el estado de tu pedido.",
        },
        {
          question: "¿Qué pasa si mi pedido no llega?",
          answer:
            "Si tu pedido se retrasa, comunícate con nosotros para rastrear el envío y brindarte una solución.",
        }
      ],
    },
    {
      category: "Sobre nuestra comunidad",
      questions: [
        {
          question: "¿Cómo puedo aparecer en su página o redes sociales?",
          answer:
            "Si querés ser parte de nuestra comunidad y aparecer en nuestras plataformas, etiquetanos en tus publicaciones/historias o envíanos tu contenido para ser considerado.",
        },
      ],
    },
    {
      category: "Sobre Responsabilidad Social y Sostenibilidad",
      questions: [
        {
          question: "¿Qué acciones toma Busy para ser sostenible?",
          answer:
            "Nos comprometemos ahora y a futuro a ser una marca sostenible, comenzando con un primer gesto en nuestro llavero de PLA que es biodegradable y podes acceder a el con la compra de una prenda de nuestro 1er drop. Sabemos que es muy pequeño el paso, pero, también sabemos que es el comienzo de un largo camino.",
        },
      ],
    }
  ];

  const normalizedSearchTerm = removeDiacritics(searchTerm.toLowerCase());

  const filteredFAQs = faqData
    .filter((section) =>
      removeDiacritics(section.category.toLowerCase()).includes(normalizedSearchTerm) ||
      section.questions.some((q) =>
        removeDiacritics(q.question.toLowerCase()).includes(normalizedSearchTerm)
      )
    )
    .map((section) => ({
      ...section,
      questions: section.questions.filter((q) =>
        removeDiacritics(q.question.toLowerCase()).includes(normalizedSearchTerm)
      ),
    }));

  return (
    <Box bg={colorMode === 'dark' ? 'gray.800' : 'bg.muted'} py={12} color={textColor}>
      <Container maxW={{base: "100%", md:"70%"}}>
        {/* Primera sección */}
        <Heading textAlign="center" fontFamily={"Archivo Black"} as="h1" fontSize={{ base: "4xl", md: "4vw" }} letterSpacing={"tighter"} lineHeight={{ base: 1.2, md: "11vh" }} color={textColor}>
          Preguntas Frecuentes.
        </Heading>
        {/* Barra de búsqueda */}
        <Input
          placeholder="Buscar una pregunta..."
          mt={8}
          size="lg"
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
          colorPalette={"blue"}
          borderColor={buttonColor}

        />
        <VStack align="stretch">
          {filteredFAQs.map((section) => section.questions.length > 0 && (
            <Box key={section.category} py={8} borderRadius="md">
              <Heading
                as="h2"
                fontSize={{base:"2xl", md:"4xl"}}
                textAlign={"center"}
                fontWeight={500}
                py={4}
                color={textColor}
                textTransform="uppercase"
                fontFamily={"Archivo Black"}
              >
                {section.category}
              </Heading>
              <Accordion.Root collapsible>
                {/* Sobre la Marca Busy */}
                {section.questions.map((faq, index) => (
                  <Accordion.Item key={index} value={`item-${index}`} m={4} borderRadius="md" bg={colorMode === 'dark' ? 'gray.700' : 'white'} color={textColor}>
                    <h2>
                      <AccordionItemTrigger
                        cursor={"pointer"}
                        p={4}
                        fontSize="xl"
                        _hover={{ bg: colorMode === 'dark' ? 'gray.600' : 'gray.200' }}
                        _expanded={{ bg: colorMode === 'dark' ? 'gray.600' : 'gray.200' }}
                        transition="background-color 0.2s ease"
                      >
                        <Box textAlign="center" fontSize={{base:"lg", md:"xl"}} fontFamily={"Archivo Black"} fontWeight={500} letterSpacing={"tighter"} textTransform="uppercase">
                          {faq.question}
                        </Box>
                      </AccordionItemTrigger>
                    </h2>
                    <AccordionItemContent px={4} py={4} fontSize="lg" textAlign="left" transition="max-height 1s ease in, padding 1s ease">
                      {faq.answer}
                    </AccordionItemContent>

                  </Accordion.Item>
                ))}
              </Accordion.Root>
            </Box>
          ))}
        </VStack>
        <Box textAlign={{base: "center",md:"end"}} mt={12}>
          <Button
            size="lg"
            fontWeight={600}
            colorPalette={"blue"}
            onClick={() => window.location.href = "/contact"}
          >
            No te quedes con nignuna duda y contáctanos.
          </Button>
        </Box>
      </Container>
    </Box >
  );
};

export default FAQs;
