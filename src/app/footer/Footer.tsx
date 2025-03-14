'use client';
import { useState } from 'react';
import { Flex, Input, Text, Box, Link, HStack, useBreakpointValue, Icon } from '@chakra-ui/react';
import Image from 'next/image';
import { useColorMode, useColorModeValue } from '../components/ui/color-mode';
import { Button } from "../components/ui/button";
import BusyDarkMode from '../../../public/busy-logo-dark-mode.png';
import BusyLightMode from '../../../public/busy-logo-light-mode.png';
import Visa from '../../../public/visa.png';
import Mastercard from '../../../public/mastercard.png';
import MercadoPago from '../../../public/mercadopagop.png';
import { FaInstagram, FaTiktok } from 'react-icons/fa';
import { useNewsletter } from '../hooks/useNewsletter';

export default function Footer() {
  const { colorMode } = useColorMode();
  const { email, setEmail, handleSubscribe } = useNewsletter();
  const [isLoading,] = useState(false);
  const textColor = useColorModeValue('gray.700', '#D0D0D0');
  const hoverColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Flex
      as="footer"
      bg={colorMode === 'dark' ? 'gray.900' : '#D0D0D0'}
      flexDir="column"
      w="100%"
      p={{base: 4, md:8}}
      shadow="md"
      zIndex="1000"
    >
      {/* Sección de suscripción */}
      <Flex
        flexDir={{ base: "column", md: "row" }}
        justifyContent="space-between"
        p={{base: 4, md:6}}
        alignItems="center"
        gap={8}
      >
        <Flex flexDir="column" w={{ base: "100%", md: "50%" }} gap={{base: 0, md:8}}>
          <Text
            fontSize={useBreakpointValue({ base: "xl", md: "2.35vw" })}
            lineHeight={1.2}
            fontFamily="Archivo Black"
            fontWeight={500}
            letterSpacing="tighter"
            textAlign={{ base: "center", md: "left" }}
            color={textColor}
          >
            Sé el primero en enterarte de todas nuestras novedades
          </Text>
          <form onSubmit={handleSubscribe}>
            <Flex w={{ base: "100%", md: "95%" }} alignItems="center" mt={10}>
              <Input
                placeholder="me@example.com"
                borderColor={useColorModeValue('gray.400', 'gray.600')}
                colorPalette="blue"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                color={textColor}
                disabled={isLoading}
                fontSize="md"
                letterSpacing="tighter"
                borderRadius="0"
              />
              <Button
                type="submit"
                colorPalette="blue"
                fontWeight={600}
                disabled={isLoading}
                letterSpacing="tighter"
                borderRadius="0"
              >
                {isLoading ? "Enviando..." : "Suscríbete"}
              </Button>
            </Flex>
          </form>
        </Flex>

        <Box display={{ base: "none", md: "block" }} userSelect={"none"}>
          <Image
            src={colorMode === 'dark' ? BusyDarkMode : BusyLightMode}
            alt="Busy logo"
            width={550}
          />
        </Box>
      </Flex>

      {/* Rest of the footer remains the same */}
      <Box as="hr" my={10} borderColor={useColorModeValue('gray.400', 'gray.600')} />

      <Flex flexDir={{ base: "row", md: "row" }} gap={10} fontSize={{base: "md", md:"lg"}} letterSpacing={"tighter"}>
        <Box gap={{base: 4, md:8}} p={{base: 4, md:8}} >
          <Text color={textColor}><Link href="/products" _hover={{ color: hoverColor }}>Todos los productos</Link></Text>
          <Text color={textColor}><Link href="/products/hoodies" _hover={{ color: hoverColor }}>Buzos</Link></Text>
          <Text color={textColor}><Link href="/products/remeras" _hover={{ color: hoverColor }}>Remeras</Link></Text>
          <Text color={textColor}><Link href="/about" _hover={{ color: hoverColor }}>Sobre nosotros</Link></Text>
        </Box>
        <Box gap={{base: 4, md:8}} p={{base: 4, md:8}}>
          <Text color={textColor}><Link href="/contact" _hover={{ color: hoverColor }}>Contacto</Link></Text>
          <Text color={textColor}><Link href="/faqs" _hover={{ color: hoverColor }}>FAQs</Link></Text>
          <Text color={textColor}><Link href="https://www.instagram.com/busy.streetwear/" target="_blank" rel="noopener noreferrer" _hover={{ color: hoverColor }}>Instagram</Link></Text>
          <Text color={textColor}><Link href="https://www.tiktok.com/@busy.streetwear" target="_blank" rel="noopener noreferrer" _hover={{ color: hoverColor }}>TikTok</Link></Text>
        </Box>
      </Flex>

      <Text
        px={8}
        mt={4}
        color={textColor}
        display={{ base: "none", md: "block" }} fontSize="lg" fontWeight={600} textAlign={{ base: "center", md: "left" }} letterSpacing={"tighter"}>
        Mejor ocuparse que preocuparse.
      </Text>

      <HStack justifyContent={"space-between"} mt={8} gap={2} px={8} fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')} alignItems="center">
        <Box display={{ base: "none", md: "flex" }} gap={4}>
          <Link href="/terms" _hover={{ color: hoverColor }}>Términos</Link>
          <Text>•</Text>
          <Link href="/privacy" _hover={{ color: hoverColor }}>Privacidad</Link>
        </Box>

        <Text fontSize={{base: "sm", md:"lg" }} textAlign="center" color={textColor} letterSpacing={"tighter"} ml={{ base: "auto", md: 20 }} mr={{ base: "auto", md: 0 }}>
          &copy; 2024 Busy. Todos los derechos reservados.
        </Text>

        <Flex display={{ base: "none", md: "flex" }} gap={4}>
          <HStack gap={4}>
            <Link href="https://www.tiktok.com/@busy.streetwear" _hover={{ color: hoverColor }} target="_blank" rel="noopener noreferrer">
              <Icon _hover={{ transform: "scale(1.1)" }} transition="all 0.5s ease" size={"xl"}><FaTiktok /></Icon>
            </Link>
            <Link href="https://www.instagram.com/busy.streetwear/" _hover={{ color: hoverColor }} target="_blank" rel="noopener noreferrer">
              <Icon _hover={{ transform: "scale(1.1)" }} transition="all 0.5s ease" size={"xl"}><FaInstagram /></Icon>
            </Link>
            <Image src={Visa} alt="Visa" width={50} height={50} />
            <Image src={Mastercard} alt="Mastercard" width={50} height={50} />
            <Image src={MercadoPago} alt="MercadoPago" width={45} height={45} />
          </HStack>
        </Flex>
      </HStack>
    </Flex>
  );
}