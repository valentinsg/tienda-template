import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { CartItem } from '@/types/CartItem';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface PaymentRequestBody {
  cartItems: CartItem[];
  totalPrice: number;
  shippingMethod: 'home' | 'branch';
  shippingAddress: ShippingAddress;
  orderId: string;
}

export async function POST(request: NextRequest) {
  console.log('💰 Processing payment request');

  try {
    const body: PaymentRequestBody = await request.json();
    
    // Validaciones
    if (!body.orderId?.trim()) {
      return NextResponse.json({
        error: 'Order ID is required'
      }, { status: 400 });
    }

    if (!body.cartItems?.length) {
      return NextResponse.json({
        error: 'Cart items are required'
      }, { status: 400 });
    }

    if (!['home', 'branch'].includes(body.shippingMethod)) {
      return NextResponse.json({
        error: 'Invalid shipping method'
      }, { status: 400 });
    }

    // Validar dirección si es envío a domicilio
    if (body.shippingMethod === 'home') {
      const requiredFields = ['street', 'city', 'state', 'postalCode', 'country'];
      const missingFields = requiredFields.filter(field => !body.shippingAddress?.[field as keyof ShippingAddress]);
      
      if (missingFields.length > 0) {
        return NextResponse.json({
          error: `Missing shipping address fields: ${missingFields.join(', ')}`
        }, { status: 400 });
      }
    }

    // Calcular costo de envío
    const shippingCost = calculateShippingCost(body.shippingMethod, body.cartItems);

    // Configurar Mercado Pago
    if (!process.env.MP_ACCESS_TOKEN) {
      throw new Error('MP_ACCESS_TOKEN is not configured');
    }

    const mercadopago = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN
    });

    // Crear items para la preferencia
    const items = [
      ...body.cartItems.map(item => ({
        id: item.id,
        title: item.name,
        unit_price: item.price,
        quantity: item.quantity,
        currency_id: 'ARS',
        description: `Talle: ${item.size}`,
        category_id: 'fashion',
      })),
      {
        id: 'shipping',
        title: `Envío ${body.shippingMethod === 'home' ? 'a domicilio' : 'a sucursal'}`,
        unit_price: shippingCost,
        quantity: 1,
        currency_id: 'ARS',
        description: body.shippingMethod === 'home' 
          ? `Envío a: ${body.shippingAddress.street}, ${body.shippingAddress.city}`
          : 'Retiro en sucursal',
      }
    ];

    // Crear preferencia de pago
    const preference = await new Preference(mercadopago).create({
      body: {
        items,
        back_urls: {
          success: `${baseUrl}/checkout/success?order=${body.orderId}`,
          failure: `${baseUrl}/checkout/failure?order=${body.orderId}`,
          pending: `${baseUrl}/checkout/pending?order=${body.orderId}`,
        },
        auto_return: 'approved',
        notification_url: `${baseUrl}/api/webhook`,
        statement_descriptor: 'BUSY STORE',
        external_reference: body.orderId,
        expires: true,
        expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
      },
    });

    if (!preference.init_point) {
      throw new Error('Failed to get payment init point from Mercado Pago');
    }

    return NextResponse.json({
      initPoint: preference.init_point,
      external_reference: body.orderId
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

function calculateShippingCost(
  method: 'home' | 'branch',
  items: CartItem[]
): number {
  // Aquí puedes implementar tu lógica de cálculo de envío
  // Por ejemplo, basado en la cantidad de items, peso, distancia, etc.
  if (method === 'branch') {
    return 0;
  }

  // Ejemplo simple para envío a domicilio
  const basePrice = 0; // Precio base
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const additionalCost = Math.max(0, itemCount - 3) * 200; // $200 adicional por cada item después de 3

  return basePrice + additionalCost;
}