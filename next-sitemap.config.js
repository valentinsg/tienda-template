/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: 'https://busy.com.ar', // Dominio principal
  generateRobotsTxt: true, // Genera también el robots.txt
  changefreq: 'daily', // Frecuencia de actualización
  priority: 0.7, // Prioridad de URLs
  sitemapSize: 5000, // Límite de URLs por sitemap
  exclude: [
    '/admin',
    '/cart',
    '/checkout',
    '/checkout/failure',
    '/checkout/pending',
    '/checkout/success',
    '/privacy',
    '/terms'
  ], // Excluye estas rutas
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' }, // Permite a todos los bots
    ],
  },
};

export default config;
