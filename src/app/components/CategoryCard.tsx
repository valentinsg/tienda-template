import React, { useState } from 'react';
import { Box, Button, Text } from '@chakra-ui/react';
import { useColorMode } from './ui/color-mode';
import FrontRemerasBlack from "../../../public/portada-remeras-black.png";
import FrontHoodieBlack from "../../../public/portada-hoodies-black.png";
import FrontHoodieLight from "../../../public/portada-hoodies-light.png";
import FrontRemerasLight from "../../../public/portada-remeras-light.png";

interface CategoryCardProps {
  title: string;
  lightImage: string;
  darkImage: string;
  onClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  lightImage,
  darkImage,
  onClick
}) => {
  const { colorMode } = useColorMode();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      position="relative"
      borderRadius="lg"
      w="32%"
      h="75vh"
      shadow="lg"
      transition="all 0.3s ease-in-out"
      cursor="pointer"
      overflow="hidden"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      _hover={{
        transform: 'scale(1.02)',
        shadow: 'xl'
      }}
    >
      {/* Background layers */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg={colorMode === 'dark' ? 'gray.800' : 'gray.100'}
        bgGradient={
          colorMode === 'dark'
            ? 'linear(to-br, gray.800, purple.900)'
            : 'linear(to-br, gray.100, teal.50)'
        }
      />
      
      {/* Pattern overlay */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        opacity={0.1}
        backgroundImage={`data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E`}
      />

      {/* Main image */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bgSize="cover"
        bgRepeat="no-repeat"
        bgImage={colorMode === 'dark' ? `url(${lightImage})` : `url(${darkImage})`}
        opacity={0.9}
      />

      {/* Hover overlay */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="blackAlpha.700"
        opacity={isHovered ? 1 : 0}
        transition="opacity 0.3s ease-in-out"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Text
          fontSize="7xl"
          color="white"
          textAlign="center"
          fontFamily="Archivo Black"
          letterSpacing="tighter"
          transform={isHovered ? 'translateY(0)' : 'translateY(-20px)'}
          opacity={isHovered ? 1 : 0}
          transition="all 0.3s ease-in-out"
          lineHeight={1}
        >
          {title}
        </Text>
       
        <Button
          size="lg"
          letterSpacing="tighter"
          fontWeight="600"
          width="70%"
          bg={colorMode === 'dark' ? '#d0d0d0' : 'gray.700'}
          color={colorMode === 'dark' ? 'black' : 'white'}
          transform={isHovered ? 'translateY(0)' : 'translateY(20px)'}
          opacity={isHovered ? 1 : 0}
          transition="all 0.3s ease-in-out"
          _hover={{
            transform: 'scale(1.03)',
            bg: colorMode === 'dark' ? 'white' : 'black'
          }}
          p={6}
          mt={6}
        >
          Comprar ahora
        </Button>
      </Box>
    </Box>
  );
};

export default function CategoryGrid() {
  const handleCategoryClick = (category: string) => {
    console.log(`Navigating to ${category}`);
  };

  return (
    <Box display="flex" gap="6" justifyContent="center" p="6">
      <CategoryCard
        title="Remeras"
        lightImage={FrontRemerasLight.src}
        darkImage={FrontRemerasBlack.src}
        onClick={() => handleCategoryClick('remeras')}
      />
      <CategoryCard
        title="Hoodies"
        lightImage={FrontHoodieLight.src}
        darkImage={FrontHoodieBlack.src}
        onClick={() => handleCategoryClick('hoodies')}
      />
      <CategoryCard
        title="Todos los productos"
        lightImage="gray.100"
        darkImage="gray.700"
        onClick={() => handleCategoryClick('all')}
      />
    </Box>
  );
}