import { Resend } from 'resend';

// Only instantiate Resend if we have an API key, otherwise mock it for development
const apiKey = process.env.RESEND_API_KEY;

export const resend = apiKey ? new Resend(apiKey) : null;

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  if (!resend) {
    console.log("----------------------------------------");
    console.log("📧 MOCK EMAIL SENT (No RESEND_API_KEY found)");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log("----------------------------------------");
    return { success: true, mock: true };
  }

  try {
    const data = await resend.emails.send({
      from: 'Shopora <orders@shopora.com>', // Update this with verified domain
      to,
      subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
};
