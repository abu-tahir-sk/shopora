import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/resend";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "No account found registered with this email address." },
        { status: 404 }
      );
    }

    // Generate secure token valid for 1 hour
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await db.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: expires,
      },
    });

    const appUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetUrl = `${appUrl}/reset-password?token=${token}`;

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 36px 24px; background-color: #ffffff; color: #1a1a1a;">
        <div style="text-align: center; margin-bottom: 28px;">
          <span style="font-size: 22px; font-weight: 300; letter-spacing: 4px; text-transform: uppercase; color: #000;">SHOPORA</span>
          <div style="height: 1px; width: 40px; background: #000; margin: 12px auto 0;"></div>
        </div>

        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="font-size: 24px; font-weight: 400; letter-spacing: -0.5px; margin: 0 0 12px;">Reset Your Password</h1>
          <p style="font-size: 14px; color: #555; line-height: 1.6; max-width: 480px; margin: 0 auto;">
            Hello ${user.name || "there"},<br/>
            We received a request to reset the password for your Shopora account. Click the button below to choose a new password:
          </p>
        </div>

        <div style="text-align: center; margin: 36px 0;">
          <a href="${resetUrl}" style="background-color: #000000; color: #ffffff; padding: 14px 36px; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; text-decoration: none; font-weight: 500; display: inline-block;">
            Reset Password
          </a>
        </div>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px; margin-bottom: 24px; text-align: center;">
          <span style="font-size: 12px; color: #64748b;">
            This link is valid for <strong>1 hour</strong>. If the button doesn't work, copy and paste this link into your browser:
          </span>
          <div style="margin-top: 6px; word-break: break-all; font-size: 11px; font-family: monospace; color: #0f172a;">
            ${resetUrl}
          </div>
        </div>

        <hr style="border: none; border-top: 1px solid #eeeeee; margin: 28px 0 16px;" />

        <div style="text-align: center; font-size: 11px; color: #888; line-height: 1.5;">
          <p>If you did not request this password reset, please ignore this email. Your password will remain unchanged.</p>
          <p>© ${new Date().getFullYear()} Shopora. All rights reserved.</p>
        </div>
      </div>
    `;

    const emailRes = await sendEmail({
      to: normalizedEmail,
      subject: "🔒 Reset Your Shopora Password",
      html,
    });

    if (!emailRes.success && !emailRes.mock) {
      console.error("Failed to send password reset email:", "error" in emailRes ? emailRes.error : "Unknown error");
      return NextResponse.json(
        { error: "Failed to dispatch email. Please check your email configuration." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Password reset link has been dispatched to ${normalizedEmail}. Please check your inbox!`,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
