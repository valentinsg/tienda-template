import React from 'react';
import type { Metadata } from "next";
import Products from './Products';

export const metadata: Metadata = {
  title: 'Productos Busy Streetwear | Remeras, Buzos y Más - Streetwear Argentina',
  description: 'Explora nuestra colección de ropa urbana en Busy Streetwear. Buzos, remeras, pantalones y más. Envíos a toda Argentina.',
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
    title: "Productos Busy Streetwear | Ropa Urbana Argentina",
    description: "Descubre los mejores productos de streetwear en Argentina. Moda urbana con envío a todo el país.",
    url: 'https://busy.com.ar/productos',
    images: [
      {
        url: '{/public/favicon.ico}',
        alt: 'Nueva colección de ropa urbana 2024 en Busy Streetwear',
        width: 1200,
        height: 630,
      }
    ]
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
