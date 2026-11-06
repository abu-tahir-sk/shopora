import { Resend } from "resend";
import nodemailer from "nodemailer";

// Resend setup
const resendApiKey = process.env.RESEND_API_KEY;
export const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Gmail / Custom SMTP setup
const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

// Only create transporter if real credentials (not placeholders) are provided
const isRealSmtp =
  smtpUser &&
  smtpPass &&
  !smtpUser.includes("your_email") &&
  !smtpPass.includes("your_16_digit");

const smtpTransporter = isRealSmtp
  ? nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })
  : null;

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  // 1. Priority: Gmail / Custom SMTP (if real credentials provided)
  if (smtpTransporter && smtpUser) {
    try {
      const fromAddress = process.env.EMAIL_FROM || `Shopora <${smtpUser}>`;
      const info = await smtpTransporter.sendMail({
        from: fromAddress,
        to,
        subject,
        html,
      });
      return { success: true, provider: "smtp", messageId: info.messageId };
    } catch (smtpError) {
      console.warn("SMTP Email failed, falling back to Resend:", smtpError);
    }
  }

  // 2. Secondary / Fallback: Resend API
  if (resend) {
    try {
      const fromAddress = process.env.EMAIL_FROM || "Shopora <onboarding@resend.dev>";
      const data = await resend.emails.send({
        from: fromAddress,
        to,
        subject,
        html,
      });
      return { success: true, provider: "resend", data };
    } catch (resendError) {
      console.warn("Resend Email Error:", resendError);
    }
  }

  // 3. Fallback: Mock logging for development
  console.log("----------------------------------------");
  console.log("📧 MOCK EMAIL DISPATCHED (Simulation mode)");
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log("----------------------------------------");
  return { success: true, mock: true };
};
