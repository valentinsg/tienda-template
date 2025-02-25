'use client';
import { ProductImage } from '@/types/ProductImage';
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogActionTrigger,
} from '../components/ui/dialog';
import { Box, Image, VStack, Button, HStack, IconButton } from '@chakra-ui/react';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useColorModeValue } from '../components/ui/color-mode';
import { useState } from 'react';

interface ImageModalProps {
  images: ProductImage[];
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export const ImageModal = ({ images, isOpen, onClose }: ImageModalProps) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevious = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

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
          overflow: 'hidden',
        }}
        maxHeight={{base: '100%', md:'90vh'}}
        maxWidth={{base: '100%', md:'40vw'}}
        overflowY={'auto'}
      >
        <DialogHeader >
          <DialogActionTrigger asChild>
            <Button variant="ghost" size="md" onClick={onClose}>
              <FiX />
            </Button>
          </DialogActionTrigger>
        </DialogHeader>
        <DialogBody>
          <VStack gap={{base: 0, md:4}}>
            {/* Main Image with Navigation Arrows */}
            <Box position="relative" w="100%" >
              <IconButton
                aria-label="Previous image"
                onClick={handlePrevious}
                position="absolute"
                left="0"
                top="50%"
                zIndex={1}
              >
                <FiChevronLeft />
              </IconButton>

              <Image
                src={images[currentImageIndex].image_url}
                alt={`Product image ${currentImageIndex + 1}`}
                objectFit="contain"
                w="100%"
                h={{base: "50vh", md:"70vh"}}
                />
              <IconButton
                aria-label="Next image"
                onClick={handleNext}
                position="absolute"
                right="0"
                top="50%"
                transform="translateY(-50%)"
                zIndex={1}
              >
                <FiChevronRight />
              </IconButton>
            </Box>

            {/* Thumbnails */}
            <HStack h={"auto"}  w="100%" gap={2} py={4} justifyContent={"center"} overflowX={"auto"}>
              {images.map((img, idx) => (
                <Box
                  key={idx}
                  borderRadius="md"
                  overflow="hidden"
                  borderWidth="2px"
                  borderColor={currentImageIndex === idx ? 'blue.500' : 'transparent'}
                  cursor="pointer"
                  onClick={() => handleThumbnailClick(idx)}
                  as="button"
                  flexShrink={0}
                  w="60px"
                  h="60px"
                  bg={bgColor}
                >
                  <Image
                    w="100%"
                    h="100%"
                    src={img.image_url}
                    alt={`Product image ${idx + 1}`}
                    objectFit="cover"
                  />
                </Box>
              ))}
            </HStack>
          </VStack>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};