// src/app/api/payments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { CartItem } from '@/types/CartItem';
import { PaymentRecord } from '@/types/checkout/payment/PaymentRecord';

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
  personalData: PaymentRecord;
}

// Esta función también podría moverse a utils/email.ts si lo prefieres
async function sendConfirmationEmail(orderData: PaymentRequestBody) {
  try {
    const totalAmount = orderData.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Crear el contenido HTML del email
    const itemsList = orderData.cartItems.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.size || 'N/A'}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">$${item.price}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">$${item.price * item.quantity}</td>
      </tr>
    `).join('');

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">¡Gracias por tu compra!</h1>
        <p>Número de orden: ${orderData.orderId}</p>
        <h2>Detalles del pedido:</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f8f8f8;">
              <th style="padding: 10px; text-align: left;">Producto</th>
              <th style="padding: 10px; text-align: left;">Talle</th>
              <th style="padding: 10px; text-align: left;">Precio</th>
              <th style="padding: 10px; text-align: left;">Cantidad</th>
              <th style="padding: 10px; text-align: left;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4" style="padding: 10px; text-align: right;"><strong>Total:</strong></td>
              <td style="padding: 10px;"><strong>$${totalAmount}</strong></td>
            </tr>
          </tfoot>
        </table>
        
        <div style="margin-top: 20px;">
          <h3>Dirección de envío:</h3>
          <p>
            ${orderData.shippingAddress.street}<br>
            ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state}<br>
            ${orderData.shippingAddress.postalCode}<br>
            ${orderData.shippingAddress.country}
          </p>
          <p>Método de envío: ${orderData.shippingMethod === 'home' ? 'Envío a domicilio' : 'Retiro en sucursal'}</p>
        </div>
      </div>
    `;

    // Usar el mismo transportador de nodemailer desde utils/email
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.ZOHO_EMAIL,
        pass: process.env.ZOHO_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"BUSY STORE" <${process.env.ZOHO_EMAIL}>`,
      to: orderData.personalData.customer_email || process.env.RECIPIENT_EMAIL,
      subject: `Confirmación de Compra - Orden #${orderData.orderId}`,
      html: emailHtml,
    });

    return true;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const requestData: PaymentRequestBody = await request.json();
    
    if (!requestData.cartItems || !requestData.cartItems.length) {
      return NextResponse.json({
        error: 'Cart items are required'
      }, { status: 400 });
    }

    const shippingCost = requestData.shippingMethod === 'home' ? 0 : 0;
    const mercadopago = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN!
    });

    const items = [
      ...requestData.cartItems.map(item => ({
        id: item.id,
        title: item.name,
        unit_price: item.price,
        quantity: item.quantity,
        currency_id: 'ARS',
        size: item.size,
      })),
      {
        id: 'shipping',
        title: `Envío ${requestData.shippingMethod === 'home' ? 'a domicilio' : 'a sucursal'}`,
        unit_price: shippingCost,
        quantity: 1,
        currency_id: 'ARS'
      }
    ];

    const preference = await new Preference(mercadopago).create({
      body: {
        items,
        back_urls: {
          success: `${baseUrl}/checkout/success?order=${requestData.orderId}`,
          failure: `${baseUrl}/checkout/failure?order=${requestData.orderId}`,
          pending: `${baseUrl}/checkout/pending?order=${requestData.orderId}`,
        },
        auto_return: 'approved',
        notification_url: `${baseUrl}/api/webhook`,
        statement_descriptor: 'BUSY STORE',
        external_reference: requestData.orderId,
      },
    });

    if (!preference.init_point) {
      throw new Error('Failed to get payment init point from Mercado Pago');
    }

    // Enviar email de confirmación
    await sendConfirmationEmail(requestData);

    return NextResponse.json({
      initPoint: preference.init_point,
      external_reference: requestData.orderId
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

// Necesario para no tener errores con la API de Next.js
export async function GET() {
  return NextResponse.json({ message: 'This endpoint only accepts POST requests' });
}