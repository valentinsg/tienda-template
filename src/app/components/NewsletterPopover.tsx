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
  Button,
  Input,
  Text,
  Box,
  VStack,
  Grid,
  GridItem,
  Image,
  useBreakpointValue,
} from "@chakra-ui/react";
import { toast } from "react-toastify";
import { useColorModeValue } from "../components/ui/color-mode";

export default function NewsletterDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasCheckedSubscription, setHasCheckedSubscription] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const borderColor = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("#555454", "#D0D0D0");
  const inputBg = useColorModeValue("white", "gray.800");

  const lucas =
    "https://tfufdiayyhcndcgncylf.supabase.co/storage/v1/object/sign/imagenes%20web/DSC06719(2).png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZW5lcyB3ZWIvRFNDMDY3MTkoMikucG5nIiwiaWF0IjoxNzM1OTU1MDY1LCJleHAiOjE3Njc0OTEwNjV9.PtjZT7MChCXucfFuPbubX8HtiP4IQxE-z_cyrY7E2OY&t=2025-01-04T01%3A44%3A25.739Z";

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      try {
        const response = await fetch("/api/newsletter/check-status", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.isSubscribed) {
          const timer = setTimeout(() => {
            setIsOpen(true);
          }, 20000);
          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error("Error checking subscription status:", error);
      } finally {
        setHasCheckedSubscription(true);
      }
    };

    checkSubscriptionStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Por favor ingresa tu email");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Por favor ingresa un email válido");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error === "exists") {
        toast.info("Este email ya está suscrito a nuestra newsletter");
        setIsOpen(false);
      } else if (data.message === "success") {
        setDiscountCode(data.discountCode);
        setShowSuccess(true);
        toast.success("¡Gracias por suscribirte!");
      } else {
        throw new Error(data.error || "Error desconocido");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        "Hubo un error al procesar tu solicitud. Por favor intenta nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isMobile = useBreakpointValue({ base: true, md: false });

  if (!hasCheckedSubscription) {
    return null;
  }

  return (
    <DialogRoot open={isOpen} onOpenChange={(details) => setIsOpen(details.open)}>
      <DialogContent
        style={{
          border: `1px solid ${borderColor}`,
          borderRadius: "1rem",
          padding: "2rem",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
          maxWidth: "700px",
          margin: "auto",
          backgroundColor: inputBg,
        }}
      >
        <Grid templateColumns={isMobile ? "1fr" : "1fr 1.2fr"} gap={8}>
          <GridItem>
            <Box borderRadius="lg" overflow="hidden" position="relative">
              <Image src={lucas} alt="Lucas" />
            </Box>
          </GridItem>

          <GridItem>
            <VStack gap={6} align="stretch">
              <DialogHeader>
                <DialogTitle
                  fontSize="2xl"
                  color={textColor}
                  fontFamily={"Archivo Black"}
                  letterSpacing={"tighter"}
                  fontWeight={500}
                >
                  ¡Obtené un 10% de descuento!
                </DialogTitle>
              </DialogHeader>

              <DialogBody>
                {showSuccess ? (
                  <Box
                    bg="green.100"
                    p={6}
                    rounded="md"
                    textAlign="center"
                    border="1px solid"
                    borderColor="green.300"
                  >
                    <Text fontSize="lg" fontWeight="bold" color="green.800">
                      ¡Suscripción exitosa!
                    </Text>
                    <Text mt={4}>
                      Tu código de descuento es:
                      <Box
                        fontSize="xl"
                        fontWeight="bold"
                        mt={2}
                        p={2}
                        bg="white"
                        border="1px solid"
                        borderColor="gray.300"
                        borderRadius="md"
                      >
                        {discountCode}
                      </Box>
                    </Text>
                    <Text mt={2} fontSize="sm" color="green.700">
                      Te hemos enviado un email con el código y más información.
                    </Text>
                  </Box>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <VStack gap={4} align="stretch">
                      <Text fontSize="md" color={textColor}>
                        Suscribite a nuestra newsletter y recibí un cupón de descuento para tu primera compra.
                      </Text>

                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tucorreo@email.com"
                        size="lg"
                        type="email"
                        required
                        bg={inputBg}
                        border="1px solid"
                        borderColor={borderColor}
                        _hover={{ borderColor: "blue.500" }}
                        _focus={{
                          borderColor: "blue.500",
                          boxShadow: "0 0 0 1px blue.500",
                        }}
                        disabled={isLoading}
                      />

                      <Button
                        colorScheme="blue"
                        width="full"
                        size="lg"
                        type="submit"
                      >
                        {isLoading ? "Enviando..." : "Obtener descuento"}
                      </Button>

                      <DialogActionTrigger asChild>
                        <Button
                          size="lg"
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
