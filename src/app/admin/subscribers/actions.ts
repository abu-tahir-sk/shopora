"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { sendEmailToAllSubscribers } from "@/lib/subscriber-notifications";

export async function deleteSubscriber(id: string) {
  try {
    await db.newsletterSubscriber.delete({
      where: { id },
    });
    revalidatePath("/admin/subscribers");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete subscriber:", error);
    return { success: false, error: "Failed to delete subscriber" };
  }
}

export async function sendCustomCampaign({
  subject,
  headline,
  message,
  ctaText,
  ctaUrl,
}: {
  subject: string;
  headline: string;
  message: string;
  ctaText?: string;
  ctaUrl?: string;
}) {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
    const targetUrl = ctaUrl?.startsWith("http") ? ctaUrl : `${appUrl}${ctaUrl || "/products"}`;

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 20px; background-color: #ffffff; color: #1a1a1a;">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="font-size: 20px; font-weight: 300; letter-spacing: 4px; text-transform: uppercase; color: #000;">SHOPORA</span>
          <div style="height: 1px; width: 40px; background: #000; margin: 12px auto 0;"></div>
        </div>

        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="font-size: 26px; font-weight: 300; letter-spacing: -0.5px; margin: 0 0 12px;">${headline}</h1>
        </div>

        <div style="font-size: 14px; color: #444; line-height: 1.7; padding: 0 16px; margin-bottom: 32px; white-space: pre-wrap;">
          ${message}
        </div>

        ${
          ctaText
            ? `
          <div style="text-align: center; margin: 32px 0;">
            <a href="${targetUrl}" style="background-color: #000000; color: #ffffff; padding: 14px 36px; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; text-decoration: none; font-weight: 500; display: inline-block;">
              ${ctaText}
            </a>
          </div>
        `
            : ""
        }

        <hr style="border: none; border-top: 1px solid #eeeeee; margin: 32px 0 20px;" />

        <div style="text-align: center; font-size: 11px; color: #888; line-height: 1.5;">
          <p>You received this email because you are subscribed to Shopora news and updates.</p>
          <p>© ${new Date().getFullYear()} Shopora. All rights reserved.</p>
        </div>
      </div>
    `;

    const res = await sendEmailToAllSubscribers({
      subject,
      html,
    });

    return res;
  } catch (error: any) {
    console.error("Failed to send campaign:", error);
    return { success: false, error: error.message || "Failed to send campaign" };
  }
}


