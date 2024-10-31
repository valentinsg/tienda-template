'use client';
import { useParams } from 'next/navigation';
import ProductOverview from '../../components/ProductOverview';
import { products } from '../../data/products';

export default function ProductPage() {
  const params = useParams();

  if (!params) {
    return <div>Invalid product ID</div>;
  }
  
  const product = products.find(p => p.id === Number(params.id));

  if (!product) {
    return <div>Product not found</div>;
  }

  return <ProductOverview product={product} />;
}