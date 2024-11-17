'use client'
import { Box, Button, Input, VStack, Textarea, Heading, Fieldset } from '@chakra-ui/react';
import { Field } from "../components/ui/field"

const Checkout = () => {
  return (
    <Box maxW="lg" mx="auto" mt={8} p={4}>
      <Heading as="h1" mb={4}>Checkout</Heading>
      <VStack gap={4} align="stretch">
        <Fieldset.Root size="lg" maxW="md">
          <Field>Full Name
            <Input type="text" placeholder="John Doe" />
          </Field>
          <Field>Email Address
            <Input type="email" placeholder="johndoe@example.com" />
          </Field>
          <Field>Shipping Address
            <Textarea placeholder="1234 Main Street, Apartment 101" />
          </Field>
          <Field>Payment Method</Field>
          <Input type="text" placeholder="Credit Card / Debit Card / PayPal" />

          <Button colorScheme="blue" size="lg" w="100%">
            Proceed to Payment
          </Button>
        </Fieldset.Root>

      </VStack>
    </Box>
  );
};

export default Checkout;
