// IMPORTANTE -> Este archivo es un ejemplo de cómo se puede configurar un cliente Axios para hacer peticiones a una API específica.

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://nominatim.openstreetmap.org/',
  headers: {
    'User-Agent': 'BusyStreetwear/1.0 (busystreetwear@gmail.com)', // ¡Personalizar esto siempre en cada proyecto!
  },
});

export default axiosInstance;
