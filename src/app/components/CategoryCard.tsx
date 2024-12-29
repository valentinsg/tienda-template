import React, { useState } from 'react';
import { Box, Button, Text } from '@chakra-ui/react';
import { useColorMode } from './ui/color-mode';
import FrontRemerasBlack from "../../../public/portada-remeras-black.png";
import FrontHoodieBlack from "../../../public/portada-hoodies-black.png";
import FrontHoodieLight from "../../../public/portada-hoodies-light.png";
import FrontRemerasLight from "../../../public/portada-remeras-light.png";

useColorMode
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
      bgSize="cover"
      bgImage={colorMode === 'dark' ? `url(${lightImage})` : `url(${darkImage})`}
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
      {/* Overlay on hover */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="blackAlpha.600"
        opacity={isHovered ? 1 : 0}
        transition="opacity 0.3s ease-in-out"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        padding="6"
      >
        <Text
          fontSize="6xl"
          color="white"
          textAlign="center"
          fontFamily={"Archivo Black"}
          letterSpacing={"tighter"}
          transform={isHovered ? 'translateY(0)' : 'translateY(-20px)'}
          opacity={isHovered ? 1 : 0}
          transition="all 0.3s ease-in-out"
          lineHeight={1}
        >
          {title}
        </Text>
        
        <Button
          size="lg"
          letterSpacing={"tighter"}
          fontWeight={"600"}
          width="80%"
          bg={colorMode === 'dark' ? '#d0d0d0' : 'gray.700'}
          color={colorMode === 'dark' ? 'black' : 'white'}
          transform={isHovered ? 'translateY(0)' : 'translateY(20px)'}
          opacity={isHovered ? 1 : 0}
          transition="all 0.3s ease-in-out"
          _hover={{
            transform: 'scale(1.03)'
          }}
          p={6}
          mt={10}
        >
          Comprar ahora
        </Button>
      </Box>
    </Box>
  );
};

// Example usage:
export default function CategoryGrid() {
  const handleCategoryClick = (category: string) => {
    // Add your navigation logic here
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