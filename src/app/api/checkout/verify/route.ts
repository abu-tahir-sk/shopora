import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import crypto from "crypto";
import { sendEmail } from "@/lib/resend";
import { OrderConfirmationEmail } from "@/emails/order-confirmation";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, orderId, isMock } = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET || "mock_secret";

    let isValid = false;

    // For mock testing or fallback, accept it
    if (isMock || (secret === "mock_secret" && razorpay_order_id?.startsWith("mock_rzp"))) {
      isValid = true;
    } else if (razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const generated_signature = crypto
        .createHmac("sha256", secret)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");
        
      if (generated_signature === razorpay_signature) {
        isValid = true;
      }
    }

    if (!isValid) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Update payment
    await db.payment.update({
      where: { orderId },
      data: {
        status: "PAID",
        razorpayId: razorpay_payment_id || `mock_pay_${Date.now()}`,
      },
    });

    // Update order
    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "PAID",
        orderStatus: "CONFIRMED",
      },
      include: {
        items: {
          include: { product: true }
        },
      },
    });

    // Reduce stock atomically
    await db.$transaction(async (tx) => {
      for (const item of updatedOrder.items) {
        if (item.variantId) {
          const variant = await tx.productVariant.findUnique({
            where: { id: item.variantId },
          });

          if (!variant || variant.stock < item.quantity) {
            throw new Error(`Insufficient stock for variant ID ${item.variantId}`);
          }

          const newStock = variant.stock - item.quantity;
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: newStock },
          });

          await tx.inventoryTransaction.create({
            data: {
              productId: item.productId,
              variantId: item.variantId,
              previousStock: variant.stock,
              changedAmount: -item.quantity,
              newStock,
              reason: `Order #${updatedOrder.orderNumber} Paid (Online)`,
              userId: session.user.id,
            },
          });
        } else {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
          });

          if (!product || product.stock < item.quantity) {
            throw new Error(`Insufficient stock for product ID ${item.productId}`);
          }

          const newStock = product.stock - item.quantity;
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: newStock },
          });

          await tx.inventoryTransaction.create({
            data: {
              productId: item.productId,
              previousStock: product.stock,
              changedAmount: -item.quantity,
              newStock,
              reason: `Order #${updatedOrder.orderNumber} Paid (Online)`,
              userId: session.user.id,
            },
          });
        }
      }

      // Increment coupon usedCount if a coupon was applied
      if (updatedOrder.couponCode) {
        await tx.coupon.update({
          where: { code: updatedOrder.couponCode },
          data: {
            usedCount: {
              increment: 1,
            },
          },
        });
      }
    });
    
    // Clear the cart in the database
    const userCart = await db.cart.findUnique({
      where: { userId: session.user.id },
    });
    if (userCart) {
      await db.cartItem.deleteMany({
        where: { cartId: userCart.id },
      });
    }

    // Send confirmation email
    if (session.user.email) {
      // Map items for the email template
      const emailItems = updatedOrder.items.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.price
      }));

      await sendEmail({
        to: session.user.email,
        subject: `Order Confirmation #${updatedOrder.orderNumber}`,
        html: OrderConfirmationEmail({
          customerName: session.user.name || "Customer",
          orderNumber: updatedOrder.orderNumber,
          total: updatedOrder.total,
          items: emailItems,
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
