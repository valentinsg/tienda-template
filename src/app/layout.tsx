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
import { Toaster as ChakraToaster } from "./components/ui/toaster";
import NewsletterPopover from "./components/NewsletterPopover";
import { FB_PIXEL_ID, pixelInitScript } from './utils/pixel'
import Image from 'next/image';

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
  metadataBase: new URL('https://busy.com.ar'),
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
    url: 'https://busy.com.ar',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap" rel="stylesheet" />
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ClothingStore",
              "name": "Busy Streetwear",
              "description": "Tienda online de ropa urbana y streetwear en Argentina",
              "url": "https://busy.com.ar",
              "priceRange": "$$",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "AR"
              }
            })
          }}
        />
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: pixelInitScript }}
        />
        <noscript>
          <Image
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        <link rel="canonical" href="https://busy.com.ar" />
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
                <main>
                  {children}
                  <ChakraToaster />
                  <NewsletterPopover />
                </main>
                <Footer />
              </ClientProviders>
            </Provider>
          </LanguageProvider>
        </ProductProvider>
      </body>
    </html >
  );
}
