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
    default: "Busy Streetwear | Ropa Urbana y Streetwear en Mar del Plata, Argentina",
    template: "%s | Busy Streetwear - Ropa Urbana Argentina",
  },
  description: "Descubrí la mejor selección de ropa urbana y streetwear en Mar del Plata. Busy Streetwear ofrece las últimas tendencias en moda urbana con envíos a todo Argentina. Encontrá remeras, buzos, pantalones y más.",
  keywords: [
    "ropa urbana Mar del Plata",
    "streetwear Argentina",
    "tienda ropa urbana",
    "ropa streetwear",
    "busy streetwear",
    "ropa urbana argentina",
    "comprar ropa urbana online",
    "buzos streetwear",
    "remeras urbanas",
    "pantalones cargo",
    "moda urbana argentina",
    "envíos ropa todo el país",
  ],
  openGraph: {
    title: "Busy Streetwear | La Mejor Ropa Urbana en Mar del Plata",
    description: "Tienda líder de streetwear en Argentina. Diseños únicos, calidad premium y envíos a todo el país. ¡Encontrá tu estilo en Busy!",
    url: 'https://busy.com.ar',
    siteName: 'Busy Streetwear Argentina',
    locale: 'es_AR',
    type: 'website',
    images: [
      {
        url: '{/public/favicon.ico}',
        alt: 'Busy Streetwear Logo',
        width: 1200,
        height: 630,
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
