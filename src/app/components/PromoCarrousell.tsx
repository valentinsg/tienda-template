'use client';

import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useColorModeValue } from './ui/color-mode';

export interface PromoCarouselProps {
  text1: string;
  text2: string;
}

const PromoCarousel: React.FC<PromoCarouselProps> = ({ text1, text2 }) => {
  const bgColor = useColorModeValue('black', 'blackAlpha.800');
  const textColor = useColorModeValue('white', 'white');

  return (
    <Box
      top="0"
      w="100%"
      bg={bgColor}
      color={textColor}
      zIndex="1000"
      overflow="hidden"
      transition="opacity 0.3s ease"
      display="flex"
      justifyContent="center"
      alignItems="center"
      p={1}
    >
      <Box
        display="flex"
        whiteSpace="nowrap"
        animation="marquee 25s linear infinite"
        fontFamily={"Archivo Black"}
      >
        <Text mx={20}>{text1}</Text>
        <Text mx={20}>{text2}</Text>
      </Box>

      {/* CSS for animation */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </Box>
  );
};

export default PromoCarousel;
