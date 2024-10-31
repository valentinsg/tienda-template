'use client';
import { useRouter } from 'next/navigation';
import ProductList from './components/ProductList';
import { Product } from '../types/Product';
import { products } from './data/products';

export default function HomePage() {
  const router = useRouter();

  const handleSelectProduct = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

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
        <ProductList products={products} onSelectProduct={handleSelectProduct} />
      </section>

      {/* Listado completo de productos */}
      <ProductList products={products} onSelectProduct={handleSelectProduct} />
    </div>
  );
}
