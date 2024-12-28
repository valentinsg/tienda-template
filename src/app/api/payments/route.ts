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
    const client = new MercadoPagoConfig({ 
      accessToken: process.env.MP_ACCESS_TOKEN! 
    });
    const preferenceClient = new Preference(client);
    
    // Create the payment preference
    const preference = {
      items: [
        {
          id: "message",
          unit_price: 1, 
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
    };

    // Make the request to MercadoPago to create the preference
    const response = await preferenceClient.create({ body: preference });

    // Return the init point for the payment (MercadoPago's redirection URL)
    return NextResponse.json({
      initPoint: response.init_point
    });
  } catch (error) {
    console.error('Payment Preference Error:', error);

    // Enhance error message with more details
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);

    // Return detailed error information
    return NextResponse.json({
      error: 'Failed to create payment preference',
      details: errorMessage,
      statusCode: (error as { status?: number }).status || 500
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
