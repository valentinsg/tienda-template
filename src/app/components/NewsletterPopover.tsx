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
import { useColorModeValue } from "./ui/color-mode";

export default function NewsletterDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('#555454', '#D0D0D0');
  const lucas = "https://tfufdiayyhcndcgncylf.supabase.co/storage/v1/object/sign/imagenes%20web/DSC06719(2).png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZW5lcyB3ZWIvRFNDMDY3MTkoMikucG5nIiwiaWF0IjoxNzM1OTU1MDY1LCJleHAiOjE3Njc0OTEwNjV9.PtjZT7MChCXucfFuPbubX8HtiP4IQxE-z_cyrY7E2OY&t=2025-01-04T01%3A44%3A25.739Z";
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 20000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Por favor ingresa tu email");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Por favor ingresa un email válido");
      return;
    }

    // Aquí irría la lógica para guardar el email
    toast.success("¡Gracias por suscribirte! Revisa tu email");
    setIsOpen(false);
    setEmail("");
  };

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <DialogRoot open={isOpen} onOpenChange={details => setIsOpen(details.open)}>
      <DialogContent
        style={{
          border: `1px solid ${borderColor}`,
          borderRadius: 'full',
          padding: '2rem',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
          maxWidth: '700px',
          margin: 'auto',
        }}
      >
        <Grid templateColumns={isMobile ? "1fr" : "1fr 1.2fr"} gap={8}>
          <GridItem>
            <Box
              borderRadius="lg"
              overflow="hidden"
              position="relative"
            >
              <Image src={lucas} alt="Lucas" />
            </Box>
          </GridItem>

          <GridItem>
            <VStack gap={6} align="stretch">
              <DialogHeader>
                <DialogTitle fontSize="2xl" color={textColor} fontFamily={"Archivo Black"} letterSpacing={"tighter"} fontWeight={500}>
                  ¡Obtené un 10% de descuento!
                </DialogTitle>
              </DialogHeader>

              <DialogBody>
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
                      colorPalette={"blue"}
                    />

                    <Button
                      colorPalette={"blue"}
                      width="full"
                      size="lg"
                      type="submit"
                    >
                      Obtener descuento
                    </Button>

                    <DialogActionTrigger asChild>
                      <Button
                        size="lg"
                        variant={"outline"}
                        width="full"
                        onClick={() => setIsOpen(false)}
                        color={textColor}
                      >
                        No, gracias
                      </Button>
                    </DialogActionTrigger>
                  </VStack>
                </form>
              </DialogBody>
            </VStack>
          </GridItem>
        </Grid>
      </DialogContent>
    </DialogRoot>
  );
}
