'use client';

// External imports
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// Internal imports
import { useProducts } from '@/app/context/ProductContext';
import ProductList from '@/app/components/ProductList';
import { Product } from '@/types/Product';

// Reusable Loading Component
const Loading = () => <div>Loading...</div>;

// Reusable Error Component
const ErrorComponent = ({ message }: { message: string }) => <div>Error: {message}</div>;

const CategoryPage = () => {
  // Hook para obtener datos del contexto de productos y categorías
  const { products, categories, isLoading, error } = useProducts();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug; // Slug actual desde la URL

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
    <div>
      {/* Nombre de la categoría */}
      <h1>{currentCategory.name}</h1>

      {/* Lista de productos o mensaje si no hay productos */}
      {filteredProducts.length > 0 ? (
        <ProductList products={filteredProducts} onSelectProduct={handleSelectProduct} />
      ) : (
        <p>No hay productos disponibles en esta categoría.</p>
      )}
    </div>
  );
};

export default CategoryPage;
