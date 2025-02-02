import React, { useState } from 'react';
import { Flex, HStack, Input, Text, VStack, Box, Link } from '@chakra-ui/react';
import { Tooltip } from './ui/tooltip';
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
import { FiMail, FiSquare, FiCheck } from 'react-icons/fi';
import { toaster } from './ui/toaster';

const RequestSizeDialog = () => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [acceptPromotions, setAcceptPromotions] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const mutedTextColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const checkboxBg = useColorModeValue('blue.500', 'blue.200');
  const checkboxIconColor = useColorModeValue('white', 'gray.800');

  const CustomCheckboxIcon = () => (
    acceptPromotions ? (
      <FiCheck size={16} color={checkboxIconColor} />
    ) : (
      <FiSquare size={16} color={mutedTextColor} />
    )
  );


  const validateForm = () => {
    if (!selectedSize) {
      toaster.create({
        title: "Selecciona un talle",
        description: "Por favor selecciona el talle que necesitás",
        duration: 3000,
      });
      return false;
    }

    if (!email) {
      toaster.create({
        title: "Falta el email",
        description: "Por favor ingresa tu dirección de email",
        duration: 3000,
      });
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toaster.create({
        title: "Email inválido",
        description: "Por favor ingresa un email válido",
        duration: 3000,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
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
        toaster.create({
          title: "¡Solicitud enviada!",
          description: "Te avisaremos cuando el talle esté disponible",
          duration: 3000,
        });
        setTimeout(() => setIsOpen(false), 1500);
      } else {
        toaster.create({
          title: "Error",
          description: data.error || "Hubo un problema al enviar la solicitud",
          duration: 4000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogRoot open={isOpen} onOpenChange={details => setIsOpen(details.open)} size={'lg'}>
      <Tooltip
        aria-label="Tu solicitud nos ayuda a planificar mejor nuestros próximos drops"
        content={"Tu solicitud nos ayuda a planificar mejor nuestros próximos drops"}
      >
        <DialogTrigger asChild>
          <HStack
            color={mutedTextColor}
            textDecoration={"underline"}
            cursor="pointer"
            mx={"auto"}
            ml={"0"}
            _hover={{ color: 'blue.500' }}
            gap={2}
          >
            <FiMail />
            <Text>Solicitar talle si está agotado</Text>
          </HStack>
        </DialogTrigger>
      </Tooltip>

      <DialogContent borderColor={borderColor} bg={useColorModeValue('white', 'gray.800')} p={3}>
        <DialogHeader>
          <Flex justify="space-between" align="center">
            <DialogTitle>
              <Text fontSize="2xl" letterSpacing={"tighter"} color={useColorModeValue('#555454', '#D0D0D0')} fontFamily={"Archivo Black"}>
                AVISEN CUANDO ESTÉ MI TALLE
              </Text>
            </DialogTitle>
            <DialogCloseTrigger asChild>
              <Button variant="ghost">
                Cerrar
              </Button>
            </DialogCloseTrigger>
          </Flex>
        </DialogHeader>

        <DialogBody>
          <VStack align="start" gap={8}>
            <Text color={mutedTextColor} fontSize="md">
              El talle que querés no está disponible en este momento. Seleccioná el que necesitás,
              dejá tu email y te avisamos en cuanto vuelva a entrar. ¡No te la vayas a perder!
            </Text>

            <HStack gap={4} wrap="wrap">
              {["XS", "S", "M", "L", "XL", "2XL"].map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "solid" : "outline"}
                  border={selectedSize === size ? "1px" : "1px solid"}
                  size="lg"
                  onClick={() => setSelectedSize(size)}
                  _hover={{ bg: selectedSize === size ? "gray.300" : "black", color: selectedSize === size ? "gray.600" : "gray.100" }}
                  aria-selected={selectedSize === size}
                >
                  {size}
                </Button>
              ))}
            </HStack>

            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="lg"
              borderColor={borderColor}
              color={mutedTextColor}
              _focus={{ borderColor: 'blue.500', boxShadow: 'none' }}
              type="email"
              autoComplete="email"
            />

            <Checkbox
              checked={acceptPromotions}
              onChange={(e) => setAcceptPromotions((e.target as HTMLInputElement).checked)}
              icon={<CustomCheckboxIcon />}
              style={{
                '--checkbox-bg': acceptPromotions ? checkboxBg : 'transparent',
                '--checkbox-border-color': acceptPromotions ? 'transparent' : borderColor,
              } as React.CSSProperties}
            >
              <Text fontSize="sm" color={mutedTextColor}>
                No te vamos a enviar, ni publicidad, ni contenido de valor, ni nuestras promociones de otro planeta por esto...
                <br />
                <Box as="span" fontWeight="bold" fontSize={"lg"}>
                  A menos que quieras ;)
                </Box>
              </Text>
            </Checkbox>

            <Text fontSize="sm" color={mutedTextColor}>
              Al registrarte, aceptas los{' '}
              <Link href="/terms" color="blue.500" textDecoration="underline">
                Términos y Condiciones
              </Link>{' '}
              y la{' '}
              <Link href="/privacy" color="blue.500" textDecoration="underline">
                Política de Privacidad y Cookies
              </Link>{' '}
              de Busy.
            </Text>

            <Button
              colorPalette="blue"
              onClick={handleSubmit}
              size="lg"
              width="100%"
              loading={isLoading}
              loadingText="Enviando..."
            >
              Avisame
            </Button>
          </VStack>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default RequestSizeDialog;