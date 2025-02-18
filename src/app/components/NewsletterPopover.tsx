'use client';
import { useEffect, useState } from "react";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogActionTrigger,
} from "../components/ui/dialog";
import {
  Input,
  Text,
  Box,
  VStack,
  Grid,
  GridItem,
  Image,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Button } from "../components/ui/button";
import { useColorModeValue } from "../components/ui/color-mode";
import { useNewsletter } from '../hooks/useNewsletter';

export default function NewsletterDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { email, setEmail, isLoading, isSubscribed, hasCheckedSubscription, handleSubscribe } = useNewsletter();

  // Responsive values
  const gridTemplateColumns = useBreakpointValue({
    base: "1fr",
    sm: "1fr",
    md: "1fr 1.2fr"
  });
  const padding = useBreakpointValue({ base: "0rem", md: "2rem" });
  const dialogMaxWidth = useBreakpointValue({ base: "85vw", sm: "600px", md: "800px" });

  // Theme values
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("#555454", "#D0D0D0");
  const inputBg = useColorModeValue("white", "gray.800");
  const successBg = useColorModeValue("green.50", "green.900");
  const successBorder = useColorModeValue("green.200", "green.700");
  const successText = useColorModeValue("green.800", "green.100");

  const lucas = "https://tfufdiayyhcndcgncylf.supabase.co/storage/v1/object/sign/imagenes%20web/DSC06719(2).png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZW5lcyB3ZWIvRFNDMDY3MTkoMikucG5nIiwiaWF0IjoxNzM1OTU1MDY1LCJleHAiOjE3Njc0OTEwNjV9.PtjZT7MChCXucfFuPbubX8HtiP4IQxE-z_cyrY7E2OY&t=2025-01-04T01%3A44%3A25.739Z";

  useEffect(() => {
    if (!isSubscribed && hasCheckedSubscription) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 20000);
      return () => clearTimeout(timer);
    }
  }, [isSubscribed, hasCheckedSubscription]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await handleSubscribe(e);
    if (result === undefined) {
      setShowSuccess(true);
    }
  };

  if (!hasCheckedSubscription) {
    return null;
  }

  return (
    <DialogRoot open={isOpen} onOpenChange={(details) => setIsOpen(details.open)}>
      <DialogContent
        style={{
          border: `1px solid ${borderColor}`,
          padding,
          alignItems: "center",
          borderRadius: "1rem",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          maxWidth: dialogMaxWidth,
          width: "100%",
          backgroundColor: inputBg,
          overflow: "hidden",
        }}
      >
        <Grid templateColumns={gridTemplateColumns} gap={{base: 0, md:6}}>
          <GridItem >
            <Box 
              borderRadius="lg" 
              overflow="hidden" 
              height={{ base: "350px", md: "auto" }}
            >
              <Image 
                src={lucas} 
                alt="Lucas" 
                style={{ objectFit: "contain", width: "100%", height: "100%" }}
              />
            </Box>
          </GridItem>

          <GridItem>
            <VStack  align="stretch">
              <DialogHeader>
                <DialogTitle
                  fontSize={{ base: "xl", md: "2xl" }}
                  color={textColor}
                  fontFamily="Archivo Black"
                  letterSpacing="tighter"
                  fontWeight={500}
                >
                  ¡Obtené un 10% de descuento!
                </DialogTitle>
              </DialogHeader>

              <DialogBody>
                {showSuccess ? (
                  <Box
                    bg={successBg}
                    p={{ base: 4, md: 6 }}
                    rounded="md"
                    textAlign="center"
                    border="1px solid"
                    borderColor={successBorder}
                  >
                    <Text fontSize="lg" fontWeight="bold" color={successText}>
                      ¡Suscripción exitosa!
                    </Text>
                    <Text mt={4} color={successText}>
                      Tu código de descuento es:
                      <Box
                        fontSize="xl"
                        fontWeight="bold"
                        mt={2}
                        p={2}
                        bg={inputBg}
                        border="1px solid"
                        borderColor={borderColor}
                        borderRadius="md"
                      >
                        {email} {/* Replace with actual discount code from API response */}
                      </Box>
                    </Text>
                    <Text mt={2} fontSize="sm" color={successText}>
                      Te hemos enviado un email con el código y más información.
                    </Text>
                    <Button
                      mt={4}
                      colorScheme="green"
                      onClick={() => setIsOpen(false)}
                      width={{ base: "full", md: "auto" }}
                    >
                      Cerrar
                    </Button>
                  </Box>
                ) : (
                  <form onSubmit={onSubmit}>
                    <VStack gap={4} align="stretch">
                      <Text 
                        fontSize={{ base: "sm", md: "md" }} 
                        color={textColor}
                        lineHeight="tall"
                      >
                        Suscribite a nuestra newsletter y recibí un cupón de descuento 
                        para tu primera compra.
                      </Text>

                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tucorreo@email.com"
                        size={{ base: "md", md: "lg" }}
                        type="email"
                        required
                        color={textColor}
                        bg={inputBg}
                        border="1px solid"
                        borderColor={borderColor}
                        _hover={{ borderColor: "blue.500" }}
                        _focus={{
                          borderColor: "blue.500",
                          boxShadow: "0 0 0 1px blue.500",
                        }}
                        disabled={isLoading}
                        mt={1}
                      />

                      <Button
                        colorScheme="blue"
                        width="full"
                        size={{ base: "md", md: "lg" }}
                        type="submit"
                        loading={isLoading}
                        mt={4}
                      >
                        Obtener descuento
                      </Button>

                      <DialogActionTrigger asChild>
                        <Button
                          size={{ base: "md", md: "lg" }}
                          variant="outline"
                          width="full"
                          onClick={() => setIsOpen(false)}
                          color={textColor}
                          disabled={isLoading}
                        >
                          No, gracias
                        </Button>
                      </DialogActionTrigger>
                    </VStack>
                  </form>
                )}
              </DialogBody>
            </VStack>
          </GridItem>
        </Grid>
      </DialogContent>
    </DialogRoot>
  );
}