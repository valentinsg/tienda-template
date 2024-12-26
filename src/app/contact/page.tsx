'use client'
import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Enviando:', formData);
  };

  return (
    <div>
      <h1 >Contacto</h1>
      <div >
        <div>
          <h2 >Información de Contacto</h2>
          <div >
            <p>
              <span>Dirección:</span>
              Calle Ejemplo 123
            </p>
            <p >
              <span >Teléfono:</span>
              (123) 456-7890
            </p>
            <p >
              <span >Email:</span>
              info@mitienda.com
            </p>
          </div>
        </div>
        <div>
          <form onSubmit={handleSubmit} >
            <div>
              <label>Nombre</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              />
            </div>
            <div>
              <label >Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label >Mensaje</label>
              <textarea
                rows={4}
                value={formData.mensaje}
                onChange={(e) => setFormData({...formData, mensaje: e.target.value})}
              />
            </div>
            <button
              type="submit"
            >
              Enviar Mensaje
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;