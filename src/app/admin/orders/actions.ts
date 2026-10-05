"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function updateOrderStatus(orderId: string, formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const orderStatus = formData.get("orderStatus") as any || formData.get("status") as any;

  await db.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) throw new Error("Order not found");

    // Check if we are transitioning to CANCELLED from a non-cancelled state
    if (orderStatus === "CANCELLED" && order.orderStatus !== "CANCELLED") {
      // Restore stock
      for (const item of order.items) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { increment: item.quantity } },
          });
        } else {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }
    }

    // Handle transitioning back from CANCELLED to a valid state
    if (order.orderStatus === "CANCELLED" && orderStatus !== "CANCELLED") {
      // Deduct stock again
      for (const item of order.items) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          });
        } else {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }
    }

    await tx.order.update({
      where: { id: orderId },
      data: { orderStatus },
    });
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  // Also revalidate user's order history
  revalidatePath("/account/orders");
}

export async function updatePaymentStatus(orderId: string, formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const paymentStatus = formData.get("paymentStatus") as any;

  await db.order.update({
    where: { id: orderId },
    data: { paymentStatus },
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/account/orders");
}
