import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    // Validate input
    const { nombre, email, mensaje } = await req.json();
    if (!nombre || !email || !mensaje) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios' }, { status: 400 });
    }

    const zohoEmail = process.env.ZOHO_EMAIL;
    const zohoPassword = process.env.ZOHO_PASSWORD;
    const recipientEmail = process.env.RECIPIENT_EMAIL;

    if (!zohoEmail || !zohoPassword || !recipientEmail) {
      console.error('Configuración de email incompleta', {
        zohoEmailSet: !!zohoEmail,
        zohoPasswordSet: !!zohoPassword,
        recipientEmailSet: !!recipientEmail
      });
      return NextResponse.json({ 
        error: 'Error en la configuración del servidor de correo' 
      }, { status: 500 });
    }

    // Configure Zoho SMTP transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true,
      auth: {
        user: zohoEmail,
        pass: zohoPassword
      }
    });

    // Prepare email options
    const mailOptions = {
      from: zohoEmail,
      to: recipientEmail,
      subject: `Nuevo mensaje de contacto de ${nombre}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Nuevo Mensaje de Contacto</h2>
          <p><strong>Nombre:</strong> ${nombre}</p>
          <p><strong>Email de Contacto:</strong> ${email}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${mensaje}</p>
          <hr/>
          <small>Mensaje enviado desde el formulario de contacto de Busy Street Wear</small>
        </div>
      `,
      text: `Nuevo mensaje de ${nombre}\n\nEmail: ${email}\n\nMensaje: ${mensaje}`
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Mensaje enviado con éxito'
    });

  } catch (error) {
    console.error('Error completo en envío de email:', error);
    return NextResponse.json({
      error: 'Error al enviar el mensaje. Por favor, verifica tu conexión o intenta más tarde.'
    }, { status: 500 });
  }
}