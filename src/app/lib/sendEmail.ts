import { CartItem } from '@/types/CartItem';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

interface EmailResponse {
  success: boolean;
  error?: string;
}

export async function sendOrderConfirmation(
  orderId: string | undefined, 
  cartItems: CartItem[], 
  totalPrice: number
): Promise<EmailResponse> {
  if (!orderId) {
    return { success: false, error: 'Order ID is required' };
  }

  if (!cartItems.length) {
    return { success: false, error: 'Cart items are required' };
  }

  const emailContent = `
    <html>
      <body style="font-family: Arial, sans-serif;">
        <h1 style="color: #333;">Nuevo pedido confirmado</h1>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Total:</strong> $${totalPrice.toLocaleString('es-AR')} ARS</p>
        <h2>Productos:</h2>
        <ul>
          ${cartItems.map(item => `
            <li style="margin-bottom: 10px;">
              ${item.name} (x${item.quantity}) - $${item.price.toLocaleString('es-AR')} ARS
            </li>
          `).join('')}
        </ul>
      </body>
    </html>
  `;

  try {
    if (!process.env.EMAIL_SENDER || !process.env.EMAIL_RECIPIENT) {
      throw new Error('Email configuration is missing');
    }

    await resend.emails.send({
      from: process.env.EMAIL_SENDER,
      to: process.env.EMAIL_RECIPIENT,
      subject: `🛍️ Nueva compra - Orden #${orderId}`,
      html: emailContent,
    });

    return { success: true };
  } catch (error) {
    console.error('Error enviando el email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}