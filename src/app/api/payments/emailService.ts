// app/services/emailService.ts
import nodemailer from 'nodemailer';
import { PaymentRecord } from '../../../types/checkout/payment/PaymentRecord';

// Configuración del transportador de correo
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.ZOHO_EMAIL,
    pass: process.env.ZOHO_PASSWORD,
  },
});

// Función para generar el HTML del correo de confirmación
const generateOrderConfirmationHTML = (order: PaymentRecord) => {
  const itemsList = order.cart_items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width: 50px; height: auto;">` : ''}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} ${item.size ? `(Talle: ${item.size})` : ''} ${item.color ? `(Color: ${item.color})` : ''}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Confirmación de Compra - BUSY</title>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background-color: #000; padding: 20px; text-align: center; }
        .logo { max-width: 150px; }
        .container { padding: 20px; }
        .footer { background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; }
        h1 { color: #000; }
        table { width: 100%; border-collapse: collapse; }
        th { background-color: #f4f4f4; padding: 10px; text-align: left; }
        .total { font-weight: bold; font-size: 18px; text-align: right; padding: 10px; }
        .shipping-info { margin-top: 30px; background-color: #f9f9f9; padding: 15px; border-radius: 5px; }
        .tracking-code { background-color: #000; color: #fff; padding: 10px; text-align: center; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <img src="https://www.busy.com.ar/logo.png" alt="BUSY Logo" class="logo">
      </div>
      
      <div class="container">
        <h1>¡Gracias por tu compra!</h1>
        <p>Hola ${order.customer_name},</p>
        <p>Tu pedido ha sido confirmado y está siendo procesado. A continuación, encontrarás los detalles de tu compra:</p>
        
        <div>
          <h2>Detalles del Pedido</h2>
          <p><strong>Número de Pedido:</strong> ${order.id}</p>
          <p><strong>Fecha:</strong> ${new Date(order.created_at).toLocaleDateString('es-AR')}</p>
          <p><strong>Estado del Pago:</strong> Aprobado</p>
          
          ${order.tracking_code ? `
          <div class="tracking-code">
            <p><strong>Código de Seguimiento:</strong> ${order.tracking_code}</p>
          </div>
          ` : ''}
          
          <h3>Productos:</h3>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Producto</th>
                <th style="text-align: center;">Cantidad</th>
                <th style="text-align: right;">Precio Unitario</th>
                <th style="text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4" class="total">Total:</td>
                <td class="total">$${order.total_amount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          
          <div class="shipping-info">
            <h3>Información de Envío</h3>
            <p><strong>Método de Envío:</strong> ${order.shipping_method === 'home' ? 'Envío a domicilio' : 'Retiro en sucursal'}</p>
            <p><strong>Dirección de Envío:</strong><br>
            ${order.shipping_address.address}<br>
            ${order.shipping_address.city}, ${order.shipping_address.province}<br>
            ${order.shipping_address.postal_code}<br>
            ${order.shipping_address.country}</p>
          </div>
        </div>
        
        <p>Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos a <a href="mailto:contacto@busy.com.ar">contacto@busy.com.ar</a>.</p>
        
        <p>¡Gracias por confiar en BUSY!</p>
      </div>
      
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} BUSY. Todos los derechos reservados.</p>
        <p>
          <a href="https://www.busy.com.ar/terms">Términos y Condiciones</a> |
          <a href="https://www.busy.com.ar/privacy">Política de Privacidad</a>
        </p>
      </div>
    </body>
    </html>
  `;
};

// Función principal para enviar el correo de confirmación de compra
export async function sendOrderConfirmationEmail(order: PaymentRecord) {
  try {
    const mailOptions = {
      from: `"BUSY Store" <${process.env.ZOHO_EMAIL}>`,
      to: order.customer_email,
      cc: process.env.RECIPIENT_EMAIL,
      subject: `Confirmación de Compra - Pedido #${order.id}`,
      html: generateOrderConfirmationHTML(order),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error al enviar el email de confirmación:', error);
    return { success: false, error };
  }
}