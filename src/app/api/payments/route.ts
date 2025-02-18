import { PaymentRecord } from '@/types/checkout/payment/PaymentRecord';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.ZOHO_EMAIL,
    pass: process.env.ZOHO_PASSWORD,
  },
});

async function sendPaymentConfirmationEmail(
  paymentRecord: PaymentRecord,
  paymentStatus: string,
) {
  try {
    // Generate email content as before
    const totalAmount = paymentRecord.cart_items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Generate HTML content as you were doing before
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
        <!-- Rest of your email HTML -->
      </div>
    `;
    
    // Send using Zoho
    const result = await transporter.sendMail({
      from: `"BUSY STORE" <${process.env.ZOHO_EMAIL}>`,
      to: paymentRecord.customer_email,
      subject: `Estado de tu compra - Orden #${paymentRecord.id}`,
      html: emailHtml,
    });
    
    console.log('Email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Error sending email with Zoho:', error);
    return false;
  }
}

export { sendPaymentConfirmationEmail };