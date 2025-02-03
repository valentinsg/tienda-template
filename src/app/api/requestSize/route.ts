// src/app/api/requestSize/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/app/supabase";
import { getRandomDiscountCode } from "@/app/utils/DiscountCode";
import { getClientIP } from "@/app/utils/ClientIp";

export async function POST(request: Request) {
  try {
    const { email, size, acceptPromotions } = await request.json();
    console.log("Datos recibidos:", { email, size, acceptPromotions });

    if (!email || !size) {
      return NextResponse.json(
        { error: "Email y tamaño son requeridos" },
        { status: 400 }
      );
    }

    const clientIP = await getClientIP();
    console.log("IP del cliente:", clientIP); // Log de depuración

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

    // Insertar el tamaño solicitado
    const { error: insertSizeError } = await supabase
      .from("requested_sizes")
      .insert([
        {
          email,
          size,
          created_at: new Date().toISOString(),
          ip_address: clientIP,
        },
      ]);

    if (insertSizeError) {
      console.error("Error inserting size request:", insertSizeError);
      return NextResponse.json(
        { error: "Error al guardar la solicitud de tamaño" },
        { status: 500 }
      );
    }

    if (acceptPromotions && !existingLead) {
      const discountCode = getRandomDiscountCode();
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
          { error: "Error al guardar email en la newsletter" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { message: "Solicitud de tamaño enviada correctamente" },
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