import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { supabase } from "@/app/supabase";

const DISCOUNT_CODES = [
  "HastaElFinDeLosTiempos",
  "KeepCalmAndStayBusy",
  "DosAmigosUnaVision",
];

function getRandomDiscountCode(): string {
  const randomIndex = Math.floor(Math.random() * DISCOUNT_CODES.length);
  return DISCOUNT_CODES[randomIndex];
}

async function getClientIP(): Promise<string> {
  const headersList = await headers();
  const vercelForwardedFor = headersList.get("x-vercel-forwarded-for");
  if (vercelForwardedFor) return vercelForwardedFor;

  const forwardedFor = headersList.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();

  const realIP = headersList.get("x-real-ip");
  if (realIP) return realIP;

  return "unknown";
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const clientIP = await getClientIP();
    const discountCode = getRandomDiscountCode();

    if (!email) {
      return NextResponse.json(
        { error: "Email es requerido" },
        { status: 400 }
      );
    }

    // Verificar si el email ya existe
    const { data: existingLead, error: leadError } = await supabase
      .from("newsletter_leads")
      .select("id")
      .eq("email", email)
      .single();

    if (leadError && leadError.code !== "PGRST116") {
      console.error("Error checking existing lead:", leadError);
      return NextResponse.json(
        { error: "Error al verificar email" },
        { status: 500 }
      );
    }

    if (existingLead) {
      await supabase
        .from("newsletter_attempts")
        .insert([
          { ip_address: clientIP, email, created_at: new Date().toISOString() },
        ]);
      return NextResponse.json(
        {
          error: "exists",
          message: "Este email ya está suscrito a nuestra newsletter",
        },
        { status: 200 }
      );
    }

    // Crear nuevo lead con código de descuento
    const { error: insertLeadError } = await supabase
      .from("newsletter_leads")
      .insert([
        {
          email,
          created_at: new Date().toISOString(),
          discount_code: discountCode,
        },
      ]);

    if (insertLeadError) {
      console.error("Error inserting lead:", insertLeadError);
      return NextResponse.json(
        { error: "Error al guardar email" },
        { status: 500 }
      );
    }

    await supabase
      .from("newsletter_attempts")
      .insert([
        { ip_address: clientIP, email, created_at: new Date().toISOString() },
      ]);

    // Aquí deberías implementar el envío de email
    // Por ahora solo retornamos el código
    return NextResponse.json(
      {
        message: "success",
        discountCode: discountCode,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error general:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}