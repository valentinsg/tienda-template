import { MetadataRoute } from 'next';

export async function GET(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://busy.com.ar";

  // Aquí podrías obtener dinámicamente las URLs desde una base de datos
  const dynamicUrls = [
    "/products",
    "/contact",
    "/about",
    "/blog",
    "/faqs",
    "/products/category/hoodies",
    "/products/category/remeras",
  ];

  return dynamicUrls.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date().toISOString(),
  }));
}
