/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: 'https://busy.com.ar',
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
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
      { userAgent: '*', allow: '/' },
    ],
  },
};

export default config;