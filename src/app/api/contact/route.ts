import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { sendEmail } from "@/lib/resend";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  orderNumber: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(5, "Message must be at least 5 characters").trim(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { name, email, orderNumber, subject, message } = parsed.data;

    // Save to database
    const contactMessage = await db.contactMessage.create({
      data: {
        name,
        email,
        orderNumber: orderNumber || null,
        subject: subject || null,
        message,
        status: "UNREAD",
      },
    });

    // Optionally notify store admin or send confirmation to customer
    try {
      await sendEmail({
        to: email,
        subject: `We've received your message: ${subject || "Support Inquiry"}`,
        html: `
          <div style="font-family: sans-serif; padding: 24px; color: #111;">
            <h2>Hello ${name},</h2>
            <p>Thank you for reaching out to Shopora customer care.</p>
            <p>We have logged your inquiry (Reference ID: <strong>#${contactMessage.id.slice(-6).toUpperCase()}</strong>) and our team will get back to you within 24 hours.</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
            <p><strong>Your message:</strong></p>
            <blockquote style="background: #f9f9f9; padding: 12px 16px; border-left: 3px solid #111; margin: 0;">
              ${message.replace(/\n/g, "<br>")}
            </blockquote>
          </div>
        `,
      });
    } catch (mailErr) {
      console.warn("Contact receipt email failed to send:", mailErr);
    }

    return NextResponse.json(
      { success: true, message: "Your message has been sent to our concierge team." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact message submission error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const messages = await db.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Failed to fetch contact messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact messages" },
      { status: 500 }
    );
  }
}

