import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { sendEmail } from "@/lib/resend";

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address").toLowerCase().trim(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = newsletterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid email" },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    // Check if already subscribed
    const existing = await db.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { success: true, message: "You are already subscribed to our newsletter!" },
        { status: 200 }
      );
    }

    // Save to database
    const subscriber = await db.newsletterSubscriber.create({
      data: { email },
    });

    // Optionally send welcome email (doesn't fail the request if mail fails)
    try {
      await sendEmail({
        to: email,
        subject: "Welcome to Shopora - You're on the list!",
        html: `
          <div style="font-family: sans-serif; padding: 24px; color: #111;">
            <h1 style="letter-spacing: -1px; text-transform: uppercase;">Welcome to Shopora</h1>
            <p>Thank you for subscribing to our newsletter.</p>
            <p>You'll now be the first to know about new arrivals, seasonal collections, and exclusive private sales.</p>
            <br />
            <p>Best regards,<br />The Shopora Team</p>
          </div>
        `,
      });
    } catch (mailErr) {
      console.warn("Newsletter welcome email sending failed:", mailErr);
    }

    return NextResponse.json(
      { success: true, message: "Thank you for subscribing! Check your inbox for updates." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Failed to process subscription. Please try again later." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const subscribers = await db.newsletterSubscriber.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ subscribers });
  } catch (error) {
    console.error("Failed to fetch subscribers:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscribers" },
      { status: 500 }
    );
  }
}

