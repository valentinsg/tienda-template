import { CartItem } from "@/types/CartItem";
import { Resend } from "resend";

interface CustomerInfo {
  email: string;
  name: string;
}

interface EmailResponse {
  success: boolean;
  error?: string;
}

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendOrderConfirmation(
  orderId: string,
  cartItems: CartItem[],
  totalPrice: number,
  customer: CustomerInfo
): Promise<EmailResponse> {
  // Validaciones
  if (!orderId) return { success: false, error: "Order ID is required" };
  if (!cartItems.length) return { success: false, error: "Cart items are required" };
  if (!customer.email) return { success: false, error: "Customer email is required" };
  const formattedTotalPrice = (typeof totalPrice === "number" ? totalPrice : 0).toLocaleString("es-AR");

  const emailContent = `
    <h1>¡Gracias por tu compra, ${customer.name}!</h1>
    <p><strong>Número de orden:</strong> ${orderId}</p>
    <p><strong>Total:</strong> $${formattedTotalPrice} ARS</p>
    <h2>Detalle de productos:</h2>
    <ul>
      ${cartItems
        .map((item) => {
          const formattedPrice = (typeof item.price === "number" ? item.price : 0).toLocaleString("es-AR");
          return `<li>${item.name} (x${item.quantity}) - $${formattedPrice} ARS</li>`;
        })
        .join("")}
    </ul>
    <p>Te mantendremos informado sobre el estado de tu pedido.</p>
    <p>Saludos,<br>El equipo de Busy</p>
  `;

  try {
    if (!process.env.EMAIL_SENDER) throw new Error("Email sender configuration is missing");

    // Enviar correo al cliente
    await resend.emails.send({
      from: process.env.EMAIL_SENDER,
      to: customer.email, // Corregido para asegurarse de que se envíe al cliente
      subject: `🛍️ Confirmación de compra - Orden #${orderId}`,
      html: emailContent,
    });

    // Notificar al administrador si está configurado
    if (process.env.EMAIL_RECIPIENT) {
      await resend.emails.send({
        from: process.env.EMAIL_SENDER,
        to: process.env.EMAIL_RECIPIENT,
        subject: `🛍️ Nueva venta - Orden #${orderId}`,
        html: `<p>Se ha realizado una nueva compra.</p>` + emailContent,
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error enviando el email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
