'use client'
import { useRouter } from 'next/router';
import ProductOverview from '../../components/ProductOverview';
import { products } from '../../data/products';

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const productId = parseInt(id as string, 10);
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return <p>Product not found</p>;
  }

  return <ProductOverview product={product} />;
}