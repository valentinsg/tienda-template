import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { supabase } from "../../supabase";
import { generateTrackingCode } from '@/app/utils/tracking';
import { sendOrderConfirmation } from '@/lib/sendEmail';

// Definimos las interfaces necesarias
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
}

interface PaymentRecord {
  id: string;
  cart_items: CartItem[];
  total_price: number;
  status: string;
  payment_status: string;
  tracking_code?: string;
  updated_at: string;
}

export async function POST(request: NextRequest) {
  console.log('⚡ Webhook received');
  
  try {
    const body = await request.json();
    
    // Validación inicial del webhook
    if (!body?.data?.id) {
      console.warn('Invalid webhook payload received:', body);
      return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 });
    }

    if (body.type !== 'payment') {
      console.log(`Ignoring non-payment webhook of type: ${body.type}`);
      return NextResponse.json({ message: 'Non-payment webhook received' });
    }

    // Configuración de MP
    if (!process.env.MP_ACCESS_TOKEN) {
      throw new Error('MP_ACCESS_TOKEN is not configured');
    }

    const mercadopago = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN
    });

    // Obtener detalles del pago
    console.log(`📦 Fetching payment details for ID: ${body.data.id}`);
    const payment = await new Payment(mercadopago).get({ id: body.data.id });
    const orderId = payment.external_reference;

    if (!orderId) {
      throw new Error('Payment received without external_reference');
    }

    // Obtener registro de pago
    const { data: paymentRecord, error: recordError } = await supabase
      .from('payment_records')
      .select('*')
      .eq('id', orderId)
      .single();

    if (recordError || !paymentRecord) {
      console.error('Error fetching payment record:', recordError);
      return NextResponse.json({ error: 'Payment record not found' }, { status: 404 });
    }

    // Procesar según el estado del pago
    switch (payment.status) {
      case 'approved':
        await handleApprovedPayment(orderId, paymentRecord as PaymentRecord);
        break;
      case 'rejected':
        await handleRejectedPayment(orderId);
        break;
      case 'pending':
        await handlePendingPayment(orderId);
        break;
      default:
        console.log(`Payment status: ${payment.status} for order: ${orderId}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ 
      error: 'Webhook processing failed',
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}

async function handleApprovedPayment(orderId: string, paymentRecord: PaymentRecord) {
  console.log(`✅ Processing approved payment for order: ${orderId}`);
  
  const cartItems = paymentRecord.cart_items;
  const totalPrice = paymentRecord.total_price;

  // Get customer data from payment record
  const { data: customerData, error: customerError } = await supabase
    .from('payment_records')
    .select('customer_name, customer_email')
    .eq('id', orderId)
    .single();

  if (customerError || !customerData) {
    console.error('Failed to fetch customer data:', customerError);
    throw new Error('Customer data not found');
  }

  // Send confirmation email
  const emailResult = await sendOrderConfirmation(
    orderId,
    cartItems,
    totalPrice,
    {
      name: customerData.customer_name,
      email: customerData.customer_email
    }
  );

  if (!emailResult.success) {
    console.error('Failed to send confirmation email:', emailResult.error);
  }

  // Update stock
  try {
    for (const item of cartItems) {
      await updateProductStock(item);
    }
  } catch (error) {
    console.error('Stock update failed:', error);
    throw error;
  }

  // Update payment record
  const { error: updateError } = await supabase
    .from('payment_records')
    .update({
      status: 'success',
      tracking_code: generateTrackingCode(),
      payment_status: 'approved',
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId);

  if (updateError) {
    throw new Error(`Failed to update payment record: ${updateError.message}`);
  }
}

async function updateProductStock(item: CartItem) {
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

async function handleRejectedPayment(orderId: string) {
  console.log(`❌ Processing rejected payment for order: ${orderId}`);
  await supabase
    .from('payment_records')
    .update({
      status: 'failed',
      payment_status: 'rejected',
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId);
}

async function handlePendingPayment(orderId: string) {
  console.log(`⏳ Processing pending payment for order: ${orderId}`);
  await supabase
    .from('payment_records')
    .update({
      status: 'pending',
      payment_status: 'pending',
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId);
}