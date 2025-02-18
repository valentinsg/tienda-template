import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { supabase } from "../../supabase";
import { generateTrackingCode } from '@/app/utils/tracking';
import nodemailer from 'nodemailer';
import { PaymentRecord } from '@/types/checkout/payment/PaymentRecord';
import { CartItem } from '@/types/CartItem';

// Create email transporter for Zoho Mail
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.ZOHO_EMAIL!,
    pass: process.env.ZOHO_PASSWORD!,
  },
});

// Function to send order confirmation email
async function sendOrderConfirmationEmail(paymentRecord: PaymentRecord, trackingCode: string) {
  try {
    const customerEmail = paymentRecord.customer_email;
    const customerName = paymentRecord.customer_name;
    const shippingMethod = paymentRecord.shipping_method;
    const orderTotal = paymentRecord.total_amount;
    const orderItems = paymentRecord.cart_items;
    
    // Calculate estimated delivery date based on shipping method
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + (shippingMethod === 'home' ? 7 : 5));
    const formattedDate = estimatedDelivery.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    // Create HTML for items in the order
    let itemsHtml = '';
    orderItems.forEach((item: CartItem) => {
      itemsHtml += `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} (Talle: ${item.size})</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `;
    });

    // Prepare email
    const mailOptions = {
      from: `Busy Store <${process.env.ZOHO_EMAIL!}>`,
      to: customerEmail,
      cc: process.env.RECIPIENT_EMAIL!,
      subject: '¡Gracias por tu compra! - Busy Store',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://www.busy.com.ar/logo.png" alt="Busy Store Logo" style="max-width: 150px; height: auto;">
          </div>
          
          <h2 style="color: #2a3990; text-align: center;">¡Gracias por tu compra, ${customerName}!</h2>
          
          <p>Nos complace confirmar que hemos recibido tu pedido y está siendo procesado. A continuación encontrarás los detalles:</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2a3990;">Detalles de tu pedido:</h3>
            <p><strong>Número de seguimiento:</strong> ${trackingCode}</p>
            <p><strong>Método de envío:</strong> ${shippingMethod === 'home' ? 'A domicilio' : 'Retiro en sucursal Andreani'}</p>
            <p><strong>Fecha estimada de entrega:</strong> ${formattedDate}</p>
          </div>
          
          <h3 style="color: #2a3990;">Productos:</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="padding: 10px; text-align: left;">Producto</th>
                <th style="padding: 10px; text-align: center;">Cantidad</th>
                <th style="padding: 10px; text-align: right;">Precio Unitario</th>
                <th style="padding: 10px; text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Total:</td>
                <td style="padding: 10px; text-align: right; font-weight: bold;">$${orderTotal.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          
          <div style="background-color: #f0f4ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2a3990;">Información importante:</h3>
            <p>Tu pedido será enviado en los próximos días hábiles. Recibirás actualizaciones sobre el estado de tu envío a medida que avance.</p>
            <p>Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos a <a href="mailto:${process.env.ZOHO_EMAIL!}" style="color: #2a3990;">${process.env.ZOHO_EMAIL!}</a>.</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center;">
            <p style="font-size: 14px; color: #777;">
              ¡Gracias por elegir Busy Store!<br>
              <a href="https://www.busy.com.ar" style="color: #2a3990; text-decoration: none;">www.busy.com.ar</a>
            </p>
            <div style="margin-top: 15px;">
              <a href="https://www.instagram.com/busy.storearg/" style="margin: 0 10px; text-decoration: none;">
                <img src="https://www.busy.com.ar/instagram-icon.png" alt="Instagram" style="width: 24px; height: 24px;">
              </a>
              <a href="https://www.facebook.com/busy.storearg/" style="margin: 0 10px; text-decoration: none;">
                <img src="https://www.busy.com.ar/facebook-icon.png" alt="Facebook" style="width: 24px; height: 24px;">
              </a>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to ${customerEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
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
      
      // Generate tracking code
      const trackingCode = generateTrackingCode();
      
      // Update stock for each item
      for (const item of cartItems) {
        // Fetch current stock
        const { data: stockData, error: stockError } = await supabase
          .from('stock')
          .select('*')
          .eq('product_id', item.id)
          .eq('size', item.size)
          .single();
          
        if (stockError || !stockData) {
          throw new Error(`Stock not found for product ${item.id} size ${item.size}`);
        }
        
        // Verify sufficient stock
        if (stockData.quantity < item.quantity) {
          throw new Error(`Insufficient stock for product ${item.id} size ${item.size}`);
        }
        
        // Update stock
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
      
      // Send order confirmation email
      await sendOrderConfirmationEmail(paymentRecord, trackingCode);
      
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
    return NextResponse.json({ 
      error: 'Webhook processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}