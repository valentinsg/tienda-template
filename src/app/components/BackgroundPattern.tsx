import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { useColorMode } from './ui/color-mode';

const BackgroundPattern = () => {
  const { colorMode } = useColorMode();
  const bgGradient = colorMode === 'light' ? 'linear(to-br, gray.50, gray.100)' : 'linear(to-br, gray.800, gray.900)';
  const borderColor = colorMode === 'light' ? '#555454' : 'gray.100';
  const lineColor = colorMode === 'light' ? 'gray.900' : 'gray.100';
  return (
    <Box  top={0} left={0} right={0} bottom={0} zIndex={1} shadow={"md"}>
      {/* Gradiente sutil */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient={bgGradient}
      />
      
      {/* Patrón de formas geométricas */}
      <Flex
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        opacity={0.065}
        overflow="hidden"
      >
        {/* Círculos decorativos */}
        <Box
          position="absolute"
          top="-10%"
          left="-8%"
          width="300px"
          height="300px"
          borderRadius="full"
          border="60px solid"
          borderColor={borderColor}

        />
        <Box
          position="absolute"
          bottom="-15%"
          right="-10%"
          width="400px"
          height="400px"
          borderRadius="full"
          border="60px solid"
          borderColor={borderColor}
        />
        
        {/* Líneas diagonales sutiles */}
        <Box
          position="absolute"
          top="25%"
          left="25%"
          width="3px"
          height="90%"
          transform="rotate(45deg)"
          bg={lineColor}
        />
        <Box
          position="absolute"
          top="25%"
          right="25%"
          width="3px"
          height="85%"
          transform="rotate(-45deg)"
          bg={lineColor}
        />
      </Flex>
    </Box>
  );
};

export default BackgroundPattern;