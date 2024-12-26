'use client';
import { useParams } from 'next/navigation';
import ProductOverview from '../components/ProductOverview';
import { useProducts } from '../context/ProductContext';

export default function ProductPage() {
  const params = useParams();
  const { products, isLoading, error } = useProducts();
  
  const product = products.find(p => p.id === Number(params.id));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading product</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }
  
  if (!params) {
    return <div>Invalid product ID</div>;
  }

  return <ProductOverview product={product} />;
}