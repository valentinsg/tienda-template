// src/app/api/payments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { readFileSync } from 'node:fs';

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
            id: "message",
            unit_price: 1,
            quantity: 1,
            title: "Mensaje de muro",
          },
        ],
        metadata: {
          text,
        },
        back_urls: {
          success: 'http://localhost:3000/success',
          failure: 'http://localhost:3000/failure',
          pending: 'http://localhost:3000/pending',
        },
        auto_return: 'approved',
      }
    });

    // Return the init point
    return NextResponse.json({
      initPoint: preference.init_point
    });
  } catch (error) {
    console.error('Payment Preference Error:', error);
    
    return NextResponse.json({
      error: 'Failed to create payment preference',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
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