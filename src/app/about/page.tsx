'use client'
import React from 'react';

const AboutUs = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Sobre Nosotros</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Nuestra Historia</h2>
          <p className="text-gray-600 mb-4">
            Fundada en 2020, nuestra tienda nació con la visión de ofrecer ropa de calidad
            a precios accesibles. Desde entonces, hemos crecido hasta convertirnos en
            una referencia en el mercado de la moda.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Nuestra Misión</h2>
          <p className="text-gray-600">
            Buscamos ofrecer las últimas tendencias en moda mientras mantenemos
            nuestro compromiso con la calidad y la satisfacción del cliente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;