import React, { useState } from 'react';
import { Flex, HStack, Input, Text, VStack } from '@chakra-ui/react';
import { Checkbox } from './ui/checkbox';
import {
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogCloseTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { useColorModeValue } from './ui/color-mode';
import { FiMail } from 'react-icons/fi';

const RequestSizeDialog = () => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [acceptPromotions, setAcceptPromotions] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedSize || !email) {
      alert("Por favor selecciona un talle y escribe tu email.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/requestSize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, size: selectedSize, acceptPromotions }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Solicitud enviada correctamente. Te avisaremos cuando esté disponible.");
        setIsOpen(false);
      } else {
        alert(data.error || "Error al enviar la solicitud.");
      }
    } catch (error) {
      alert("Error al enviar la solicitud.");
    } finally {
      setIsLoading(false);
    }
  };

  const mutedTextColor = useColorModeValue('gray.800', 'white');

  return (
    <DialogRoot open={isOpen} onOpenChange={details => setIsOpen(details.open)}>
      <DialogTrigger asChild>
        <HStack color={mutedTextColor} textDecoration={"underline"} cursor="pointer" mx={"auto"} ml={"0"}>
          <FiMail />
          <Text>Solicitar talle si está agotado</Text>
        </HStack>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <Flex justify="space-between" align="center" pb={4}>
            <DialogTitle>
              <Text fontSize="xl" fontWeight="bold">
                Avísame cuando esté mi talle
              </Text>
            </DialogTitle>
            <DialogCloseTrigger asChild>
              <Button variant="ghost" size="sm">Cerrar</Button>
            </DialogCloseTrigger>
          </Flex>
        </DialogHeader>

        <DialogBody>
          <VStack align="start" gap={4}>
            <Text>
              El talle que querés no está disponible en este momento. Seleccioná el que necesitás,
              dejá tu email y te avisamos en cuanto vuelva a entrar. ¡No te la vayas a perder!
            </Text>

            <HStack gap={2}>
              {["XS", "S", "M", "L", "XL", "2XL"].map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "solid" : "outline"}
                  colorScheme="blue"
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </Button>
              ))}
            </HStack>

            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Text fontSize="sm" color={mutedTextColor}>
              No te enviaremos publicidad ni nuestras fabulosas promociones por esto...
            </Text>
            <Checkbox
              checked={acceptPromotions}
              onChange={(e) => setAcceptPromotions((e.target as HTMLInputElement).checked)}
              >
              A menos que quieras ;)
            </Checkbox>

            <Button colorScheme="blue" onClick={handleSubmit} size="lg" loading={isLoading}>
              Avisame
            </Button>
          </VStack>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default RequestSizeDialog;