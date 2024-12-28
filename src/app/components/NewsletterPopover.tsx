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
  Image, 
  Input, 
  Text, 
  Grid, 
  GridItem, 
  Box,
  VStack
} from "@chakra-ui/react";
import { toast } from "react-toastify";
import { useColorModeValue } from "./ui/color-mode";

export default function NewsletterDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');

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
  return (
    <DialogRoot open={isOpen} onOpenChange={details => setIsOpen(details.open)}>
      <DialogContent 
        style={{
          background: bgColor,
          border: `1px solid ${borderColor}`,
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
          maxWidth: '600px',
          margin: 'auto',
        }}
      >
        <Grid templateColumns="1fr 1.2fr" gap={8}>
          <GridItem>
            <Box 
              borderRadius="lg" 
              overflow="hidden"
              height="100%"
              position="relative"
            >
            </Box>
          </GridItem>

          <GridItem>
            <VStack gap={6} align="stretch">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  ¡Obtené un 10% de descuento!
                </DialogTitle>
              </DialogHeader>

              <DialogBody>
                <form onSubmit={handleSubmit}>
                  <VStack gap={4}>
                    <Text fontSize="md">
                      Suscribite a nuestra newsletter y recibí un cupón de descuento para tu primera compra.
                    </Text>
                    
                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tucorreo@email.com"
                        size="lg"
                        type="email"
                        required
                      />

                    <Button
                      colorScheme="blue"
                      width="full"
                      size="lg"
                      type="submit"
                    >
                      Obtener descuento
                    </Button>

                    <DialogActionTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="lg"
                        width="full"
                        onClick={() => setIsOpen(false)}
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
