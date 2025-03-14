'use client';
import React, { useState, useEffect } from 'react';
import { Box, Flex, IconButton, Image, Text } from '@chakra-ui/react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Chicos1 from '../../../public/chicos 1.webp';
import Chicos2 from '../../../public/chicos 2.webp';
import { useColorMode, useColorModeValue } from './ui/color-mode';
import BackgroundPattern from './BackgroundPattern';

const Carrousell = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { colorMode } = useColorMode();

  const slides = [
    {
      id: 1,
      image: Chicos1.src,
      alt: 'Slide 1',
      objectFit: "contain",
      objectPosition: "center"
    },
    {
      id: 2,
      image: Chicos2.src,
      alt: 'Slide 2',
      objectFit: "contain",
      objectPosition: "center"
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const bgColor = useColorModeValue('#D0D0D0', "gray.900");

  return (
    <Box position="relative" width="100%" height={{ base: "auto", md: "85vh" }} bg={bgColor}>
      <BackgroundPattern />
      <Flex
        position="relative"
        direction="column"
        height="100%"
        justify="center"
        align="center"
        px={4}
      >
        {/* Texto sobre el carrusel */}
        <Text
          position="absolute"
          bottom={{ base: 10, md: 20 }}
          width={{ base: "90%", md: "25%" }}
          fontSize={{ base: "lg", md: "3xl" }}
          fontWeight="bold"
          textAlign="center"
          color={colorMode === 'light' ? 'gray.700' : 'gray.100'}
          textShadow={colorMode === 'light' ? '0 0 10px rgba(0, 0, 0, 0.3)' : '0 0 10px rgba(255, 255, 255, 0.3)'}
          fontFamily={"heading"}
          lineHeight="1.2"
          zIndex={3}
        >
        </Text>

        <Box
          position="relative"
          width="100%"
          maxW="1500px"
          height={{ base: "auto", md: "85vh" }}
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
                objectFit={slide.objectFit}
                objectPosition={slide.objectPosition}
                pt={{ base: 8, md: 12 }}
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
            left={{ base: 2, md: 4 }}
            onClick={prevSlide}
            zIndex={2}
            colorScheme={colorMode === 'light' ? 'blackAlpha' : 'whiteAlpha'}
            size={{ base: "sm", md: "lg" }}
          >
            <FaArrowLeft />
          </IconButton>

          {/* Botón para el siguiente slide */}
          <IconButton
            aria-label="Next slide"
            position="absolute"
            top="50%"
            transform="translateY(-50%)"
            variant={"outline"}
            right={{ base: 2, md: 4 }}
            onClick={nextSlide}
            zIndex={2}
            colorScheme={colorMode === 'light' ? 'blackAlpha' : 'whiteAlpha'}
            size={{ base: "sm", md: "lg" }}
          >
            <FaArrowRight />
          </IconButton>
        </Box>

        <Flex position={"absolute"} bottom={0} zIndex={990} width="100%" justify="center">
          {slides.map((_, index) => (
            <Box
              key={index}
              width={4}
              height={4}
              borderRadius="full"
              bg={index === currentSlide ? "black" : "whiteAlpha.800"}
              margin={2}
              cursor="pointer"
              onClick={() => setCurrentSlide(index)}
              transition="common 0.3s ease"
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
  );
};

export default Carrousell;
