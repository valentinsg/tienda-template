'use client'
import { useRouter } from 'next/navigation';
import { Product } from '../../types/Product';
import ProductList from './ProductList';

export default function ProductPage() {
  const router = useRouter();

  const handleSelectProduct = (product: Product) => {
    router.push(`/product/${product.id}`);
};

  return (
    <div>
      {/* Lista de productos */}
      <ProductList onSelectProduct={handleSelectProduct} />
    </div>
  );
}