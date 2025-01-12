'use client';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useProducts } from '@/app/context/ProductContext';
import ProductList from '@/app/components/ProductList';
import { Product } from '@/types/Product';
import { useColorModeValue,  useColorMode } from '@/app/components/ui/color-mode';
import { Heading, Box } from '@chakra-ui/react';

const Loading = () => <div>Loading...</div>;
const ErrorComponent = ({ message }: { message: string }) => <div>Error: {message}</div>;

const CategoryPage = () => {
  // Hook para obtener datos del contexto de productos y categorías
  const { products, categories, isLoading, error } = useProducts();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug; // Slug actual desde la URL
  const { colorMode } = useColorMode();
  const textColor = useColorModeValue('#555454', '#D0D0D0');

  // Estado para almacenar los productos filtrados por categoría
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Efecto para filtrar productos según la categoría actual
  useEffect(() => {
    if (slug && categories.length > 0 && products.length > 0) {
      const currentCategory = categories.find(category => category.slug === slug);

      if (currentCategory) {
        // Filtrar productos que pertenezcan a la categoría actual
        const categoryProducts = products.filter(
          product => Number(product.category) === currentCategory.id
        );
        setFilteredProducts(categoryProducts);
      }
    }
  }, [slug, categories, products]);

  // Maneja la selección de un producto y redirige a su página
  const handleSelectProduct = (product: Product) => {
    router.push(`/products/${product.id}`);
  };

  // Renderizado condicional para estados de carga y error
  if (isLoading) return <Loading />;
  if (error) return <ErrorComponent message={error} />;

  // Buscar la categoría actual basada en el slug
  const currentCategory = categories.find(category => category.slug === slug);

  // Si no se encuentra la categoría, mostrar mensaje de error
  if (!currentCategory) return <div>Category not found</div>;


  return (
    <Box bg={colorMode === 'dark' ? 'gray.800' : 'bg.muted'} py={12}  color={textColor}>
      {/* Nombre de la categoría */}
      <Heading mb={10} textAlign="center" fontFamily={"Archivo Black"} as="h1" fontSize={{ base: "4xl", md: "4vw" }} letterSpacing={"tighter"} lineHeight={{ base: 1.2, md: "11vh" }} color={textColor}>
        {currentCategory.name}
      </Heading>

      {/* Lista de productos o mensaje si no hay productos */}
      {filteredProducts.length > 0 ? (
        <ProductList products={filteredProducts} onSelectProduct={handleSelectProduct} />
      ) : (
        <p>No hay productos disponibles en esta categoría.</p>
      )}
    </Box>
  );
};

export default CategoryPage;
