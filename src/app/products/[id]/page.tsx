import React from 'react';
import Product from './Product';
import { Metadata } from 'next';
import { supabase } from "../../supabase";

type GenerateMetadataProps = {
  params: Promise<{ id: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function getProductById(id: string) {
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      sku,
      product_images(image_url)
    `)
    .eq('id', id)
    .single();
  if (error || !product) return null;
  return product;
}



export async function generateMetadata({ params: paramsPromise, }: GenerateMetadataProps): Promise<Metadata> {
  const params = await paramsPromise;
  const product = await getProductById(params.id);

  if (!product) {
    return {
      title: 'Product Not Found | Busy Streetwear',
      description: 'El producto solicitado no se pudo encontrar.',
    };
  }

  return {
    title: `${product.name} | Busy Streetwear - Ropa Urbana Argentina`,
    description: `Compra ${product.name} en Busy Streetwear. Estilo urbano con envíos a toda Argentina. ¡Descúbrelo aquí!`,
    keywords: [
      product.name,
      "ropa urbana Mar del Plata",
      "comprar streetwear Argentina",
      "buzos y remeras urbanas",
      "boxy fit mar del plata",
      "ropa streetwear online",
      "moda urbana",
    ],
    openGraph: {
      title: `${product.name} | Busy Streetwear`,
      description: `Compra ${product.name} en Busy Streetwear. Envíos a toda Argentina.`,
      url: `https://busy.com.ar/productos/${product.id}`,
      images: product.product_images?.map((img: { image_url: string }) => ({
        url: img.image_url || '/placeholder.jpg',
        alt: `${product.name} - Busy Streetwear`,
        width: 1200,
        height: 630,
      })) || [],
    },
  };
}

const ProductPage = () => {
  return <Product />;
};

export default ProductPage;