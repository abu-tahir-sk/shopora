export const OrderConfirmationEmail = ({
  customerName,
  orderNumber,
  total,
  items,
}: {
  customerName: string;
  orderNumber: string;
  total: number;
  items: { name: string; quantity: number; price: number }[];
}) => {
  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea;">
          <p style="margin: 0; font-size: 14px;">${item.name}</p>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; text-align: center;">
          <p style="margin: 0; font-size: 14px;">x${item.quantity}</p>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; text-align: right;">
          <p style="margin: 0; font-size: 14px;">₹${item.price.toLocaleString("en-IN")}</p>
        </td>
      </tr>
    `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9f9f9; padding: 40px 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          
          <h1 style="margin-top: 0; font-size: 24px; font-weight: 300; letter-spacing: 1px; color: #111;">SHOPORA</h1>
          <p style="color: #666; font-size: 16px;">Hi ${customerName},</p>
          <p style="color: #666; font-size: 16px;">Thank you for your order! We've received your order and are currently processing it. Here are the details:</p>
          
          <div style="background-color: #fafafa; padding: 20px; border-radius: 4px; margin: 24px 0;">
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Order Number</p>
            <p style="margin: 0; font-size: 18px; font-weight: 500;">#${orderNumber}</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <thead>
              <tr>
                <th style="padding-bottom: 12px; border-bottom: 2px solid #eaeaea; text-align: left; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Item</th>
                <th style="padding-bottom: 12px; border-bottom: 2px solid #eaeaea; text-align: center; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Qty</th>
                <th style="padding-bottom: 12px; border-bottom: 2px solid #eaeaea; text-align: right; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding-top: 24px; text-align: left; font-weight: 500;">Total</td>
                <td style="padding-top: 24px; text-align: right; font-weight: 500;">₹${total.toLocaleString("en-IN")}</td>
              </tr>
            </tfoot>
          </table>

          <div style="text-align: center; margin-top: 40px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/order/${orderNumber}" style="display: inline-block; background-color: #111; color: #fff; padding: 12px 24px; text-decoration: none; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">View Order Status</a>
          </div>
          
          <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 40px 0 20px 0;" />
          <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">If you have any questions, reply to this email or contact our support team.</p>
        </div>
      </body>
    </html>
  `;
};
