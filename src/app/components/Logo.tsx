'use client';
import React from 'react';
import { Box, Image } from '@chakra-ui/react';
import {useColorMode} from './ui/color-mode';
import BusyDarkMode from '../../../public/busy-logo-dark-mode.png';
import BusyLightMode from '../../../public/busy-logo-light-mode.png';

const Logo = () => {
  const { colorMode } = useColorMode();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height={{base: "85vh", md:"100vh"}}
      bg={colorMode === 'dark' ? 'gray.800' : 'bg.muted'}
      transition="background-color 0.2s"
    >
      <Box
        width={{ base: "80%", md: "60%", lg: "50%" }}
        maxW="800px"
        transition="transform 0.3s ease"
        _hover={{ transform: 'scale(1.05)' }}
      >
        <Image
          src={colorMode === 'dark' ? BusyDarkMode.src : BusyLightMode.src}
          alt="Busy Logo"
          width="100%"
          height="auto"
          objectFit="contain"
        />
      </Box>
    </Box>
  );
};

export default Logo;