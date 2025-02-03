import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { supabase } from "../../supabase";
import { generateTrackingCode } from '@/app/utils/tracking';

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
      .eq('status', 'pending') 
      .single();

    if (recordError) {
      console.error('Error fetching payment record:', recordError);
      return NextResponse.json({ error: 'Payment record not found or already processed' }, { status: 404 });
    }

    if (payment.status === 'approved') {
      const cartItems = paymentRecord.cart_items;
      
      // Usar una transacción para actualizar el stock
      const stockUpdates = cartItems.map(async (item: { id: any; size: string | number; quantity: number; }) => {
        // Primero verificar el stock actual
        const { data: currentProduct } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.id)
          .single();

        if (!currentProduct?.stock?.[item.size]?.stock) {
          throw new Error(`No stock available for product ${item.id} size ${item.size}`);
        }

        const currentStock = currentProduct.stock[item.size].stock;
        if (currentStock < item.quantity) {
          throw new Error(`Insufficient stock for product ${item.id} size ${item.size}`);
        }

        // Actualizar el stock
        const newStock = {
          ...currentProduct.stock,
          [item.size]: {
            ...currentProduct.stock[item.size],
            stock: currentStock - item.quantity
          }
        };

        return supabase
          .from('products')
          .update({ stock: newStock })
          .eq('id', item.id);
      });

      try {
        await Promise.all(stockUpdates);
        
        // Actualizar el estado del pago
        await supabase
          .from('payment_records')
          .update({
            status: 'success',
            tracking_code: generateTrackingCode(),
            payment_id: payment.id,
            payment_status: payment.status,
            notes: `Pago aprobado - ID: ${payment.id}`
          })
          .eq('id', orderId);

      } catch (error) {
        console.error('Error updating stock:', error);
        // Marcar el pago como problemático pero aprobado
        await supabase
          .from('payment_records')
          .update({
            status: 'success_with_errors',
            notes: `Pago aprobado pero con errores en stock - ID: ${payment.id}`
          })
          .eq('id', orderId);
      }
    } else {
      await supabase
        .from('payment_records')
        .update({
          status: 'failure',
          payment_id: payment.id,
          payment_status: payment.status,
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