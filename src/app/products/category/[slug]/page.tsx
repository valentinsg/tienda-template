'use client';

import React from 'react';
import prueba from '../../../../prueba.json';

export default function CategoryPage({ params }: { params: { slug: string } }) {
  // Simulamos recibir el slug como parámetro
  const { slug } = params;

  // Usamos el archivo prueba.json como fuente de datos
  const categoryProducts = [...prueba.products]; // Simulamos un array de productos

  // Filtra los productos por categoría (revisando si category es un id o un slug)
  const filteredProducts = categoryProducts.filter((product: { category: string | { slug: string } }) => {
    if (typeof product.category === 'string') {
      return product.category === slug; // Si category ya es un slug
    }
    if (typeof product.category === 'object' && 'slug' in product.category) {
      return product.category.slug === slug; // Si category tiene un objeto con un slug
    }
    return false;
  });

  return (
    <div>
      <h1>Productos en la Categoría: {slug}</h1>
      <ul>
        {filteredProducts.map((product) => (
          <li key={product.id}>
            {product.name} - ${product.price || 'No price available'}
          </li>
        ))}
      </ul>
    </div>
  );
};
