import React, { useState } from 'react';
import { Flex, HStack, Input, Text, VStack} from '@chakra-ui/react';
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
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    if (!selectedSize || !email) {
      alert("Por favor selecciona un talle y escribe tu email.");
      return;
    }
    alert(`Talle: ${selectedSize}, Email: ${email}`);
    setIsOpen(false);
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

            <Button colorScheme="blue" onClick={handleSubmit} size="lg">
              Avisame
            </Button>
          </VStack>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default RequestSizeDialog;