import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmation } from '@/lib/sendEmail';
import { supabase } from '@/app/supabase';

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // Fetch payment record
    const { data: paymentRecord, error } = await supabase
      .from('payment_records')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error || !paymentRecord) {
      console.error('Error fetching payment record:', error);
      return NextResponse.json({ error: 'Payment record not found' }, { status: 404 });
    }

    // Send confirmation email
    const emailResult = await sendOrderConfirmation(
      orderId,
      paymentRecord.cart_items,
      paymentRecord.total_price,
      {
        name: paymentRecord.customer_name,
        email: paymentRecord.customer_email
      }
    );

    if (!emailResult.success) {
      return NextResponse.json({ error: emailResult.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending confirmation:', error);
    return NextResponse.json({ 
      error: 'Failed to send confirmation',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
