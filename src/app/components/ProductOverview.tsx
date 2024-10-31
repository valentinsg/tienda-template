'use client';
import { Product } from '../../types/Product';
import { useState } from 'react';
import Link from 'next/link';

export default function ProductOverview({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(product.imageSrc);

  return (
    <div className="bg-white p-4 sm:p-8 lg:p-12">
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Carrusel de imágenes adicionales */}
        <div className="lg:col-span-2 flex flex-col space-y-2">
          {product.additionalImages && product.additionalImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Vista adicional ${index + 1}`}
              className={`cursor-pointer rounded-lg border ${selectedImage === image ? 'border-gray-900' : 'border-transparent'}`}
              onClick={() => setSelectedImage(image)}
            />
          ))}
        </div>

        {/* Imagen principal del producto */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <img
            src={selectedImage}
            alt={product.imageAlt}
            className="rounded-lg object-center object-cover max-h-[500px] w-full"
          />
        </div>

        {/* Detalles del producto */}
        <div className="lg:col-span-5 space-y-6">
          {/* Nombre y breadcrumb */}
          <div>
            <nav aria-label="Breadcrumb">
              <ol role="list" className="flex items-center space-x-2 text-sm text-gray-500">
                  <Link href="/" className="hover:text-gray-700">Home</Link>
                <li className="text-gray-300">/</li>
                <li aria-current="page">{product.name}</li>
              </ol>
            </nav>
            <h1 className="text-3xl font-bold text-gray-900 mt-4">{product.name}</h1>
          </div>

          {/* Precio */}
          <p className="text-3xl font-semibold text-gray-900">{product.price}</p>
          <p className="text-sm text-gray-500">Impuestos incluidos</p>

          {/* Descripción */}
          <div>
            <h2 className="text-lg font-medium text-gray-900">Descripción</h2>
            <p className="mt-2 text-gray-700">{product.description}</p>
          </div>

          {/* Selector de tallas */}
          <div>
            <h2 className="text-lg font-medium text-gray-900">Tallas</h2>
            <div className="mt-2 flex space-x-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:border-gray-500"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Botón de agregar al carrito */}
          <div>
            <button
              type="button"
              className="w-full py-3 text-white font-medium rounded-lg bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Añadir al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
