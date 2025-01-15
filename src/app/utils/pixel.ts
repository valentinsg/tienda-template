import { CartItem } from "@/types/CartItem";
import { CheckoutData } from "@/types/checkout/CheckoutData";

type FbqParameter = 
  | ['track', string, object?]
  | ['init', string];

type FbqQueueItem = {
  arguments: FbqParameter;
};

declare global {
  interface Window {
    fbq: {
      (...args: FbqParameter): void;
      callMethod?: (...args: FbqParameter) => void;
      queue?: FbqQueueItem[];
    };
    _fbq?: Window['fbq'];
  }
}

export const FB_PIXEL_ID = process.env.FB_PIXEL_ID;


// Inicialización del Pixel
export const pageview = () => {
  window.fbq('track', 'PageView')
}

// Eventos estándar de ecommerce
export const events = {
  addToCart: (item: CartItem) => {
    window.fbq('track', 'AddToCart', {
      content_ids: [item.id],
      content_name: item.name,
      content_type: 'product',
      value: item.price,
      currency: 'ARS',
    });
  },
  initiateCheckout: (value: number) => {
    window.fbq('track', 'InitiateCheckout', {
      value: value,
      currency: 'ARS',
    });
  },
  purchase: (orderData: CheckoutData) => {
    window.fbq('track', 'Purchase', {
      value: orderData.products.reduce((acc, item) => acc + item.price * item.quantity, 0),
      currency: 'ARS',
      content_ids: orderData.products.map((item) => item.id),
      content_type: 'product',
      num_items: orderData.products.reduce((acc, item) => acc + item.quantity, 0),
    });
  },
};

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