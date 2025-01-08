// app/api/newsletter/route.ts
import { supabase } from '../../supabase';
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

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const clientIP = await getClientIP();

    if (!email) {
      return NextResponse.json({ error: 'Email es requerido' }, { status: 400 });
    }

    const { data: existingAttempt, error: attemptError } = await supabase
      .from('newsletter_attempts')
      .select('id')
      .eq('ip_address', clientIP)
      .eq('email', email)
      .single();

    if (attemptError && attemptError.code !== 'PGRST116') {
      console.error('Error al verificar intentos:', attemptError);
      return NextResponse.json({ error: 'Error al verificar registro' }, { status: 500 });
    }

    if (existingAttempt) {
      return NextResponse.json(
        { error: 'exists', message: 'Ya intentaste registrar este email' },
        { status: 200 }
      );
    }

    const { data: existingEmail } = await supabase
      .from('newsletter_leads')
      .select('id')
      .eq('email', email)
      .single();

    if (existingEmail) {
      await supabase.from('newsletter_attempts').insert([
        { ip_address: clientIP, email, created_at: new Date().toISOString() }
      ]);

      return NextResponse.json(
        { error: 'exists', message: 'Email ya registrado' },
        { status: 200 }
      );
    }

    const { error: insertError } = await supabase
      .from('newsletter_leads')
      .insert([{ email, created_at: new Date().toISOString() }]);

    if (insertError) {
      console.error('Error al insertar email:', insertError);
      return NextResponse.json({ error: 'Error al guardar email' }, { status: 500 });
    }

    await supabase.from('newsletter_attempts').insert([
      { ip_address: clientIP, email, created_at: new Date().toISOString() }
    ]);

    return NextResponse.json({ message: 'success' }, { status: 200 });
  } catch (error) {
    console.error('Error general:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
