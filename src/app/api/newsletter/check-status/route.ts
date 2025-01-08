// app/api/newsletter/route.ts
import { supabase } from '../../../supabase';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

async function getClientIP(): Promise<string> {
  const headersList = headers();
  const forwardedFor = (await headersList).get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIP = (await headersList).get('x-real-ip');
  return realIP || 'unknown';
}

export async function GET() {
  try {
    const clientIP = await getClientIP();

    const { data: existingAttempt, error: attemptError } = await supabase
      .from('newsletter_attempts')
      .select('email')
      .eq('ip_address', clientIP)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (attemptError && attemptError.code !== 'PGRST116') {
      console.error('Error al verificar intentos:', attemptError);
      return NextResponse.json({ error: 'Error al verificar registro' }, { status: 500 });
    }

    if (existingAttempt?.email) {
      const { data: existingLead } = await supabase
        .from('newsletter_leads')
        .select('id')
        .eq('email', existingAttempt.email)
        .single();

      return NextResponse.json({ isSubscribed: !!existingLead }, { status: 200 });
    }

    return NextResponse.json({ isSubscribed: false }, { status: 200 });
  } catch (error) {
    console.error('Error general:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
