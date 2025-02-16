import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { supabase } from "../../supabase";
import { generateTrackingCode } from '@/app/utils/tracking';
import nodemailer from 'nodemailer';

// Configuración del transportador SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.ZOHO_EMAIL,
    pass: process.env.ZOHO_PASSWORD
  }
});

// Función para enviar email de confirmación
async function sendOrderConfirmationEmail(orderDetails: {
  customerEmail: string;
  customerName: string;
  orderId: string | undefined;
  trackingCode: string;
  shippingMethod: 'home' | 'branch';
  totalAmount: number;
  items: any[];
}) {
  const { customerEmail, customerName, orderId, trackingCode, shippingMethod, totalAmount, items } = orderDetails;
  
  // Crear lista de items HTML
  const itemsList = items.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">Talle: ${item.size}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">$${item.price}</td>
    </tr>
  `).join('');

  const emailContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
        .header { background-color: #000; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .order-details { margin: 20px 0; }
        .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .footer { background-color: #f4f4f4; padding: 20px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>¡Gracias por tu compra en Busy Store!</h1>
        </div>
        
        <div class="content">
          <h2>¡Hola ${customerName}!</h2>
          <p>Tu pedido ha sido confirmado y está siendo procesado.</p>
          
          <div class="order-details">
            <h3>Detalles de tu compra:</h3>
            <p>Número de orden: ${orderId}</p>
            <p>Código de seguimiento: ${trackingCode}</p>
            <p>Método de envío: ${shippingMethod === 'home' ? 'Envío a domicilio' : 'Retiro en sucursal'}</p>
            
            <table class="table">
              <thead>
                <tr>
                  <th style="padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">Producto</th>
                  <th style="padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">Talle</th>
                  <th style="padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">Cantidad</th>
                  <th style="padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">Precio</th>
                </tr>
              </thead>
              <tbody>
                ${itemsList}
              </tbody>
            </table>
            
            <p><strong>Total: $${totalAmount}</strong></p>
          </div>

          <div class="shipping-info">
            <h3>Información de envío:</h3>
            ${shippingMethod === 'home' 
              ? '<p>Tu pedido será entregado en un plazo de 5 a 7 días hábiles.</p>'
              : '<p>Tu pedido estará disponible para retiro en la sucursal seleccionada en 3 a 5 días hábiles.</p>'
            }
            <p>Podrás hacer seguimiento de tu pedido con el código: <strong>${trackingCode}</strong></p>
          </div>
        </div>
        
        <div class="footer">
          <p>Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos a ${process.env.RECIPIENT_EMAIL}</p>
          <p>¡Gracias por confiar en Busy Store!</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.ZOHO_EMAIL,
      to: customerEmail,
      cc: process.env.RECIPIENT_EMAIL, // Copia para la tienda
      subject: '¡Gracias por tu compra en Busy Store!',
      html: emailContent
    });

    return true;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
   
    if (body.type !== 'payment') {
      return NextResponse.json({ message: 'Non-payment webhook received' });
    }

    const mercadopago = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN!
    });

    const payment = await new Payment(mercadopago).get({ id: body.data.id });
    const orderId = payment.external_reference;

    // Fetch payment record
    const { data: paymentRecord, error: recordError } = await supabase
      .from('payment_records')
      .select('*')
      .eq('id', orderId)
      .single();

    if (recordError || !paymentRecord) {
      console.error('Error fetching payment record:', recordError);
      return NextResponse.json({ error: 'Payment record not found' }, { status: 404 });
    }

    if (payment.status === 'approved') {
      const cartItems = paymentRecord.cart_items;
      const trackingCode = generateTrackingCode();
     
      // Update stock for each item
      for (const item of cartItems) {
        const { data: stockData, error: stockError } = await supabase
          .from('stock')
          .select('*')
          .eq('product_id', item.id)
          .eq('size', item.size)
          .single();

        if (stockError || !stockData) {
          throw new Error(`Stock not found for product ${item.id} size ${item.size}`);
        }

        if (stockData.quantity < item.quantity) {
          throw new Error(`Insufficient stock for product ${item.id} size ${item.size}`);
        }

        const { error: updateError } = await supabase
          .from('stock')
          .update({
            quantity: stockData.quantity - item.quantity,
            updated_at: new Date().toISOString()
          })
          .eq('product_id', item.id)
          .eq('size', item.size);

        if (updateError) {
          throw new Error(`Failed to update stock for product ${item.id}: ${updateError.message}`);
        }
      }

      // Update payment record
      await supabase
        .from('payment_records')
        .update({
          status: 'success',
          tracking_code: trackingCode,
          payment_id: payment.id,
          payment_status: payment.status,
          notes: `Payment approved - ID: ${payment.id}`
        })
        .eq('id', orderId);

      // Send confirmation email
      await sendOrderConfirmationEmail({
        customerEmail: paymentRecord.customer_email,
        customerName: paymentRecord.customer_name,
        orderId: orderId,
        trackingCode: trackingCode,
        shippingMethod: paymentRecord.shipping_method,
        totalAmount: paymentRecord.total_amount,
        items: cartItems
      });

    } else {
      // Handle failed payment
      await supabase
        .from('payment_records')
        .update({
          status: 'failure',
          payment_id: payment.id,
          payment_status: payment.status,
          notes: `Payment not approved - Status: ${payment.status}`
        })
        .eq('id', orderId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}