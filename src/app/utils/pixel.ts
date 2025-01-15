declare global {
  interface Window {
    fbq: any;
  }
}

export const FB_PIXEL_ID = process.env.FB_PIXEL_ID;


// Inicialización del Pixel
export const pageview = () => {
  window.fbq('track', 'PageView')
}

// Eventos estándar de ecommerce
export const events = {
  addToCart: (data: any) => {
    window.fbq('track', 'AddToCart', {
      content_ids: [data.id],
      content_name: data.name,
      content_type: 'product',
      value: data.price,
      currency: 'ARS'
    })
  },
  initiateCheckout: (value: number) => {
    window.fbq('track', 'InitiateCheckout', {
      value: value,
      currency: 'ARS'
    })
  },
  purchase: (orderData: any) => {
    window.fbq('track', 'Purchase', {
      value: orderData.value,
      currency: 'ARS',
      content_ids: orderData.products.map((p: any) => p.id),
      content_type: 'product',
      num_items: orderData.products.length
    })
  }
}

// Script de inicialización
export const pixelInitScript = `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${FB_PIXEL_ID}');
fbq('track', 'PageView');
`