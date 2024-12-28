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
      // If 'text' is not provided, return a 400 error
      return NextResponse.json({ 
        error: 'Message text is required' 
      }, { status: 400 });
    }

    // Initialize Mercado Pago client with access token
    const mercadopago = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN!
    });

    // Create the payment preference
    const preference = await new Preference(mercadopago).create({
      body: {
        items: [
          {
            id: "message",
            unit_price: 1, // You can adjust the price here if needed
            quantity: 1,
            title: "Mensaje de muro", // You can adjust the title
          },
        ],
        metadata: {
          text, // Including the text metadata from the request body
        },
        back_urls: {
          success: `${baseUrl}/success`,  // Change this to your actual production URL
          failure: `${baseUrl}/failure`,  // Change this to your actual production URL
          pending: `${baseUrl}/pending`,  // Change this to your actual production URL
        },
        auto_return: 'approved',  // Automatically returns to the success URL if approved
      }
    });

    // Return the init point for the payment (MercadoPago's redirection URL)
    return NextResponse.json({
      initPoint: preference.init_point
    });
  } catch (error) {
    console.error('Payment Preference Error:', error);

    // Return a 500 status with error details if the request fails
    return NextResponse.json({
      error: 'Failed to create payment preference',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Optional: Add a GET method to list messages
export async function GET() {
  try {
    // Read messages from the database file (for demonstration purposes, using a local db file)
    const db = readFileSync("db/message.db");
    const messages: Message[] = JSON.parse(db.toString());
    
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error reading messages:', error);

    // Return an error response if reading messages fails
    return NextResponse.json({
      error: 'Failed to retrieve messages',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
