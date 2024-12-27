import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from 'next/script';
import ClientProviders from "./context/ClientProviders";
import { LanguageProvider } from "./context/LanguageProvider";
import { ProductProvider } from './context/ProductContext';
import { Provider } from "./components/ui/provider";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import "./styles/globals.css";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://busystreetwear.com.ar'),
  title: {
    default: "Busy | Streetwear | Ropa Urbana y Streetwear en Mar Del Plata, Argentina",
    template: "%s | Busy Streetwear"
  },
  description: "Tienda online de ropa urbana y streetwear en Argentina. Envíos a todo el país. Encontrá las últimas tendencias en moda urbana.",
  keywords: ["streetwear", "ropa urbana", "moda argentina", "busy streetwear", "urban", "ropa mar del plata", "drops", "argentina", "envios", "comprar ropa mar del plata online", "comprar ropa busy", "busyto", "comprar busy since", "comprar ropa mar del plata online", "comprar ropa en mar del plata y de moda"],
  authors: [{ name: "Busy Streetwear" }],
  openGraph: {
    title: "Busy Streetwear | Ropa Urbana y Streetwear en Argentina",
    description: "Tienda online de ropa urbana y streetwear en Argentina. Envíos a todo el país.",
    url: 'https://busystreetwear.com.ar',
    siteName: 'Busy Streetwear',
    locale: 'es_AR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-AR" suppressHydrationWarning>
      <head>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ClothingStore",
              "name": "Busy Streetwear",
              "description": "Tienda online de ropa urbana y streetwear en Argentina",
              "url": "https://busystreetwear.com",
              "priceRange": "$$",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "AR"
              }
            })
          }}
        />
        <link rel="canonical" href="https://busystreetwear.com" />
        <meta name="geo.region" content="AR" />
        <meta name="geo.placename" content="Argentina" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <ProductProvider>
          <LanguageProvider>
            <Provider>
              <ClientProviders>
                <Header />
                <main>{children}</main>
                <Footer />
              </ClientProviders>
            </Provider>
          </LanguageProvider>
        </ProductProvider>
      </body>
    </html >
  );
}
