import React from "react";
import {
  Box,
  Heading,
  Accordion,
} from "@chakra-ui/react";
import { AccordionItemTrigger, AccordionItemContent } from "@chakra-ui/react";

const FAQs = () => {
  return (
    <Box p={6} minH={"100vh"}>
      <Heading as="h1" mb={6} textAlign="center" fontSize="2xl">
        Preguntas Frecuentes
      </Heading>
      <Accordion.Root>
        {/* Sobre la Marca Busy */}
        <Accordion.Item value="item-1">
          <h2>
            <AccordionItemTrigger>
              <Box flex="1" textAlign="left">
                ¿Qué significa Busy?
              </Box>
            </AccordionItemTrigger>
          </h2>
          <AccordionItemContent pb={4}>
            Busy significa estar en movimiento, ocupado en lo que te apasiona y enfocado en tus metas. Es una marca que celebra a las personas que nunca dejan de perseguir sus sueños.
          </AccordionItemContent>
        </Accordion.Item>

        {/* Sobre los Productos */}
        <Accordion.Item value="item-2">
          <h2>
            <AccordionItemTrigger>
              <Box flex="1" textAlign="left">
                ¿Cómo eligen los materiales para las prendas?
              </Box>
            </AccordionItemTrigger>
          </h2>
          <AccordionItemContent pb={4}>
            Seleccionamos materiales de alta calidad que aseguran comodidad y durabilidad. El proceso de diseño combina funcionalidad con estilo único.
          </AccordionItemContent>
        </Accordion.Item>

        {/* Sobre Compras Online */}
        <Accordion.Item value="item-3">
          <h2>
            <AccordionItemTrigger>
              <Box flex="1" textAlign="left">
                ¿Es seguro comprar en su sitio web?
              </Box>
            </AccordionItemTrigger>
          </h2>
          <AccordionItemContent pb={4}>
            Sí, implementamos medidas de seguridad como certificados SSL y métodos de pago seguros para proteger tus datos.
          </AccordionItemContent>
        </Accordion.Item>

        {/* Sobre Envíos */}
        <Accordion.Item value="item-4">
          <h2>
            <AccordionItemTrigger>
              <Box flex="1" textAlign="left">
                ¿Cuánto cuesta el envío?
              </Box>
            </AccordionItemTrigger>
          </h2>
          <AccordionItemContent pb={4}>
            Ofrecemos envíos gratuitos en compras superiores a $X. Para otros pedidos, el costo varía según la ubicación.
          </AccordionItemContent>
        </Accordion.Item>

        {/* Sobre Devoluciones y Cambios */}
        <Accordion.Item value="item-5">          
          <h2>
          <AccordionItemTrigger>
            <Box flex="1" textAlign="left">
              ¿Cuál es la política de devoluciones?
            </Box>
          </AccordionItemTrigger>
        </h2>
          <AccordionItemContent pb={4}>
            Aceptamos devoluciones dentro de los 30 días posteriores a la compra, siempre que la prenda esté en perfecto estado y con etiquetas originales.
          </AccordionItemContent>
        </Accordion.Item>
      </Accordion.Root>
    </Box>
  );
};

export default FAQs;
