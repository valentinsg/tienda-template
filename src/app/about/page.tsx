import { Metadata } from 'next';
import Script from 'next/script';
import AboutUs from './AboutUs';

export const metadata: Metadata = {
  title: 'Sobre Nosotros - Busy Streetwear',
  description: 'Descubre la historia detrás de Busy, un movimiento que celebra ocuparse de lo que realmente importa. Conoce nuestra visión y valores.',
  alternates: {
    canonical: 'https://busy.com.ar/about'
  },
  openGraph: {
    title: 'Sobre Nosotros - Busy Streetwear',
    description: 'Descubre la historia detrás de Busy, un movimiento que celebra ocuparse de lo que realmente importa.',
    url: 'https://busy.com.ar/about',
  }
};

// Schema.org markup mejorado para el layout
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://busy.com.ar/#organization",
  "name": "Busy Streetwear",
  "url": "https://busy.com.ar",
  "logo": {
    "@type": "ImageObject",
    "url": "[URL del logo]",
    "width": "112",
    "height": "112"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "tu@email.com",
    "areaServed": "AR",
    "availableLanguage": "Spanish"
  },
  "sameAs": [
    "https://www.instagram.com/busy.streetwear/",
    "https://www.facebook.com/[tu-pagina]"
  ],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Mar del Plata",
    "addressRegion": "Buenos Aires",
    "addressCountry": "Argentina"
  }
};

const AboutUsPage = () => {
  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />
      <AboutUs />
    </>
  );
};

export default AboutUsPage;