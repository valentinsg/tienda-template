// app/category/[slug]/page.tsx
import React from 'react';
import CategoryPage from './Category';
import { Metadata } from 'next';
import { supabase } from "../../../supabase";

type GenerateMetadataProps = {
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function getCategoryBySlug(slug: string) {
  const { data: category, error } = await supabase
    .from('categories')
    .select(`
      id,
      name,
      slug,
      description,
      image_url
    `)
    .eq('slug', slug)
    .single();
  
  if (error || !category) return null;
  return category;
}

async function getProductsByCategory(categoryId: number) {
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      images:product_images(image_url)
    `)
    .eq('category_id', categoryId)
    .limit(5);
  
  if (error || !products) return [];
  return products;
}

export async function generateMetadata({ params: paramsPromise }: GenerateMetadataProps): Promise<Metadata> {
  const params = await paramsPromise;
  const category = await getCategoryBySlug(params.slug);
  
  if (!category) {
    return {
      title: 'Categoría No Encontrada | Busy Streetwear',
      description: 'La categoría solicitada no se pudo encontrar.',
    };
  }

  // Get some products from this category for enhanced SEO
  const categoryProducts = await getProductsByCategory(category.id);
  const productNames = categoryProducts.map(p => p.name).join(', ');
  
  return {
    title: `${category.name} | Colección de Ropa Urbana | Busy Streetwear Argentina`,
    description: `Explora nuestros ${category.name.toLowerCase()} en Busy Streetwear. ${category.description || 'Estilo urbano con envíos a toda Argentina. ¡Descubre nuestro catálogo!'}`,
    keywords: [
      `${category.name} urbano`,
      `${category.name} streetwear`,
      "ropa urbana Mar del Plata",
      "ropa Mar Del Plata",
      "Busy ropa",
      "comprar streetwear Argentina",
      "moda urbana argentina",
      "streetwear online",
      "streetwear en Mar del Plata",
      category.slug,
    ],
    openGraph: {
      title: `${category.name} | Busy Streetwear Argentina`,
      description: `Explora nuestra colección de ${category.name.toLowerCase()}. ${productNames.length > 0 ? `Productos destacados: ${productNames}` : 'Envíos a toda Argentina.'}`,
      url: `https://busy.com.ar/products/category/${category.slug}`,
      images: [
        {
          url: category.image_url || '/category-placeholder.jpg',
          alt: `${category.name} - Colección Busy Streetwear`,
          width: 1200,
          height: 630,
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} | Busy Streetwear`,
      description: `Explora nuestra colección de ${category.name.toLowerCase()} en Busy Streetwear. Envíos a toda Argentina.`,
      images: [category.image_url || '/category-placeholder.jpg'],
    },
    alternates: {
      canonical: `https://busy.com.ar/category/${category.slug}`,
    }
  };
}

const CategoryPageWrapper = ({ params }: { params: Promise<{ slug: string }> }) => {
  return <CategoryPage params={params} />;
};

export default CategoryPageWrapper;