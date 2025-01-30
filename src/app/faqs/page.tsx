import { Metadata } from 'next';
import Script from 'next/script';
import FAQs from './FAQs';

export const metadata: Metadata = {
  title: 'Preguntas Frecuentes - Busy Streetwear',
  description: 'Encuentra respuestas a todas tus dudas sobre Busy Streetwear. Envíos, talles, medios de pago y más información sobre nuestra marca de ropa urbana.',
  alternates: {
    canonical: 'https://busy.com.ar/faqs'
  },
  openGraph: {
    title: 'Preguntas Frecuentes - Busy Streetwear',
    description: 'Encuentra respuestas a todas tus dudas sobre Busy Streetwear. Información sobre envíos, talles y más.',
    url: 'https://busy.com.ar/faqs',
    type: 'website',
    siteName: 'Busy Streetwear'
  },
  keywords: ['FAQ Busy Streetwear', 'preguntas frecuentes ropa urbana', 'dudas Busy', 'envíos Busy', 'talles Busy', 'atención al cliente Busy']
};

// Schema optimizado para FAQs
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Qué significa Busy?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Busy es el accionar constante que tiene que crear una persona en su día a dia para lograr sus objetivos..."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuál es la visión de Busy?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No solo queremos entregar productos de calidad y contenido elaborado, sino construir algo mas allá de lo empresarial..."
      }
    }
  ],
  "isPartOf": {
    "@type": "WebSite",
    "@id": "https://busy.com.ar/#website",
    "name": "Busy Streetwear",
    "url": "https://busy.com.ar"
  }
};

const FAQsPage = () => {
  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema)
        }}
      />
      <FAQs />
    </>
  );
};

export default FAQsPage;