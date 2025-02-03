'use client';

import React from 'react';
import Link from 'next/link';
import { useProducts } from '../context/ProductContext';
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Button,
} from '@chakra-ui/react';
import { MenuRoot, MenuContent, MenuTrigger, MenuItem } from '../components/ui/menu';
import {
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
  DrawerTrigger,
} from "../components/ui/drawer";
import { Sun, Moon, Menu as MenuIcon, ChevronDown } from 'lucide-react';
import { useColorMode, useColorModeValue } from '../components/ui/color-mode';
import BusyDarkMode from '../../../public/busy-logo-dark-mode.png';
import BusyLightMode from '../../../public/busy-logo-light-mode.png';
import Image from 'next/image';
import CartDialog from '../components/CartDialog';
import { usePathname } from 'next/navigation';

const Header = () => {
  const { categories } = useProducts();
  const { colorMode, toggleColorMode } = useColorMode();
  const pathname = usePathname();

  const activeColor = useColorModeValue('#000000', '#FFFFFF');
  const inactiveColor = useColorModeValue('#555454', "#D0D0D0");

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  const navigation = [
    { name: 'Casita', href: '/' },
    { name: 'Productos', href: '/products', hasDropdown: true },
    { name: 'Sobre nosotros', href: '/about' },
    { name: 'Contacto', href: '/contact' },
    { name: "FAQ's", href: '/faqs' },
    { name: 'Blog', href: '/blog' },
  ];

  const MobileNav = () => (
    <DrawerRoot>
      <DrawerTrigger asChild>
        <Button aria-label="Abrir menú de navegación" variant="ghost">
          <MenuIcon size={24} />
        </Button>
      </DrawerTrigger>
      <DrawerContent >
        <DrawerHeader>
          <Image
            src={colorMode === 'dark' ? BusyDarkMode : BusyLightMode}
            alt="Busy - Ropa urbana y streetwear en Mar del Plata"
            width={150}
            height={150}
          />
        </DrawerHeader>
        <VStack align="stretch" gap={4} mt={6}>
          <nav>
            <ul>
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link key={item.name} href={item.href} passHref>
                    <Text
                      title={`Ir a ${item.name}`}
                      px={4}
                      py={2}
                      fontSize="lg"
                      fontWeight={isActive(item.href) ? "bold" : "normal"}
                      color={isActive(item.href) ? activeColor : inactiveColor}
                      borderRadius="md"
                    >
                      {item.name}
                    </Text>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Box my={2} />

          <Text px={4} color={inactiveColor} fontWeight="medium" fontSize="sm">
            Categorías
          </Text>
          {
            categories.map((category) => (
              <Link
                key={category.slug}
                href={`/products/category/${category.slug}`}
                passHref
                data-category={category.slug}
                title={`Ver productos de la categoría ${category.name}`}
              >
                <Text
                  title={`Ir a ${category.name}`}
                  px={4}
                  py={2}
                  fontSize="md"
                  color={inactiveColor}
                  borderRadius="md"
                >
                  {category.name}
                </Text>
              </Link>
            ))
          }

          < Box my={2} />

          <HStack px={4} justify="space-between">
            <Button
              aria-label="Cambiar tema"
              onClick={toggleColorMode}
              variant="ghost"
              colorScheme="gray"
            >
              {colorMode === 'dark' ? <Sun /> : <Moon />}
            </Button>
            <CartDialog />
          </HStack>
        </VStack>
      </DrawerContent>
    </DrawerRoot >
  );

  return (
    <Box
      as="header"
      bg={colorMode === 'dark' ? 'gray.900' : '#D0D0D0'}
      shadow="md"
      w="100%"
      p={1}
      position="sticky"
      top="0"
      zIndex="1000"
      letterSpacing={"tighter"}
    >
      <Flex align="center" justify="space-between">
        {/* Mobile Menu */}
        <Box display={{ base: 'block', md: 'none' }}>
          <MobileNav />
        </Box>

        {/* Logo */}
        <Box ml={{ base: 0, md: "2vw" }}>
          <Link href="/" passHref>
            <Image
              src={colorMode === 'dark' ? BusyDarkMode : BusyLightMode}
              alt="Busy - Ropa urbana y streetwear en Mar del Plata"
              width={200}
              height={200}
            />
          </Link>
        </Box>

        {/* Desktop Menu */}
        <Flex display={{ base: 'none', md: 'flex' }} fontSize={"md"}>
          <Flex mr="5vw" alignItems="center">
            {navigation.map((item) => (
              <Box key={item.name} mx={4}>
                {item.hasDropdown ? (
                  <MenuRoot>
                    <MenuTrigger asChild>
                      <Flex
                        align="center"
                        cursor="pointer"
                        color={isActive(item.href) ? activeColor : inactiveColor}
                        fontWeight={isActive(item.href) ? "bold" : "normal"}
                        gap={2}
                      >
                        <Text>{item.name}</Text>
                        <ChevronDown size={16} />
                      </Flex>
                    </MenuTrigger>
                    <MenuContent>
                      <Link href="/products" passHref>
                        <MenuItem value="all-products" fontSize={"md"} >
                          Todos los productos
                        </MenuItem>
                      </Link>
                      {categories.map((category) => (
                        <Link
                          key={category.slug}
                          href={`/products/category/${category.slug}`}
                          passHref
                          data-category={category.slug}
                          title={`Ver productos de la categoría ${category.name}`}
                        >
                          <MenuItem
                            value={category.slug}
                            fontSize={"md"}
                            title={`Ir a ${category.name}`}
                          >
                            {category.name}
                          </MenuItem>
                        </Link>
                      ))}
                    </MenuContent>
                  </MenuRoot>
                ) : (
                  <Link href={item.href} passHref>
                    <Text
                      color={isActive(item.href) ? activeColor : inactiveColor}
                      cursor="pointer"
                      fontWeight={isActive(item.href) ? "bold" : "normal"}
                      title={`Ir a ${item.name}`}
                    >
                      {item.name}
                    </Text>
                  </Link>
                )}
              </Box>
            ))}
          </Flex>

          <HStack gap={4} mr="5vw">
            {pathname !== '/checkout' && <CartDialog />}
            <Button
              aria-label="Cambiar tema"
              onClick={toggleColorMode}
              variant="ghost"
              _hover={
                {
                  bg: colorMode === 'dark' ? 'gray.600' : 'gray.50',
                }
              }
            >
              {colorMode === 'dark' ? <Sun /> : <Moon />}
            </Button>
          </HStack>

          {/* Mobile Cart (when not in desktop view) */}
          <Box display={{ base: 'block', md: 'none' }}>
            {pathname !== '/checkout' && <CartDialog />}
          </Box>
        </Flex>

      </Flex>

    </Box>
  );
};

export default Header;