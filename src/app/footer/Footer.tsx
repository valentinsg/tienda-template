'use client';
import { useState } from 'react';
import { Flex, Heading, Input, Text, Box, Link, HStack, useBreakpointValue, Icon } from '@chakra-ui/react';
import Image from 'next/image';
import { useColorMode, useColorModeValue } from '../components/ui/color-mode';
import { Button } from "../components/ui/button";
import { toaster } from '../components/ui/toaster';
import BusyDarkMode from '../../../public/busy-logo-dark-mode.png';
import BusyLightMode from '../../../public/busy-logo-light-mode.png';
import Visa from '../../../public/visa.png';
import Mastercard from '../../../public/mastercard.png';
import MercadoPago from '../../../public/mercadopagop.png';
import { FaInstagram, FaTiktok } from 'react-icons/fa';

export default function Footer() {
  const { colorMode } = useColorMode();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const textColor = useColorModeValue('gray.700', '#D0D0D0');
  const hoverColor = useColorModeValue("gray.600", "gray.400");
  const buttonColor = useColorModeValue('blue.500', 'blue.300');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toaster.create({
        title: "Error",
        description: "Por favor ingresa tu email",
        duration: 5000,
        meta: {
          closable: true,
        },
      });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toaster.create({
        title: "Error",
        description: "Por favor ingresa un email válido",
        duration: 5000,
        meta: {
          closable: true,
        },
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error === "exists") {
        toaster.create({
          title: "Email ya registrado",
          description: "Este email ya está suscrito a nuestra newsletter",
          duration: 5000,
          meta: {
            closable: true,
          },
        });
      } else if (data.message === "success") {
        toaster.create({
          title: "¡Gracias por suscribirte!",
          description: `Tu código de descuento es: ${data.discountCode}. Te hemos enviado un email con más información.`,
          duration: 7000,
          meta: {
            closable: true,
          },
        });
        setEmail("");
      } else {
        throw new Error(data.error || "Error desconocido");
      }
    } catch (error) {
      console.error("Error:", error);
      toaster.create({
        title: "Error",
        description: "Hubo un error al procesar tu solicitud. Por favor intenta nuevamente.",
        duration: 5000,
        meta: {
          closable: true,
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex 
      as="footer" 
      bg={colorMode === 'dark' ? 'gray.900' : '#D0D0D0'} 
      flexDir="column" 
      w="100%" 
      p={8} 
      shadow="md"
      zIndex="1000"
    >
      {/* Sección de suscripción */}
      <Flex
        flexDir={{ base: "column", md: "row" }}
        justifyContent="space-between"
        p={6}
        alignItems="center"
        gap={8}
      >
        <Flex flexDir="column" w={{ base: "100%", md: "50%" }} gap={8}>
          <Heading
            fontSize={useBreakpointValue({ base: "2xl", md: "2.35vw" })}
            lineHeight={1.2}
            fontFamily="Archivo Black"
            fontWeight={500}
            letterSpacing="tighter"
            textAlign={{ base: "center", md: "left" }}
            color={textColor}
          >
            Sé el primero en enterarte de todas nuestras novedades
          </Heading>
          <form onSubmit={handleSubmit}>
            <Flex w={{ base: "100%", md: "95%" }} alignItems="center" mt={10}>
              <Input
                placeholder="me@example.com"
                borderColor={useColorModeValue('gray.400', 'gray.600')}
                colorPalette={"blue"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                color={textColor}
                disabled={isLoading}
                fontSize={"md"}
                letterSpacing={"tighter"}
                borderRadius="0 0 0 0"
              />
              <Button
                type="submit"
                colorPalette={"blue"}
                fontWeight={600}
                disabled={isLoading}
                letterSpacing={"tighter"}
                borderRadius="0 0 0 0"
              >
                {isLoading ? "Enviando..." : "Suscríbete"}
              </Button>
            </Flex>
          </form>
        </Flex>

        <Box display={{ base: "none", md: "block" }}>
          <Link href="/">
            <Image
              src={colorMode === 'dark' ? BusyDarkMode : BusyLightMode}
              alt="Busy logo"
              width={475}
            />
          </Link>
        </Box>
      </Flex>

      {/* Rest of the footer remains the same */}
      <Box as="hr" my={8} borderColor={useColorModeValue('gray.400', 'gray.600')} />

      <Flex flexDir={{ base: "column", md: "row" }} gap={10} fontSize={"lg"} letterSpacing={"tighter"}>
        <Box gap={8} fontWeight={600} p={10} >
          <Text color={textColor} ><Link href="/products" _hover={{ color: hoverColor }}>Productos</Link></Text>
          <Text color={textColor} ><Link href="/about" _hover={{ color: hoverColor }}>Sobre nosotros</Link></Text>
          <Text color={textColor} ><Link href="#" _hover={{ color: hoverColor }}>Instagram</Link></Text>
          <Text color={textColor} ><Link href="#" _hover={{ color: hoverColor }}>TikTok</Link></Text>
        </Box>
        <Box gap={8} fontWeight={600} p={10}>
          <Text color={textColor} ><Link href="/contact" _hover={{ color: hoverColor }}>Contacto</Link></Text>
          <Text color={textColor} ><Link href="/faqs" _hover={{ color: hoverColor }}>FAQs</Link></Text>
          <Text color={textColor}  _hover={{ color: hoverColor }}> <Link href="/terms" _hover={{ color: hoverColor }}>Términos y Condiciones</Link> </Text>
          <Text color={textColor}  _hover={{ color: hoverColor }}><Link href="/privacy" _hover={{ color: hoverColor }}>Política de Privacidad</Link> </Text>
        </Box>
      </Flex>

      <Flex
        flexDir={{ base: "column", md: "row" }}
        justifyContent="space-between"
        alignItems="center"
        color={textColor}
        px={8}
      >
        <Text display={{base: "none", md: "block"}} fontSize="lg" fontWeight={600} textAlign={{ base: "center", md: "left" }} letterSpacing={"tighter"}>
          Busy es un estilo de vida para quienes ocupan su tiempo en lo que realmente importa.
        </Text>
        <HStack gap={8} mt={{ base: 8, md: 0 }}>
          <Link href="#" _hover={{ color: hoverColor }}>
            <Icon
              _hover={{ transform: "scale(1.1)" }}
              transition="all 0.5s ease"
              size={"xl"}
            >
              <FaTiktok />
            </Icon>
          </Link>
          <Link href="#" _hover={{ color: hoverColor }}>
            <Icon
              _hover={{ transform: "scale(1.1)" }}
              transition="all 0.5s ease"
              size={"xl"}
            >
              <FaInstagram />
            </Icon>
          </Link>
          <Image src={Visa} alt="Visa" width={50} height={50} />
          <Image src={Mastercard} alt="Mastercard" width={50} height={50} />
          <Image src={MercadoPago} alt="MercadoPago" width={45} height={45} />
        </HStack>
      </Flex>

      <Text mt={10} mb={6} fontSize="lg" textAlign="center" color={textColor} letterSpacing={"tighter"}>
        &copy; 2024 Busy. Todos los derechos reservados.
      </Text>
    </Flex>
  );
}