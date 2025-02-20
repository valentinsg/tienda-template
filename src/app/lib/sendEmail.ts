import { CartItem } from '@/types/CartItem';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendOrderConfirmation(orderId: string | undefined, cartItems: CartItem[], totalPrice: number) {
  const emailContent = `
    <h1>Nuevo pedido confirmado</h1>
    <p><strong>Order ID:</strong> ${orderId}</p>
    <p><strong>Total:</strong> $${totalPrice} ARS</p>
    <h2>Productos:</h2>
    <ul>
      ${cartItems.map(item => `<li>${item.name} (x${item.quantity}) - $${item.price} ARS</li>`).join('')}
    </ul>
  `;

  try {
    const response = await resend.emails.send({
      from: process.env.EMAIL_SENDER!,
      to: process.env.EMAIL_RECIPIENT!,
      subject: `🛍️ Nueva compra - Orden #${orderId}`,
      html: emailContent,
    });

    return response;
  } catch (error) {
    console.error('Error enviando el email:', error);
    return null;
  }
}
