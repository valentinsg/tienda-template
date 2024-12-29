'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useProducts } from '../context/ProductContext';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
} from '@chakra-ui/react';
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "../components/ui/menu"
import { Sun, Moon, ChevronDown } from 'lucide-react';
import { useColorMode, useColorModeValue } from '../components/ui/color-mode';
import BusyDarkMode from '../../../public/busy-logo-dark-mode.png';
import BusyLightMode from '../../../public/busy-logo-light-mode.png';
import Image from 'next/image';
import CartDialog from '../components/CartDialog';
import { usePathname } from 'next/navigation';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { categories } = useProducts();
  const { colorMode, toggleColorMode } = useColorMode();
  const pathname = usePathname();
  const activeColor = useColorModeValue('#000000', '#FFFFFF');
  const inactiveColor = useColorModeValue('#555454', "#D0D0D0");
  const textColor = useColorModeValue('#555454', "#D0D0D0");

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  const navigation = [
    { name: 'Casita', href: '/' },
    {
      name: 'Productos',
      href: '/products',
      hasDropdown: true,
      dropdownContent: (
        <Box
          position="absolute"
          top="100%"
          bg={colorMode === 'dark' ? 'gray.700' : 'white'}
          borderRadius="md"
          boxShadow="lg"
          minW="200px"
          zIndex={1000}
        >
          {categories.map((category, index) => (
            <Link
              key={index}
              href={`/products/${category.name.toLowerCase()}`}
              passHref
            >
              <Text
              p={3}
              color={textColor}
              _hover={{
                bg: colorMode === 'dark' ? 'gray.600' : 'gray.100'
              }}
              cursor="pointer"
              >
              {category.name}
              </Text>
            </Link>
          ))}
        </Box>
      )
    },
    { name: 'Sobre nosotros', href: '/about' },
    { name: 'Contacto', href: '/contact' },
    { name: "FAQ's", href: '/faqs' },
  ];

  return (
    <Box as="nav" bg={colorMode === 'dark' ? 'gray.800' : '#D0D0D0'} shadow="md" w="100%" p={2} position="sticky" top="0" zIndex="1000">
      <Flex align="center" justify="space-between">
        {/* Logo */}
        <Box ml={"2vw"}>
          <Link href="/" passHref>
            <Image
              src={colorMode === 'dark' ? BusyDarkMode : BusyLightMode}
              alt="Busy logo"
              width={175}
              height={175}
            />
          </Link>
        </Box>

        {/* Desktop Menu */}
        <Flex display={{ base: 'none', md: 'flex' }} align="center">
          <Flex mr={"5vw"} alignItems={"center"}>
            {navigation.map((item) => (
              <Box
                key={item.name}
                position="relative"
                onMouseEnter={() => item.hasDropdown && setIsDropdownOpen(true)}
                onMouseLeave={() => item.hasDropdown && setIsDropdownOpen(false)}
              >
                <Link href={item.href} passHref>
                  <Flex
                    align="center"
                    color={isActive(item.href) ? activeColor : inactiveColor}
                    cursor="pointer"
                    mx={4}
                    fontWeight={isActive(item.href) ? "bold" : "normal"}
                  >
                    {item.name}
                    {item.hasDropdown && <ChevronDown />}
                  </Flex>
                </Link>
                {item.hasDropdown && isDropdownOpen && item.dropdownContent}
              </Box>
            ))}
          </Flex>
          <CartDialog />

          <Box mr={"5vw"} display={"flex"} flexDir={"row"}>
            {/* Right Side Icons */}
            <IconButton
              aria-label="Toggle theme"
              onClick={toggleColorMode}
              variant="ghost"
              mx={2}
              colorScheme="gray"
            >
              {colorMode === 'dark' ? <Sun /> : <Moon />}
            </IconButton>
          </Box>
        </Flex>

        {/* Mobile Menu Button */}
        <Box display={{ base: 'flex', md: 'none' }} alignSelf="center">
          <IconButton
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Open Menu"
            variant="ghost"
            colorScheme="gray"
          >
            {isOpen ? <Sun /> : <Moon />}
          </IconButton>
        </Box>
      </Flex>

      {/* Mobile Menu */}
      {isOpen && (
        <Stack display={{ md: 'none' }} gap={4} mt={4}>
          <MenuRoot>
            <MenuTrigger as={Button} >
              Productos
              <ChevronDown />
            </MenuTrigger>
            <MenuContent>
              {categories.map((category, index) => (
                <MenuItem key={index} value={category.name}>
                  <Link href={`/products/${category.name}`} passHref>
                    <Text>{category.name}</Text>
                  </Link>
                </MenuItem>
              ))}
            </MenuContent>
          </MenuRoot>
          {navigation.map((item) => (
            <Link key={item.name} href={item.href} passHref>
              <Button variant="ghost" colorScheme="gray">
                {item.name}
              </Button>
            </Link>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default Header;
