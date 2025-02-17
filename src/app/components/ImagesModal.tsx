'use client';
import { ProductImage } from '@/types/ProductImage';
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogActionTrigger,
} from '../components/ui/dialog';
import { Box, Image, VStack, Button } from '@chakra-ui/react';
import { FiX } from 'react-icons/fi';
import { useColorModeValue } from '../components/ui/color-mode';

interface ImageModalProps {
  images: ProductImage[];
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export const ImageModal = ({ images, isOpen, onClose, onOpen }: ImageModalProps) => {
  const textColor = useColorModeValue('gray.800', 'white');
  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <DialogRoot open={isOpen} onOpenChange={(details) => {
      if (!details.open) {
        onClose();
      }
    }}>
      <DialogContent
        style={{
          backgroundColor: bgColor,
          borderRadius: '1rem',
          padding: '0.5rem',
          maxWidth: '35vw',
          maxHeight: '80vh',
          overflow: 'hidden',
        }}
      >
        <DialogHeader>
          <DialogTitle fontSize="xl" color={textColor} fontWeight="bold">
            Todas las imágenes
          </DialogTitle>
          <DialogActionTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <FiX />
            </Button>
          </DialogActionTrigger>
        </DialogHeader>
        <DialogBody>
          <VStack gap={4}>
            {images.map((img, idx) => (
              <Box key={idx} w="100%" h="auto">
                <Image src={img.image_url} alt={`Product image ${idx + 1}`} objectFit="contain" />
              </Box>
            ))}
          </VStack>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};