'use client';
import React, { useState, useEffect } from 'react';
import { Box, Flex, IconButton, Image } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import Chicos1 from '../../../public/chicos 1.jpg';
import Chicos2 from '../../../public/chicos 2.png';
import "../styles/backgroundPattern.css";
import { useColorMode } from './ui/color-mode';
import BackgroundPattern from './BackgroundPattern';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { colorMode } = useColorMode(); // Para manejar modo oscuro/claro

  const slides = [
    {
      id: 1,
      image: Chicos1.src,
      alt: 'Slide 1'
    },
    {
      id: 2,
      image: Chicos2.src,
      alt: 'Slide 2'
    },
    {
      id: 3,
      image: '/slide3.png',
      alt: 'Slide 3'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const bgColor = colorMode === 'light' ? 'gray.50' : 'gray.900'; // Fondo dinámico

  return (
    <Box position="relative" width="100%" minHeight="100vh" bg={bgColor}>
      <BackgroundPattern />
      <Box position="relative" zIndex={1}>
        <Flex
          position="relative"
          direction="column"
          height="100vh"
          justify="center"
          align="center"
          px={4}
        >
          <Box
            position="relative"
            width="100%"
            maxW="1500px"
            height={{ base: "auto", md: "95vh" }}
            mx="auto"
          >
            {slides.map((slide, index) => (
              <Box
                key={slide.id}
                position={index === currentSlide ? "relative" : "absolute"}
                top={0}
                left={0}
                width="100%"
                height="100%"
                opacity={index === currentSlide ? 1 : 0}
                visibility={index === currentSlide ? "visible" : "hidden"}
                transition="opacity 0.5s ease-in-out"
              >
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  width="100%"
                  height="100%"
                  objectFit="contain"
                  objectPosition="center"
                />
              </Box>
            ))}

            {/* Botón para el slide anterior */}
            <IconButton
              aria-label="Previous slide"
              position="absolute"
              top="50%"
              transform="translateY(-50%)"
              variant={"outline"}
              left={4}
              onClick={prevSlide}
              zIndex={2}
              colorScheme={colorMode === 'light' ? 'blackAlpha' : 'whiteAlpha'}
            >
              <ChevronLeftIcon />
            </IconButton>

            {/* Botón para el siguiente slide */}
            <IconButton
              aria-label="Next slide"
              position="absolute"
              top="50%"
              transform="translateY(-50%)"
              variant={"outline"}
              right={4}
              onClick={nextSlide}
              zIndex={2}
              colorScheme={colorMode === 'light' ? 'blackAlpha' : 'whiteAlpha'}
            >
              <ChevronRightIcon />
            </IconButton>
          </Box>
          <Flex justify="center" mt={4} zIndex={2}>
            {slides.map((_, index) => (
              <Box
                key={index}
                width={3}
                height={3}
                borderRadius="full"
                bg={index === currentSlide ? "black" : "blackAlpha.300"}
                margin={1}
                cursor="pointer"
                onClick={() => setCurrentSlide(index)}
                transition="background-color 0.3s"
                _hover={{
                  bg:
                    index === currentSlide
                      ? "black"
                      : colorMode === 'light'
                      ? "blackAlpha.400"
                      : "whiteAlpha.400"
                }}
              />
            ))}
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default Home;
