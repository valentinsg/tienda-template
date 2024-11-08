import React from 'react';
import { Product } from '../../types/Product';
import { useProducts } from '../context/ProductContext';
import Image from 'next/image';

interface ProductListProps {
  products?: Product[];
  onSelectProduct: (product: Product) => void;
}

export default function ProductList({ onSelectProduct }: ProductListProps) {
  const { products, isLoading, error } = useProducts();

  const handleProductClick = (product: Product) => {
    onSelectProduct(product);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Products</h2>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {(products ?? []).map((product) => (
            <button
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="group shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                <Image
                  alt={product.name}
                  src={product.images[0]?.image_url || '/path/to/placeholder.jpg'}
                  width={300}  // Define el ancho de la imagen
                  height={300} // Define el alto de la imagen
                  className="object-cover object-center group-hover:opacity-80 transition-opacity duration-300"
                />
              </div>
              <h3 className="mt-4 text-sm text-gray-700 font-semibold group-hover:text-blue-600 transition-colors duration-300">{product.name}</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">${product.price}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
