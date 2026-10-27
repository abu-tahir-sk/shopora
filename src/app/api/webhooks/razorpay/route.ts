import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/resend";
import { OrderConfirmationEmail } from "@/emails/order-confirmation";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET || "mock_secret";

    // 1. Verify webhook signature if secret is present
    if (signature && webhookSecret !== "mock_secret") {
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");

      if (expectedSignature !== signature) {
        console.error("Razorpay webhook signature mismatch");
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    console.log(`Received Razorpay webhook event: ${event}`);

    // 2. Handle Payment Captured / Order Paid
    if (event === "payment.captured" || event === "order.paid") {
      const paymentEntity = payload.payload?.payment?.entity;
      const razorpayOrderId = paymentEntity?.order_id;
      const razorpayPaymentId = paymentEntity?.id;
      const notesOrderId = paymentEntity?.notes?.orderId;

      // Find the associated order
      let order = null;
      if (notesOrderId) {
        order = await db.order.findUnique({
          where: { id: notesOrderId },
          include: { items: { include: { product: true } }, user: true, address: true },
        });
      } else if (razorpayOrderId) {
        const paymentRecord = await db.payment.findFirst({
          where: { razorpayId: razorpayOrderId },
          include: { order: { include: { items: { include: { product: true } }, user: true, address: true } } },
        });
        order = paymentRecord?.order;
      }

      if (order && order.paymentStatus !== "PAID") {
        // Update payment and order status
        await db.payment.updateMany({
          where: { orderId: order.id },
          data: {
            status: "PAID",
            razorpayId: razorpayPaymentId || razorpayOrderId,
            paymentMethod: paymentEntity?.method || "ONLINE",
          },
        });

        const updatedOrder = await db.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: "PAID",
            orderStatus: "CONFIRMED",
          },
          include: {
            items: { include: { product: true } },
            user: true,
            address: true,
          },
        });

        // Decrement stock and log inventory transactions
        await db.$transaction(async (tx) => {
          for (const item of updatedOrder.items) {
            if (item.variantId) {
              const currentVariant = await tx.productVariant.findUnique({
                where: { id: item.variantId },
              });
              if (currentVariant) {
                const newStock = Math.max(0, currentVariant.stock - item.quantity);
                await tx.productVariant.update({
                  where: { id: item.variantId },
                  data: { stock: newStock },
                });
                await tx.inventoryTransaction.create({
                  data: {
                    productId: item.productId,
                    variantId: item.variantId,
                    previousStock: currentVariant.stock,
                    changedAmount: -item.quantity,
                    newStock,
                    reason: `Order #${updatedOrder.orderNumber} Webhook Paid`,
                    userId: updatedOrder.userId,
                  },
                });
              }
            } else {
              const currentProduct = await tx.product.findUnique({
                where: { id: item.productId },
              });
              if (currentProduct) {
                const newStock = Math.max(0, currentProduct.stock - item.quantity);
                await tx.product.update({
                  where: { id: item.productId },
                  data: { stock: newStock },
                });
                await tx.inventoryTransaction.create({
                  data: {
                    productId: item.productId,
                    previousStock: currentProduct.stock,
                    changedAmount: -item.quantity,
                    newStock,
                    reason: `Order #${updatedOrder.orderNumber} Webhook Paid`,
                    userId: updatedOrder.userId,
                  },
                });
              }
            }
          }

          if (updatedOrder.couponCode) {
            await tx.coupon.update({
              where: { code: updatedOrder.couponCode },
              data: { usedCount: { increment: 1 } },
            }).catch(() => {});
          }
        });

        // Send order confirmation email asynchronously
        if (updatedOrder.user?.email) {
          try {
            await sendEmail({
              to: updatedOrder.user.email,
              subject: `Order Confirmed #${updatedOrder.orderNumber} - Shopora`,
              html: OrderConfirmationEmail({
                customerName: updatedOrder.user?.name || "Customer",
                orderNumber: updatedOrder.orderNumber,
                total: updatedOrder.total,
                items: updatedOrder.items.map((i) => ({
                  name: i.product.name,
                  quantity: i.quantity,
                  price: i.price,
                })),
              }),
            });
          } catch (e) {
            console.error("Failed to send webhook confirmation email:", e);
          }
        }
      }
    } else if (event === "payment.failed") {
      const paymentEntity = payload.payload?.payment?.entity;
      const notesOrderId = paymentEntity?.notes?.orderId;

      if (notesOrderId) {
        await db.payment.updateMany({
          where: { orderId: notesOrderId },
          data: { status: "FAILED" },
        });
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Razorpay webhook handler error:", error);
    return NextResponse.json({ error: "Webhook processing error" }, { status: 500 });
  }
}
