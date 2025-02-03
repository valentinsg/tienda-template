'use client';
import { Box, Container, Heading, Text, VStack, Input } from '@chakra-ui/react';
import { useColorMode, useColorModeValue } from '../components/ui/color-mode';
import { Button } from "../components/ui/button";
import { useNewsletter } from '../hooks/useNewsletter';
import React from 'react';

const BlogPage = () => {
  const { colorMode } = useColorMode();
  const textColor = useColorModeValue('#555454', '#D0D0D0');
  const { email, setEmail, isLoading, handleSubscribe } = useNewsletter();

  return (
    <main>
      <Box bg={colorMode === 'dark' ? 'gray.800' : 'bg.muted'} py={12} color={textColor} as="section" h={"90vh"} >
        <Container >
          <VStack gap={4}>
            <Heading 
              as="h1" 
              textAlign="center" 
              fontFamily="Archivo Black" 
              fontSize={{ base: "4xl", md: "4vw" }} 
              letterSpacing="tighter" 
              lineHeight={{ base: 1.2, md: "11vh" }} 
              color={textColor}
            >
              Blog
            </Heading>
            
            <Text fontSize="xl" textAlign="center" letterSpacing="tighter" mt={4} fontWeight={600}>Ocupados construyendo...</Text>
            
            <VStack w="100%" maxW="xl">
              <Text fontSize="xl" textAlign="center" letterSpacing="tighter">
                Suscríbete a nuestro newsletter para obtener más novedades
              </Text>
              
              <form onSubmit={handleSubscribe} style={{ width: '100%' }}>
                <VStack gap={4} w="100%" mt={4}>
                  <Input
                    placeholder="me@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    disabled={isLoading}
                    color={textColor}
                    border={colorMode === 'dark' ? '1px solid #555454' : '1px solid #D0D0D0'}
                    fontSize="md"
                    letterSpacing="tighter"
                    borderRadius="0"
                  />
                  <Button
                    type="submit"
                    colorPalette="blue"
                    w="100%"
                    fontWeight={600}
                    disabled={isLoading}
                    letterSpacing="tighter"
                    borderRadius="0"
                  >
                    {isLoading ? "Enviando..." : "Suscríbete"}
                  </Button>
                </VStack>
              </form>
            </VStack>
          </VStack>
        </Container>
      </Box>
    </main>
  );
};

export default BlogPage;