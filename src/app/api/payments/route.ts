// src/app/api/payments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { readFileSync } from 'node:fs';
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://busy.com.ar';

interface Message {
  id: number;
  text: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming request body
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ 
        error: 'Message text is required' 
      }, { status: 400 });
    }

    // Initialize Mercado Pago client
    const mercadopago = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN!
    });

    // Create preference
    const preference = await new Preference(mercadopago).create({
      body: {
        items: [
          {
            id: "product-id",
            unit_price: 1, // Aquí va el precio del producto
            quantity: 1,
            title: "Product Title", // Título del producto
          },
        ],
        payment_methods: {
          installments: 12, // Número máximo de cuotas
        },
        back_urls: {
          success: `${baseUrl}/success`,
          failure: `${baseUrl}/failure`,
          pending: `${baseUrl}/pending`,
        },
        auto_return: 'approved',
      },
    });

    // Return the init point
    return NextResponse.json({
      initPoint: preference.init_point
    });
  } catch (error) {
    console.error('Payment Preference Error:', error);
  
    return NextResponse.json(
      {
        error: 'Failed to create payment preference',
        details: error instanceof Error ? error.stack || error.message : JSON.stringify(error),
      },
      { status: 500 }
    );
  }
}

// Optional: Add a GET method to list messages
export async function GET() {
  try {
    // Read messages from the database file
    const db = readFileSync("db/message.db");
    const messages: Message[] = JSON.parse(db.toString());
    
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error reading messages:', error);
    
    return NextResponse.json({
      error: 'Failed to retrieve messages',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}