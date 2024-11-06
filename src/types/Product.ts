
interface BackendProduct {
  id: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  name: string;
  slug: string;
  sku: string;
  description: string;
  price: string;
  sale_price?: string | null;
  sale_start?: string | null;
  sale_end?: string | null;
  featured: boolean;
  available_sizes: Record<string, { stock: number; sku: string }>;
  meta_title?: string;
  meta_description?: string;
  weight?: number | null;
  dimensions?: string | null;
  tags: string[];
  category: number;
}

export interface Product {
  id: number;
  name: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  price: string;
  sizes: string[];
  featured: boolean;
  stock: number;
  description: string;
  category: string;
  colors: string[];
  additionalImages?: string[];
}

export const transformProductData = (data: BackendProduct[]): Product[] => {
  return data.map((item) => {
    const sizes = Object.keys(item.available_sizes); // Extrae las tallas disponibles
    const stock = sizes.reduce((total, size) => total + item.available_sizes[size].stock, 0); // Suma el stock total

    // Define la URL base de las imágenes, usando el SKU o ID del producto como convención
    const imageBaseUrl = "https://mi-servidor-de-imagenes.com/products";
    const imageSrc = `${imageBaseUrl}/${item.sku || item.id}.jpg`; // Intenta asignar por SKU, y si no, por ID
    const imageAlt = item.name; // El alt puede ser el nombre del producto

    return {
      id: item.id,
      name: item.name,
      href: `/product/${item.slug}`,
      imageSrc: imageSrc,
      imageAlt: imageAlt,
      price: item.price,
      sizes: sizes,
      featured: item.featured,
      stock: stock,
      description: item.description,
      category: item.category.toString(), // Si necesitas el nombre de la categoría, podrías hacer otro fetch
      colors: [], // Si no hay información de colores, inicializamos vacío
      additionalImages: [`${imageBaseUrl}/${item.sku || item.id}-1.jpg`, `${imageBaseUrl}/${item.sku || item.id}-2.jpg`], // Imagenes adicionales como ejemplo
    };
  });
};
