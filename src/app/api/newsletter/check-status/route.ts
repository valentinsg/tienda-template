import { NextResponse } from 'next/server';
import { getClientIP } from '@/app/utils/ClientIp';
import { supabase } from '@/app/supabase';


export async function GET() {
  try {
    const clientIP = await getClientIP();
    console.log('Checking subscription status for IP:', clientIP);

    // First check newsletter_leads for successful subscriptions
    const { data: existingLead, error: leadError } = await supabase
      .from('newsletter_leads')
      .select('email')
      .eq('email', (
        await supabase
          .from('newsletter_attempts')
          .select('email')
          .eq('ip_address', clientIP)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()
      )?.data?.email)
      .single();

    if (leadError && leadError.code !== 'PGRST116') {
      console.error('Error checking newsletter_leads:', leadError);
      return NextResponse.json(
        { error: 'Error al verificar suscripción' },
        { status: 500 }
      );
    }

    // If we found a lead, the user is subscribed
    if (existingLead) {
      return NextResponse.json({ isSubscribed: true }, { status: 200 });
    }

    // If no lead was found, user is not subscribed
    return NextResponse.json({ isSubscribed: false }, { status: 200 });
  } catch (error) {
    console.error('Error general:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}