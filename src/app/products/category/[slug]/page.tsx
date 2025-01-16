'use client';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useProducts } from '@/app/context/ProductContext';
import { ProductList } from '@/app/components/ProductList';
import { Product } from '@/types/Product';
import { useColorModeValue, useColorMode } from '@/app/components/ui/color-mode';
import { Heading, Box, Spinner } from '@chakra-ui/react';

const ErrorComponent = ({ message }: { message: string }) => <div>Error: {message}</div>;

const CategoryPage = () => {
  const { products, categories, isLoading, error } = useProducts();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug;
  const { colorMode } = useColorMode();
  const textColor = useColorModeValue('#555454', '#D0D0D0');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (slug && categories.length > 0 && products.length > 0) {
      const currentCategory = categories.find(category => category.slug === slug);
      if (currentCategory) {
        // Filter products based on category name instead of ID
        const categoryProducts = products.filter(
          product => product.category?.toLowerCase() === currentCategory.name.toLowerCase()
        );
        console.log('Current category:', currentCategory.name);
        console.log('Filtered products:', categoryProducts);
        setFilteredProducts(categoryProducts);
      }
    }
  }, [slug, categories, products]);

  const handleSelectProduct = (product: Product) => {
    router.push(`/products/${product.id}`);
  };

  if (isLoading) return (
      <Box bg={colorMode === 'dark' ? 'gray.800' : 'bg.muted'} w={"100%"} h={"1000px"} display={"flex"} justifyContent={"center"} alignItems={"center"} >
        <Spinner size="xl" color={colorMode === 'dark' ? 'gray.300' : 'bg.800'} />
      </Box>
    );
    
  if (error) return <ErrorComponent message={error} />;

  const currentCategory = categories.find(category => category.slug === slug);
  if (!currentCategory) return <div>Category not found</div>;

  return (
    <Box bg={colorMode === 'dark' ? 'gray.800' : 'bg.muted'} py={12} color={textColor}>
      <Heading 
        mb={10} 
        textAlign="center" 
        fontFamily={"Archivo Black"} 
        as="h1" 
        fontSize={{ base: "4xl", md: "4vw" }} 
        letterSpacing={"tighter"} 
        lineHeight={{ base: 1.2, md: "11vh" }} 
        color={textColor}
      >
        {currentCategory.name}
      </Heading>
      
      {filteredProducts.length > 0 ? (
        <ProductList products={filteredProducts} onSelectProduct={handleSelectProduct} />
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          No hay productos disponibles en esta categoría.
        </div>
      )}
    </Box>
  );
};

export default CategoryPage;