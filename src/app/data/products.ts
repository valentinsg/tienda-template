import { Product } from "../../types/Product";

export const products: Product[] = [
    {
      id: 1,
      name: "Basic Tee Black",
      href: "#",
      imageSrc:
        "https://tailwindui.com/plus/img/ecommerce-images/product-page-01-related-product-01.jpg",
      imageAlt: "Front of men's Basic Tee in black.",
      price: "$35",
      colors: ["Black", "White"],
      sizes: ["S", "M", "L", "XL"],
      stock: 14,
      category: "T-Shirts",
      color: "Black",
      description: "A versatile and comfortable tee that works as a base layer.",
      additionalImages: [
        "https://tailwindui.com/plus/img/ecommerce-images/product-page-01-related-product-01.jpg",
      ],
    },
    {
      id: 2,
      name: "Basic Tee White",
      href: "#",
      imageSrc:
        "https://tailwindui.com/plus/img/ecommerce-images/product-page-01-related-product-02.jpg",
      imageAlt: "Front of men's Basic Tee in white.",
      price: "$35",
      colors: ["White", "Black"],
      sizes: ["S", "M", "L", "XL"],
      stock: 12,
      category: "T-Shirts",
      color: "White",
      description: "A versatile and comfortable tee that works as a base layer.",
    },
    {
      id: 3,
      name: "Comfy Hoodie",
      href: "#",
      imageSrc:
        "https://tailwindui.com/plus/img/ecommerce-images/product-page-01-related-product-03.jpg",
      imageAlt: "Front of men's Hoodie in gray.",
      price: "$60",
      colors: ["Gray", "Navy"],
      sizes: ["M", "L", "XL", "XXL"],
      stock: 8,
      category: "Hoodies",
      color: "Gray",
      description:
        "Stay cozy with this comfortable hoodie, perfect for chilly days.",
    },
    {
      id: 4,
      name: "Classic Jeans",
      href: "#",
      imageSrc:
        "https://tailwindui.com/plus/img/ecommerce-images/product-page-01-related-product-04.jpg",
      imageAlt: "Front of men's jeans in blue.",
      price: "$50",
      colors: ["Blue"],
      sizes: ["28", "30", "32", "34"],
      stock: 20,
      category: "Jeans",
      color: "Blue",
      description: "Classic jeans made from premium denim with a modern fit.",
    },
  ];
  