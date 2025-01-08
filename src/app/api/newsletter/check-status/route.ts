import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { supabase } from '@/app/supabase';

async function getClientIP(): Promise<string> {
  const headersList = await headers();
  
  // Check for Vercel-specific headers first
  const vercelForwardedFor = headersList.get('x-vercel-forwarded-for');
  if (vercelForwardedFor) {
    return vercelForwardedFor;
  }
  
  // Then check standard headers
  const forwardedFor = headersList.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIP = headersList.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

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