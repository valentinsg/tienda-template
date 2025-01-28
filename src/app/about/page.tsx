import Head from 'next/head';
import AboutUs from './AboutsUs';

const AboutUsPage = () => {
  return (
    <>
      <Head>
        <title>Sobre Nosotros - Busy</title>
        <meta name="description" content="Descubre la historia detrás de Busy, un movimiento que celebra ocuparse de lo que realmente importa. Conoce nuestra filosofía y únete a nuestra comunidad." />
        <meta name="keywords" content="Busy, ropa, movimiento, comunidad, filosofía, ocuparse, eudaimonía" />
        <meta property="og:title" content="Sobre Nosotros - Busy" />
        <meta property="og:description" content="Descubre la historia detrás de Busy, un movimiento que celebra ocuparse de lo que realmente importa." />
        <meta property="og:image" content="https://tfufdiayyhcndcgncylf.supabase.co/storage/v1/object/sign/imagenes%20web/creadores.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZW5lcyB3ZWIvY3JlYWRvcmVzLmpwZyIsImlhdCI6MTczNTk1OTc4MSwiZXhwIjoxNzY3NDk1NzgxfQ.eMCVXQ1yX0dunuQkdmV0eBeVBF5RVwbKVa9ft3I3hLw&t=2025-01-04T03%3A03%3A01.629Z" />
        <meta property="og:url" content="https://busy.com.ar/about" />
      </Head>
      <AboutUs />
    </>
  );
};

export default AboutUsPage;