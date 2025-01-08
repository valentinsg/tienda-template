import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { supabase } from "../../supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verificar si es una notificación de pago
    if (body.type !== 'payment') {
      return NextResponse.json({ message: 'Non-payment webhook received' });
    }

    // Configurar MercadoPago
    const mercadopago = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN!
    });

    // Obtener los detalles del pago
    const payment = await new Payment(mercadopago).get({ id: body.data.id });
    const orderId = payment.external_reference; // Este es el ID que guardamos en Supabase

    // Obtener el registro de pago de Supabase
    const { data: paymentRecord, error: recordError } = await supabase
      .from('payment_records')
      .select('*')
      .eq('id', orderId)
      .single();

    if (recordError) {
      console.error('Error fetching payment record:', recordError);
      return NextResponse.json({ error: 'Payment record not found' }, { status: 404 });
    }

    // Si el pago fue aprobado, actualizar stock
    if (payment.status === 'approved') {
      const cartItems = paymentRecord.cart_items;
      
      // Actualizar el stock de cada producto
      for (const item of cartItems) {
        const { data: product, error: productError } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.id)
          .single();

        if (productError) {
          console.error(`Error fetching product ${item.id}:`, productError);
          continue;
        }

        // Actualizar el stock del tamaño específico
        const newStock = { ...product.stock };
        if (newStock[item.size]) {
          newStock[item.size].stock = Math.max(0, newStock[item.size].stock - item.quantity);
        }

        // Guardar el nuevo stock
        const { error: updateError } = await supabase
          .from('products')
          .update({ stock: newStock })
          .eq('id', item.id);

        if (updateError) {
          console.error(`Error updating stock for product ${item.id}:`, updateError);
        }
      }

      // Actualizar el registro de pago
      const { error: updateError } = await supabase
        .from('payment_records')
        .update({
          status: 'success',
          tracking_code: generateTrackingCode(),
          notes: `Pago aprobado - ID: ${payment.id}`
        })
        .eq('id', orderId);

      if (updateError) {
        console.error('Error updating payment record:', updateError);
      }
    } else {
      // Actualizar el registro si el pago no fue aprobado
      await supabase
        .from('payment_records')
        .update({
          status: 'failure',
          notes: `Pago no aprobado - Estado: ${payment.status}`
        })
        .eq('id', orderId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Función auxiliar para generar código de seguimiento
function generateTrackingCode(): string {
  return 'TRK-' + Date.now().toString(36).toUpperCase();
}