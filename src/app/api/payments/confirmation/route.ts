// app/api/payment/confirmation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../supabase';
import { sendOrderConfirmationEmail } from '../emailService';

export async function GET(request: NextRequest) {
  try {
    // Obtener el order_id de los parámetros de consulta
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get('order');
    
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }
    
    // Verificar si el pedido existe y está confirmado
    const { data: paymentRecord, error: recordError } = await supabase
      .from('payment_records')
      .select('*')
      .eq('id', orderId)
      .single();
    
    if (recordError || !paymentRecord) {
      console.error('Error fetching payment record:', recordError);
      return NextResponse.json({ error: 'Payment record not found' }, { status: 404 });
    }
    
    // Verificar si el pago fue exitoso antes de enviar el email
    if (paymentRecord.status === 'success') {
      // Enviar el email de confirmación
      const emailResult = await sendOrderConfirmationEmail(paymentRecord);
      
      if (emailResult.success) {
        return NextResponse.json({ 
          success: true, 
          message: 'Confirmation email sent successfully',
          messageId: emailResult.messageId
        });
      } else {
        console.error('Failed to send confirmation email:', emailResult.error);
        return NextResponse.json({ 
          success: false, 
          error: 'Failed to send confirmation email' 
        }, { status: 500 });
      }
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Payment not confirmed yet or failed', 
        status: paymentRecord.status 
      });
    }
    
  } catch (error) {
    console.error('Email confirmation error:', error);
    return NextResponse.json({ 
      error: 'Failed to process confirmation email',
      details: error instanceof Error ? error.message : 'Unknown error occurred',
    }, { status: 500 });
  }
}