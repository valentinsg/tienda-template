'use client';
import { Flex, Heading, Input, Text, Box, Icon, Link } from '@chakra-ui/react';
import { FaInstagram, FaTiktok } from 'react-icons/fa';
import Image from 'next/image';
import { useColorMode, useColorModeValue } from './ui/color-mode';
import { Button } from "./ui/button"
import BusyDarkMode from '../../../public/busy-logo-dark-mode.png';
import BusyLightMode from '../../../public/busy-logo-light-mode.png';

export default function Footer() {
  const { colorMode } = useColorMode();
  const bgColor = useColorModeValue("#D0D0D0", 'gray.800');
  const textColor = useColorModeValue("gray.800", "#F0F0F0")
  const hoverColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Flex bg={bgColor} flexDir={"column"} w="100%" p={6} shadow="md">
      <Flex flexDir={"row"} justifyContent={"space-between"} p={6} alignItems={"center"}>
        <Flex flexDir={"column"} w={"45%"} gap={8} >
          <Heading fontSize={"2.5vw"} lineHeight={1.1} color={textColor}>
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

        <Box >
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
      <Flex flexDir={"column"} gap={2} color={textColor} fontWeight={600} p={6}>
        <Text><Link href="#" className={`hover:text-${hoverColor}`}>Productos</Link></Text>
        <Text><Link href="#" className={`hover:text-${hoverColor}`}>Sobre nosotros</Link></Text>
        <Text><Link href="#" className={`hover:text-${hoverColor}`}>Contacto</Link></Text>
      </Flex>
      <Flex justifyContent={"space-between"} color={textColor} p={6} alignItems={"center"}>
        <Flex gap={8}>
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
        <Flex>
          <Text fontSize={"xl"} textAlign={"center"} color={textColor}>&copy; 2024 Busy. Todos los derechos reservados.</Text>

        </Flex>
      </Flex>
    </Flex >
  );
}