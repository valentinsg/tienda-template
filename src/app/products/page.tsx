import React from 'react';
import type { Metadata } from "next";
import Products from './Products';

export const metadata: Metadata = {
  title: 'Productos',
  description: 'Explora nuestra colección de ropa urbana en Busy Streetwear. Buzos, remeras. Envíos a toda Argentina.',
  keywords: [
    "ropa urbana Mar del Plata",
    "comprar streetwear Argentina",
    "buzos y remeras urbanas",
    "boxy fit mar del plata",
    "streetwear Mar del Plata",
    "moda urbana",
    "ropa streetwear online",
    "ropa de hombre streetwear",
    "ropa de mujer streetwear"
  ],
  openGraph: {
    title: "Productos",
    description: "Descubre los mejores productos de streetwear en Argentina. Moda urbana con envío a todo el país.",
    url: 'https://busy.com.ar/products',
  }
};

const ProductsPage = () => {
  return (
    <>
      <Products />
    </>
  );
};

export default ProductsPage;
