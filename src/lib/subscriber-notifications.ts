import { db } from "@/lib/db";
import { sendEmail } from "@/lib/resend";

const getAppUrl = () => {
  return process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
};

/**
 * Send an email broadcast to all newsletter subscribers
 */
export async function sendEmailToAllSubscribers({
  subject,
  html,
}: {
  subject: string;
  html: string;
}) {
  try {
    const subscribers = await db.newsletterSubscriber.findMany({
      select: { email: true },
    });

    if (subscribers.length === 0) {
      return { success: true, count: 0, message: "No subscribers found." };
    }

    // Send emails in asynchronous batches to prevent timeout
    const emailPromises = subscribers.map((sub) =>
      sendEmail({
        to: sub.email,
        subject,
        html,
      })
    );

    await Promise.allSettled(emailPromises);

    return {
      success: true,
      count: subscribers.length,
      message: `Email broadcast sent to ${subscribers.length} subscriber(s).`,
    };
  } catch (error) {
    console.error("Failed to broadcast email to subscribers:", error);
    return { success: false, error: "Failed to broadcast email" };
  }
}

/**
 * Automatically notify all subscribers about a new product release
 */
export async function notifySubscribersAboutProduct(product: {
  name: string;
  price: number;
  comparePrice?: number | null;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
}) {
  const appUrl = getAppUrl();
  const productUrl = `${appUrl}/product/${product.slug}`;

  const discountBadge =
    product.comparePrice && product.comparePrice > product.price
      ? `<span style="background: #111; color: #fff; padding: 4px 8px; font-size: 11px; text-transform: uppercase; font-weight: bold; border-radius: 2px;">Special Launch Price</span>`
      : "";

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 20px; background-color: #ffffff; color: #1a1a1a;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 20px; font-weight: 300; letter-spacing: 4px; text-transform: uppercase; color: #000;">SHOPORA</span>
        <div style="height: 1px; width: 40px; background: #000; margin: 12px auto 0;"></div>
      </div>

      <div style="text-align: center; margin-bottom: 28px;">
        <span style="font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #666; display: block; margin-bottom: 8px;">New In Collection</span>
        <h1 style="font-size: 28px; font-weight: 300; letter-spacing: -0.5px; margin: 0 0 12px;">${product.name}</h1>
        ${discountBadge}
      </div>

      ${product.imageUrl
      ? `
        <div style="margin-bottom: 24px; text-align: center;">
          <a href="${productUrl}">
            <img src="${product.imageUrl}" alt="${product.name}" style="max-width: 100%; height: auto; max-height: 400px; object-fit: cover; border-radius: 4px;" />
          </a>
        </div>
      `
      : ""
    }

      <div style="text-align: center; margin-bottom: 32px; padding: 0 16px;">
        <div style="margin-bottom: 16px;">
          <span style="font-size: 22px; font-weight: 600; color: #111;">₹${product.price.toLocaleString("en-IN")}</span>
          ${product.comparePrice && product.comparePrice > product.price
      ? `<span style="font-size: 16px; text-decoration: line-through; color: #888; margin-left: 8px;">₹${product.comparePrice.toLocaleString("en-IN")}</span>`
      : ""
    }
        </div>

        ${product.description
      ? `<p style="font-size: 14px; color: #555; line-height: 1.6; max-width: 480px; margin: 0 auto 24px;">${product.description.slice(0, 180)}...</p>`
      : ""
    }

        <div>
          <a href="${productUrl}" style="background-color: #000000; color: #ffffff; padding: 14px 32px; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; text-decoration: none; font-weight: 500; display: inline-block;">
            Shop This Piece
          </a>
        </div>
      </div>

      <hr style="border: none; border-top: 1px solid #eeeeee; margin: 32px 0 20px;" />

      <div style="text-align: center; font-size: 11px; color: #888; line-height: 1.5;">
        <p>You received this exclusive update because you are subscribed to the Shopora newsletter.</p>
        <p>© ${new Date().getFullYear()} Shopora. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendEmailToAllSubscribers({
    subject: `✨ Just Dropped: ${product.name} is now available on Shopora`,
    html,
  });
}

/**
 * Automatically notify all subscribers about a new discount offer or coupon
 */
export async function notifySubscribersAboutOffer(coupon: {
  code: string;
  discountType: string;
  discountValue: number;
  minOrderAmount?: number | null;
  maxDiscount?: number | null;
  expiresAt?: Date | null;
}) {
  const appUrl = getAppUrl();
  const shopUrl = `${appUrl}/products`;

  const discountText =
    coupon.discountType === "PERCENTAGE"
      ? `${coupon.discountValue}% OFF`
      : coupon.discountType === "FIXED"
        ? `₹${coupon.discountValue} OFF`
        : "FREE SHIPPING";

  const expiryText = coupon.expiresAt
    ? `<p style="font-size: 12px; color: #e11d48; margin-top: 8px;">Expires on: <strong>${new Date(coupon.expiresAt).toLocaleDateString()}</strong></p>`
    : "";

  const minOrderText = coupon.minOrderAmount
    ? `<span style="font-size: 12px; color: #666; display: block; margin-top: 4px;">Valid on orders above ₹${coupon.minOrderAmount.toLocaleString("en-IN")}</span>`
    : "";

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 20px; background-color: #ffffff; color: #1a1a1a;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 20px; font-weight: 300; letter-spacing: 4px; text-transform: uppercase; color: #000;">SHOPORA</span>
        <div style="height: 1px; width: 40px; background: #000; margin: 12px auto 0;"></div>
      </div>

      <div style="text-align: center; margin-bottom: 28px;">
        <span style="font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #e11d48; font-weight: 600; display: block; margin-bottom: 8px;">Exclusive Subscriber Offer</span>
        <h1 style="font-size: 32px; font-weight: 300; letter-spacing: -0.5px; margin: 0 0 12px;">Enjoy ${discountText} on your next order</h1>
        <p style="font-size: 14px; color: #555; line-height: 1.6; max-width: 460px; margin: 0 auto;">
          As a valued subscriber, here is a special promotional voucher just for you. Use the code at checkout:
        </p>
      </div>

      <div style="background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 8px; padding: 24px; text-align: center; margin: 24px auto; max-width: 380px;">
        <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #64748b; font-weight: 600; display: block; margin-bottom: 8px;">Your Promo Code</span>
        <div style="font-size: 26px; font-family: monospace; font-weight: bold; letter-spacing: 3px; color: #0f172a; padding: 8px 16px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 4px; display: inline-block;">
          ${coupon.code}
        </div>
        ${minOrderText}
        ${expiryText}
      </div>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${shopUrl}" style="background-color: #000000; color: #ffffff; padding: 14px 36px; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; text-decoration: none; font-weight: 500; display: inline-block;">
          Redeem Offer & Shop
        </a>
      </div>

      <hr style="border: none; border-top: 1px solid #eeeeee; margin: 32px 0 20px;" />

      <div style="text-align: center; font-size: 11px; color: #888; line-height: 1.5;">
        <p>You received this exclusive discount code because you are subscribed to Shopora news and VIP offers.</p>
        <p>© ${new Date().getFullYear()} Shopora. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendEmailToAllSubscribers({
    subject: `🎁 Special Offer: Take ${discountText} with code ${coupon.code}`,
    html,
  });
}

