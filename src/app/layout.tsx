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
    default: "Busy Streetwear - Moda Urbana y Tendencias en Mar del Plata, Argentina",
    template: "%s | Busy Streetwear - Mar del Plata",
  },
  description: "Encuentra Busy Streetwear, tu tienda online de moda y ropa urbana en Mar del Plata. Descubrí las últimas tendencias de ropa urbana y streetwear en Argentina.",
  keywords: [
    "ropa urbana en Mar del Plata",
    "moda urbana en la costa atlántica",
    "tiendas de ropa en Mar del Plata",
    "streetwear en Argentina",
    "streetwear",
    "ropa urbana",
    "ropa urbana en Mar Del Plata",
    "ropa mar del plata",
    "busy since 2024",
    "busy streetwear",
    "drops",
    "argentina",
    "envios",
    "comprar ropa mar del plata online",
    "comprar ropa busy",
    "comprar busy since",
    "comprar ropa streetwear",
  ],
  authors: [{ name: "Busy Streetwear" }],
  openGraph: {
    title: "Busy Streetwear | Comunidad de Ropa Urbana y Streetwear en Argentina",
    description: "Tienda online de ropa urbana y streetwear en Argentina. Envíos a todo el país.",
    url: 'https://busy.com.ar',
    siteName: 'Busy Streetwear',
    locale: 'es_AR',
    type: 'website',
    images: [
      {
        url: '{/public/favicon.ico}',
        alt: 'Busy Streetwear Logo'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Busy Streetwear',
    description: 'Tienda online de ropa urbana y streetwear en Argentina',
    images: ['[URL de tu imagen principal]'],
  },
  verification: {
    google: 'tu-codigo-de-verificacion',
    yandex: 'tu-codigo-de-verificacion',
  },
  alternates: {
    canonical: 'https://busy.com.ar',
    languages: {
      'es-AR': 'https://busy.com.ar',
    }
  }
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
              "description": "Tienda online de ropa urbana y streetwear en Argentina.",
              "url": "https://busy.com.ar",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Mar del Plata",
                "addressRegion": "Buenos Aires",
                "addressCountry": "Argentina"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": -38.0023,
                "longitude": -57.5575
              },
              "sameAs": [
                "https://www.instagram.com/busy.streetwear/",
                "https://www.tiktok.com/@busy.streetwear"
              ]
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
        <meta name="geo.position" content="-38.0023;-57.5575" />
        <meta name="geo.placename" content="Mar del Plata, Buenos Aires, Argentina" />
        <meta name="geo.region" content="AR-B" />
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
