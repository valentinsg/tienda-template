import React from 'react';
import { Box, Flex } from '@chakra-ui/react';

const BackgroundPattern = () => {
  return (
    <Box  top={0} left={0} right={0} bottom={0} zIndex={1}>
      {/* Gradiente sutil */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient="linear(to-br, gray.50, gray.100)"
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
          left="-5%"
          width="300px"
          height="300px"
          borderRadius="full"
          border="60px solid"
          borderColor="gray.700"

        />
        <Box
          position="absolute"
          bottom="-15%"
          right="-10%"
          width="400px"
          height="400px"
          borderRadius="full"
          border="60px solid"
          borderColor="gray.700"
        />
        
        {/* Líneas diagonales sutiles */}
        <Box
          position="absolute"
          top="25%"
          left="25%"
          width="2.5px"
          height="80%"
          transform="rotate(45deg)"
          bg="gray.100"
        />
        <Box
          position="absolute"
          top="20%"
          right="25%"
          width="2.5px"
          height="80%"
          transform="rotate(-45deg)"
          bg="gray.100"
        />
      </Flex>
    </Box>
  );
};

export default BackgroundPattern;