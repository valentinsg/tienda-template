import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { CartItem } from '@/types/CartItem';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

interface PaymentRequestBody {
  cartItems: CartItem[];
  totalPrice: number;
  shippingMethod: 'home' | 'branch';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  orderId: string;
}

export async function POST(request: NextRequest) {
  try {
    const { cartItems, shippingMethod, orderId }: PaymentRequestBody = await request.json();
    
    if (!cartItems || !cartItems.length) {
      return NextResponse.json({
        error: 'Cart items are required'
      }, { status: 400 });
    }

    // Calculate shipping cost based on method
    const shippingCost = shippingMethod === 'home' ? 9000 : 8000;

    const mercadopago = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN!
    });

    // Create array of items including products and shipping
    const items = [
      ...cartItems.map(item => ({
        id: item.id,
        title: item.name,
        unit_price: item.price,
        quantity: item.quantity,
        currency_id: 'ARS',
        size: item.size,
      })),
      {
        id: 'shipping',
        title: `Envío ${shippingMethod === 'home' ? 'a domicilio' : 'a sucursal'}`,
        unit_price: shippingCost,
        quantity: 1,
        currency_id: 'ARS'
      }
    ];

    const preference = await new Preference(mercadopago).create({
      body: {
        items,
        back_urls: {
          success: `${baseUrl}/checkout/success?order=${orderId}`,
          failure: `${baseUrl}/checkout/failure?order=${orderId}`,
          pending: `${baseUrl}/checkout/pending?order=${orderId}`,
        },
        auto_return: 'approved',
        notification_url: `${baseUrl}/api/webhook`,
        statement_descriptor: 'BUSY STORE',
        external_reference: orderId,
      },
    });

    if (!preference.init_point) {
      throw new Error('Failed to get payment init point from Mercado Pago');
    }

    return NextResponse.json({
      initPoint: preference.init_point,
      external_reference: orderId
    });
  } catch (error) {
    console.error('Payment Preference Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create payment preference',
        details: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}