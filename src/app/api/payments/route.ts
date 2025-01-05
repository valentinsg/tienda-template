import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://busy.com.ar';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface PaymentRequestBody {
  cartItems: CartItem[];
  totalPrice: number;
}

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming request body
    const { cartItems }: PaymentRequestBody = await request.json();
    
    if (!cartItems || !cartItems.length) {
      return NextResponse.json({
        error: 'Cart items are required'
      }, { status: 400 });
    }

    // Initialize Mercado Pago client
    const mercadopago = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN!
    });

    // Create preference with cart items
    const preference = await new Preference(mercadopago).create({
      body: {
        items: cartItems.map(item => ({
          id: item.id,
          title: item.name,
          unit_price: item.price,
          quantity: item.quantity,
          currency_id: 'ARS', // Add your currency code here
        })),
        back_urls: {
          success: `${baseUrl}/success`,
          failure: `${baseUrl}/failure`,
          pending: `${baseUrl}/pending`,
        },
        auto_return: 'approved',
        notification_url: `${baseUrl}/api/webhook`, // Optional: Add this if you want to receive payment notifications
        statement_descriptor: 'BUSY STORE', // This is what appears on the buyer's card statement
        external_reference: Date.now().toString(), // Useful for tracking orders
      },
    });

    if (!preference.init_point) {
      throw new Error('Failed to get payment init point from Mercado Pago');
    }

    return NextResponse.json({
      initPoint: preference.init_point
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