'use client';
import { Flex, Heading, Input, Text, Box, Link, HStack, Stack, Grid, useBreakpointValue, Icon } from '@chakra-ui/react';
import Image from 'next/image';
import { useColorMode, useColorModeValue } from '../components/ui/color-mode';
import { Button } from "../components/ui/button";
import BusyDarkMode from '../../../public/busy-logo-dark-mode.png';
import BusyLightMode from '../../../public/busy-logo-light-mode.png';
import Visa from '../../../public/visa.png';
import Mastercard from '../../../public/mastercard.png';
import MercadoPago from '../../../public/mercadopagop.png';
import { FaInstagram, FaTiktok } from 'react-icons/fa';

export default function Footer() {
  const { colorMode } = useColorMode();
  const bgColor = useColorModeValue("#D0D0D0", 'gray.800');
  const textColor = useColorModeValue('gray.700', '#D0D0D0');
  const hoverColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Flex bg={bgColor} flexDir="column" w="100%" p={8} shadow="md">
      {/* Sección de suscripción */}
      <Flex
        flexDir={{ base: "column", md: "row" }}
        justifyContent="space-between"
        p={6}
        alignItems="center"
        gap={8}
      >
        <Flex flexDir="column" w={{ base: "100%", md: "50%" }} gap={6}>
          <Heading
            fontSize={useBreakpointValue({ base: "2xl", md: "2.3vw" })}
            lineHeight={1.2}
            fontFamily="Archivo Black"
            letterSpacing="tighter"
            textAlign={{ base: "center", md: "left" }}
            color={textColor}
          >
            Sé el primero en enterarte de todas nuestras novedades
          </Heading>
          <Flex w={{ base: "100%", md: "95%" }} alignItems="center" mt={6}>
            <Input
              placeholder="me@example.com"
              variant="subtle"
              _hover={{ borderColor: hoverColor }}
              borderColor={useColorModeValue('gray.600', 'none')}
              flex="1"
            />
            <Button
              bg={useColorModeValue('gray.600', 'gray.400')}
              color="white"
              borderRadius="lg"
              _hover={{ bg: hoverColor }}
              ml={-2}
            >
              Suscríbete
            </Button>
          </Flex>
        </Flex>

        <Box display={{ base: "none", md: "block" }}>
          <Link href="/">
            <Image
              src={colorMode === 'dark' ? BusyDarkMode : BusyLightMode}
              alt="Busy logo"
              width={450}
            />
          </Link>
        </Box>
      </Flex>

      <Box as="hr" my={6} borderColor={useColorModeValue('gray.400', 'gray.600')} />

      {/* Links de navegación */}
      <Flex flexDir={{ base: "column", md: "row" }} gap={4} >
        <Box gap={6} color={textColor} fontWeight={600} p={8} fontSize="lg">
          <Text><Link href="/products" _hover={{ color: hoverColor }}>Productos</Link></Text>
          <Text><Link href="/about" _hover={{ color: hoverColor }}>Sobre nosotros</Link></Text>
          <Text><Link href="#" _hover={{ color: hoverColor }}>Instagram</Link></Text>
          <Text><Link href="#" _hover={{ color: hoverColor }}>TikTok</Link></Text>
        </Box>
        <Box gap={6} color={textColor} fontWeight={600} p={8} fontSize="lg">
          <Text><Link href="/contact" _hover={{ color: hoverColor }}>Contacto</Link></Text>
          <Text><Link href="/faqs" _hover={{ color: hoverColor }}>FAQs</Link></Text>
          <Text _hover={{ color: hoverColor }}> <Link href="/terms" _hover={{ color: hoverColor }}>Términos y Condiciones</Link> </Text>
          <Text _hover={{ color: hoverColor }}><Link href="/privacy" _hover={{ color: hoverColor }}>Política de Privacidad</Link> </Text>
        </Box>
      </Flex>

      {/* Información adicional */}
      <Flex
        flexDir={{ base: "column", md: "row" }}
        justifyContent="space-between"
        alignItems="center"
        color={textColor}
        px={8}
      >
        <Text fontSize="lg">
          Busy es un estilo de vida para quienes ocupan su tiempo en lo que realmente importa.
        </Text>
        <HStack gap={6} mt={{ base: 8, md: 0 }}>
          <Link href="#" _hover={{ color: hoverColor }}>
            <Icon
              _hover={{ transform: "scale(1.1)" }}
              transition="all 0.5s ease"
              size={"lg"}
            >
              <FaTiktok />
            </Icon>
          </Link>
          <Link href="#" _hover={{ color: hoverColor }}>
            <Icon
              _hover={{ transform: "scale(1.1)" }}
              transition="all 0.5s ease"
              size={"lg"}
            >
              <FaInstagram />
            </Icon>
          </Link>
          <Image src={Visa} alt="Visa" width={45} height={45} />
          <Image src={Mastercard} alt="Mastercard" width={45} height={45} />
          <Image src={MercadoPago} alt="MercadoPago" width={45} height={45} />

        </HStack>
      </Flex>

      <Text mt={6} fontSize="md" textAlign="center" color={textColor}>
        &copy; 2024 Busy. Todos los derechos reservados.
      </Text>
    </Flex>
  );
}
