import { useRouter } from 'next/navigation';
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
  letter: string;
  
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  lightImage,
  darkImage,
  onClick,
  letter
}) => {
  const { colorMode } = useColorMode();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      position="relative"
      borderRadius="lg"
      w={{base: "100%", md:"32%"}}
      h={{base: "60vh", md:"80vh"}}
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
      mb={20}
    >
      {/* Pattern overlay */}
      <Text
        position="absolute"
        fontSize="35vw"
        color={colorMode === 'dark' ? 'gray.50' : 'gray.700'}
        opacity={0.1}
        top="50%"
        left="50%"
        fontFamily={'Archivo Black'}
        transform="translate(-50%, -50%)"
      >
        {letter}
      </Text>

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
        opacity={{base: 1, md: isHovered ? 1 : 0}}
        transition="opacity 0.3s ease-in-out"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Text
          fontSize={{ base: "4xl", md: "7xl" }}
          color="white"
          textAlign="center"
          fontFamily="Archivo Black"
          letterSpacing="tighter"
          transform={{ base: 'translateY(0)', md: isHovered ? 'translateY(0)' : 'translateY(-20px)' }}
          opacity={{ base: 1, md: isHovered ? 1 : 0 }}
          transition="all 0.3s ease-in-out"
          lineHeight={1}
        >
          {title}
        </Text>
       
        <Button
          size={{ base: "md", md: "lg" }}
          letterSpacing="tighter"
          fontWeight="600"
          width={{ base: "80%", md: "70%" }}
          bg={colorMode === 'dark' ? '#d0d0d0' : 'gray.700'}
          color={colorMode === 'dark' ? 'black' : 'white'}
          transform={{ base: 'translateY(0)', md: isHovered ? 'translateY(0)' : 'translateY(20px)' }}
          opacity={{ base: 1, md: isHovered ? 1 : 0 }}
          transition="all 0.3s ease-in-out"
          _hover={{
            transform: 'scale(1.03)',
            bg: colorMode === 'dark' ? 'white' : 'black'
          }}
          p={{ base: 4, md: 6 }}
          mt={6}
        >
          Comprar ahora
        </Button>
      </Box>
    </Box>
  );
};

export default function CategoryGrid() {
  const router = useRouter();
  const handleCategoryClick = (category: string) => {
    if (category === '') {
      router.push('/products');
    } else {
      router.push(`/products/category/${category}`);
    }
  };

  return (
    <Box display="flex" flexDir={{base: "column", md:"row"}} gap={{base: 6, md:12}} justifyContent="center" p={{base: 8, md:12}}>
      <CategoryCard
        title="Remeras"
        lightImage={FrontRemerasLight.src}
        darkImage={FrontRemerasBlack.src}
        onClick={() => handleCategoryClick('remeras')}
        letter='M'
      />
      <CategoryCard
        title="Hoodies"
        lightImage={FrontHoodieLight.src}
        darkImage={FrontHoodieBlack.src}
        onClick={() => handleCategoryClick('hoodies')}
        letter='D'
      />
      <CategoryCard
        title="Todos los productos"
        lightImage={""}
        darkImage={""}
        onClick={() => handleCategoryClick('')}
        letter='P'
      />
    </Box>
  );
}