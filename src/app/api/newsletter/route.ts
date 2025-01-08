// app/api/newsletter/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Función para obtener la IP real del cliente
async function getClientIP(): Promise<string> {
  const headersList = await headers();
  
  // Intentar obtener la IP real si está detrás de un proxy
  const forwardedFor = headersList.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  // Intentar obtener la IP directa
  const realIP = headersList.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  // Si no se puede obtener la IP, usar un valor por defecto
  return 'unknown';
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const clientIP = await getClientIP();

    if (!email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      );
    }

    // Verificar si esta IP ya registró este email
    const { data: existingAttempt, error: attemptError } = await supabase
      .from('newsletter_attempts')
      .select('id')
      .eq('ip_address', clientIP)
      .eq('email', email)
      .single();

    if (attemptError && attemptError.code !== 'PGRST116') {
      console.error('Error al verificar intentos:', attemptError);
      return NextResponse.json(
        { error: 'Error al verificar registro' },
        { status: 500 }
      );
    }

    if (existingAttempt) {
      return NextResponse.json(
        { error: 'exists', message: 'Ya intentaste registrar este email' },
        { status: 200 }
      );
    }

    // Verificar si el email ya existe en newsletter_leads
    const { data: existingEmail } = await supabase
      .from('newsletter_leads')
      .select('id')
      .eq('email', email)
      .single();

    if (existingEmail) {
      // Registrar el intento incluso si el email ya existe
      await supabase.from('newsletter_attempts').insert([
        {
          ip_address: clientIP,
          email,
          created_at: new Date().toISOString()
        }
      ]);

      return NextResponse.json(
        { error: 'exists', message: 'Email ya registrado' },
        { status: 200 }
      );
    }

    // Iniciar una transacción para insertar tanto el email como el intento
    const { error: insertError } = await supabase
      .from('newsletter_leads')
      .insert([
        {
          email,
          created_at: new Date().toISOString()
        }
      ]);

    if (insertError) {
      console.error('Error al insertar email:', insertError);
      return NextResponse.json(
        { error: 'Error al guardar email' },
        { status: 500 }
      );
    }

    // Registrar el intento exitoso
    await supabase.from('newsletter_attempts').insert([
      {
        ip_address: clientIP,
        email,
        created_at: new Date().toISOString()
      }
    ]);

    return NextResponse.json(
      { message: 'success' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error general:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}