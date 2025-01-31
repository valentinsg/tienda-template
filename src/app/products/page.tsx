'use client';
import React from 'react';
import Head from 'next/head';
import Products from './Products';

const ProductsPage = () => {

  return (
    <>
      <Head>
        <title>Productos Busy Streetwear | Ropa Urbana y Streetwear Argentina</title>
        <meta name="description" content="Explora nuestra colección de ropa urbana: buzos, remeras, pantalones y más. Envíos a todo Argentina. ¡Encontrá tu estilo en Busy Streetwear!" />
      </Head>
      <Products />
    </>
  );
};

export default ProductsPage;
