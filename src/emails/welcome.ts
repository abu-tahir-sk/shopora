export const WelcomeEmail = ({ customerName }: { customerName: string }) => {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9f9f9; padding: 40px 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); text-align: center;">
          
          <h1 style="margin-top: 0; font-size: 24px; font-weight: 300; letter-spacing: 1px; color: #111;">SHOPORA</h1>
          <h2 style="font-size: 20px; font-weight: 500; color: #111; margin-top: 32px;">Welcome to Shopora, ${customerName}!</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.5; margin: 24px 0;">
            We're thrilled to have you here. Discover our premium collection of thoughtfully designed pieces that balance form and function.
          </p>
          
          <div style="margin-top: 40px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/products" style="display: inline-block; background-color: #111; color: #fff; padding: 14px 28px; text-decoration: none; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Start Shopping</a>
          </div>
          
          <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 40px 0 20px 0;" />
          <p style="color: #999; font-size: 12px; margin: 0;">If you have any questions, reply to this email or contact our support team.</p>
        </div>
      </body>
    </html>
  `;
};
