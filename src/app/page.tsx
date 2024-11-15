'use client';
import { useRouter } from 'next/navigation';
import ProductList from './components/ProductList';
import { useProducts } from './context/ProductContext';
import { Product } from '../types/Product';
import { Box } from '@chakra-ui/react';


export default function HomePage() {
  const router = useRouter();
  const { products, isLoading, error } = useProducts();
  
  const handleSelectProduct = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;
  
  return (
    <Box>
      {/* Listado completo de productos */}
      <ProductList products={products} onSelectProduct={handleSelectProduct} />
    </Box>
  );
}
