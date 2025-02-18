import axios from 'axios';
import { PaymentRecord } from '../../../types/checkout/payment/PaymentRecord';

async function sendPaymentConfirmationEmail(
  paymentRecord: PaymentRecord,
  paymentStatus: string,
  paymentId: string
) {
  try {
    const totalAmount = paymentRecord.cart_items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Generar el listado de productos HTML
    const itemsList = paymentRecord.cart_items
      .map(
        (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          ${item.name}
          ${item.productCode ? `<br><small>Código: ${item.productCode}</small>` : ''}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${
          item.size || 'N/A'
        }</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">$${item.price}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${
          item.quantity
        }</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">$${
          item.price * item.quantity
        }</td>
      </tr>
    `
      )
      .join('');

    const statusMessage =
      paymentStatus === 'approved'
        ? '¡Tu pago ha sido aprobado!'
        : 'Ha habido un problema con tu pago';

    const statusColor = paymentStatus === 'approved' ? '#28a745' : '#dc3545';

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: ${statusColor}; text-align: center;">${statusMessage}</h1>
        <p style="text-align: center;">ID de Pago: ${paymentId}</p>
        <p style="text-align: center;">Número de orden: ${paymentRecord.id}</p>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
          <h3 style="margin-top: 0;">Información del cliente:</h3>
          <p>Nombre: ${paymentRecord.customer_name}</p>
          <p>Email: ${paymentRecord.customer_email}</p>
          <p>Teléfono: ${paymentRecord.customer_phone}</p>
        </div>

        <h2>Detalles del pedido:</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f8f8f8;">
              <th style="padding: 10px; text-align: left;">Producto</th>
              <th style="padding: 10px; text-align: left;">Talle</th>
              <th style="padding: 10px; text-align: left;">Precio</th>
              <th style="padding: 10px; text-align: left;">Cantidad</th>
              <th style="padding: 10px; text-align: left;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4" style="padding: 10px; text-align: right;"><strong>Total:</strong></td>
              <td style="padding: 10px;"><strong>$${totalAmount}</strong></td>
            </tr>
          </tfoot>
        </table>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
          <h3 style="margin-top: 0;">Dirección de envío:</h3>
          <p>
            ${paymentRecord.shipping_address.address}<br>
            ${paymentRecord.shipping_address.city}, ${
      paymentRecord.shipping_address.province
    }<br>
            ${paymentRecord.shipping_address.postal_code}<br>
            ${paymentRecord.shipping_address.country}
          </p>
          <p>Método de envío: ${
            paymentRecord.shipping_method === 'home'
              ? 'Envío a domicilio'
              : 'Retiro en sucursal'
          }</p>
          ${
            paymentRecord.tracking_code
              ? `<p>Código de seguimiento: ${paymentRecord.tracking_code}</p>`
              : ''
          }
        </div>

        ${
          paymentStatus === 'approved'
            ? `
          <div style="margin-top: 20px; text-align: center; color: #28a745;">
            <h3>¡Gracias por tu compra!</h3>
            <p>Recibirás actualizaciones sobre el estado de tu envío.</p>
          </div>
        `
            : `
          <div style="margin-top: 20px; text-align: center; color: #dc3545;">
            <h3>Estado del pago: ${paymentStatus}</h3>
            <p>Por favor, contacta con nuestro servicio de atención al cliente si tienes alguna pregunta.</p>
          </div>
        `
        }
      </div>
    `;

    // Enviar el email usando Sender
    await axios.post(
      'https://api.sender.net/v2/emails',
      {
        to: [paymentRecord.customer_email],
        subject: `Estado de tu compra - Orden #${paymentRecord.id}`,
        html_body: emailHtml,
        from_name: 'BUSY STORE',
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.SENDER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return true;
  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
    return false;
  }
}

export { sendPaymentConfirmationEmail };