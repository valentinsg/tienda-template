'use client';
import { useRouter } from 'next/navigation';
import ProductList from './components/ProductList';
import { useProducts } from './context/ProductContext';
import { Product } from '../types/Product';


export default function HomePage() {
  const router = useRouter();
  const { products, featuredProducts, isLoading, error } = useProducts();
  
  const handleSelectProduct = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Welcome to Our E-Commerce Store!</h1>

      {/* Sección de Productos en Tendencia */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Trending products</h2>
        <div className="text-right mt-4">
          <a href="/collection" className="text-blue-600 hover:underline">
            Shop the collection →
          </a>
        </div>
        <ProductList products={featuredProducts} onSelectProduct={handleSelectProduct} />
      </section>

      {/* Listado completo de productos */}
      <ProductList products={products} onSelectProduct={handleSelectProduct} />
    </div>
  );
}
