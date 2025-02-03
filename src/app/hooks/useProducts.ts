import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { Product } from "../../types/Product";
import { Category } from "../../types/Category";

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "2XL"];

interface ProductResponse {
  products: Product[];
  categories: Category[];
  error: string | null;
}

const fetchSizes = async () => {
  const { data: sizesData, error } = await supabase.from("sizes").select("*");
  if (error) throw error;
  return sizesData;
};

const fetchCategories = async (): Promise<Category[]> => {
  const { data: categoryData, error } = await supabase
    .from("categories")
    .select("*");
  if (error) throw error;
  return categoryData || [];
};

const fetchProductsWithDetails = async (): Promise<ProductResponse> => {
  try {
    const sizesData = await fetchSizes();
    const sizeMap = sizesData.reduce(
      (acc, size) => {
        acc[size.id] = size.name.toUpperCase();
        return acc;
      },
      {} as Record<string, string>
    );

    const { data: productsData, error: productError } = await supabase
      .from("products")
      .select(`*, categories!inner(*), product_images(*)`);
    if (productError) throw productError;

    const { data: stockData, error: stockError } = await supabase
      .from("stock")
      .select("*");
    if (stockError) throw stockError;

    const processedProducts = productsData.map((product) => {
      const productStock = stockData
        .filter((stock) => stock.product_id === product.id)
        .reduce(
          (acc, stock) => {
            const sizeName = sizeMap[stock.size] ?? String(stock.size);
            acc[sizeName] = {
              stock: stock.quantity,
              sku: `${product.sku}-${sizeName}`,
            };
            return acc;
          },
          {} as Record<string, { stock: number; sku: string }>
        );

      SIZE_ORDER.forEach((size) => {
        if (!productStock[size]) {
          productStock[size] = { stock: 0, sku: "Out of stock" };
        }
      });

      const sortedStock = Object.fromEntries(
        SIZE_ORDER.filter((size) => productStock[size]).map((size) => [
          size,
          productStock[size],
        ])
      );

      return {
        ...product,
        category: product.categories,
        images: product.product_images,
        stock: sortedStock,
      };
    });

    const categories = await fetchCategories();
    return { products: processedProducts, categories, error: null };
  } catch (err) {
    console.error("Error fetching products:", err);
    return { products: [], categories: [], error: (err as Error).message };
  }
};

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    const {
      products: newProducts,
      categories: newCategories,
      error: newError,
    } = await fetchProductsWithDetails();
    setProducts(newProducts);
    setCategories(newCategories);
    setError(newError);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { products, categories, isLoading, error, refreshProducts: fetchData };
};
