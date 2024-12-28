'use client';
import { Flex, Heading, Input, Text, Box, Icon, Link, HStack, VStack } from '@chakra-ui/react';
import { FaInstagram, FaTiktok } from 'react-icons/fa';
import Image from 'next/image';
import { useColorMode, useColorModeValue } from '../components/ui/color-mode';
import { Button } from "../components/ui/button"
import BusyDarkMode from '../../../public/busy-logo-dark-mode.png';
import BusyLightMode from '../../../public/busy-logo-light-mode.png';
import Visa from '../../../public/visa.png';
import Mastercard from '../../../public/mastercard.png';
import MercadoPago from '../../../public/mercadopagop.png';

export default function Footer() {
  const { colorMode } = useColorMode();
  const bgColor = useColorModeValue("#D0D0D0", 'gray.800');
  const textColor = useColorModeValue("gray.800", "#F0F0F0")
  const hoverColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Flex bg={bgColor} flexDir={"column"} w="100%" p={8} shadow="md">
      {/* Sección de suscripción */}
      <Flex flexDir={"row"} justifyContent={"space-between"} p={6} alignItems={"center"}>
        <Flex flexDir={"column"} w={"45%"} gap={12}>
          <Heading fontSize={"1.8vw"} lineHeight={1.1} color={textColor}>
            Sé el primero en enterarte de todas nuestras novedades
          </Heading>

          <Flex w={"90%"} alignItems="center">
            <Input
              placeholder="me@example.com"
              borderRadius={"full"}
              variant="subtle"
              _hover={{ borderColor: hoverColor }}
              borderColor={useColorModeValue('gray.600', 'none')}
            />
            <Button
              bg={useColorModeValue('gray.600', 'gray.400')}
              color="white"
              borderRadius={"lg"}
              ml={-6}
              _hover={{ bg: hoverColor }}
              loadingText="Saving..."
            >
              Suscríbete
            </Button>
          </Flex>
        </Flex>

        <Box>
          <Link href="/">
            <Image
              src={colorMode === 'dark' ? BusyDarkMode : BusyLightMode}
              alt="Busy logo"
              width={455}
            />
          </Link>
        </Box>
      </Flex>

      <Box as="hr" my={4} borderColor={useColorModeValue('gray.400', 'gray.600')} />

      {/* Links de navegación */}
      <Flex flexDir={"column"} gap={2} color={textColor} fontWeight={600} p={6}>
        <Text><Link href="#" className={`hover:text-${hoverColor}`}>Productos</Link></Text>
        <Text><Link href="#" className={`hover:text-${hoverColor}`}>Sobre nosotros</Link></Text>
        <Text><Link href="#" className={`hover:text-${hoverColor}`}>Contacto</Link></Text>
        <Text><Link href="#" className={`hover:text-${hoverColor}`}>FAQs</Link></Text>
        <Box>
          <Text fontSize={"md"} color={textColor}>Envíos a toda Argentina</Text>
        </Box>
      </Flex>

      {/* Redes sociales y derechos reservados */}
      <Flex justifyContent={"space-between"} color={textColor} p={6}>

        <HStack gap={6} mt={"auto"}>
          {/* Visa */}
          <Image
            src={Visa} // Asegúrate de que la imagen esté en tu carpeta pública.
            alt="Visa"
            width={45}
            height={45}
          />

          {/* Mastercard */}
          <Image
            src={Mastercard} // Asegúrate de que la imagen esté en tu carpeta pública.
            alt="Mastercard"
            width={45}
            height={45}
          />

          {/* MercadoPago */}
          <Image
            src={MercadoPago} // Asegúrate de que la imagen esté en tu carpeta pública.
            alt="MercadoPago"
            width={45}
            height={45}
          />
          {/* Información adicional */}
        </HStack>

        <VStack gap={4}>

          <Flex gap={10} ml={"auto"}>
            <Link href="#" className={`hover:text-${hoverColor}`}>
              <Icon
                _hover={{ transform: "scale(1.1)" }}
                transition="all 0.5s ease"
                size={"xl"}
              >
                <FaTiktok />
              </Icon>
            </Link>
            <Link href="#" className={`hover:text-${hoverColor}`}>
              <Icon
                _hover={{ transform: "scale(1.1)" }}
                transition="all 0.5s ease"
                size={"xl"}
              >
                <FaInstagram />
              </Icon>
            </Link>
          </Flex>

          <Text fontSize={"xl"} textAlign={"center"} color={textColor}>&copy; 2024 Busy. Todos los derechos reservados.</Text>
        </VStack>
      </Flex>
    </Flex>
  );
}
