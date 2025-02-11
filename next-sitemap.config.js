/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: 'https://busy.com.ar', // Reemplaza con tu dominio real
  generateRobotsTxt: true, // Genera también el robots.txt
  changefreq: 'daily', // Frecuencia de actualización
  priority: 0.7, // Prioridad de las páginas
  sitemapSize: 5000, // Límite de URLs por archivo sitemap
  exclude: ['/admin', '/cart'], // Excluye rutas privadas
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' }, // Permite a todos los bots
    ],
  },
};
export default config;