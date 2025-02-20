import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { supabase } from "../../supabase";
import { generateTrackingCode } from '@/app/utils/tracking';
import { sendOrderConfirmation } from '@/lib/sendEmail';

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
      const totalPrice = paymentRecord.total_price;

      // Enviar email de confirmación
      await sendOrderConfirmation(orderId, cartItems, totalPrice);

      // Actualizar stock
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

      // Actualizar registro de pago
      await supabase
        .from('payment_records')
        .update({
          status: 'success',
          tracking_code: generateTrackingCode(),
          payment_id: payment.id,
          payment_status: payment.status,
          notes: `Payment approved - ID: ${payment.id}`
        })
        .eq('id', orderId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
