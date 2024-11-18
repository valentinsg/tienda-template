import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://nominatim.openstreetmap.org/',
  headers: {
    'User-Agent': 'BusyStreetwear/1.0 (busystreetwear@gmail.com)', // ¡Personaliza esto!
  },
});

export default axiosInstance;
