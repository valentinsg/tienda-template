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
  ],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' }, // Permite a todos los bots
    ],
  },
  additionalPaths: async (config) => {
    try {
      const { fetchCategories } = await import('./app/hooks/useProducts');
      const categories = await fetchCategories();

      return categories
        .filter((category) => category.slug) 
        .map((category) => ({
          loc: `/products/category/${category.slug}`,
          changefreq: 'daily',
          priority: 0.7,
          lastmod: new Date().toISOString(), 
        }));
    } catch (error) {
      console.error('Error generating additional paths:', error);
      return []; 
    }
  },
};

export default config;