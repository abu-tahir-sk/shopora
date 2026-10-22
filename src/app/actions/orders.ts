"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function cancelOrderAction(orderId: string, reason?: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Please log in to manage your order." };
    }

    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
      },
    });

    if (!order) {
      return { error: "Order not found." };
    }

    // Only owner or admin can cancel
    if (order.userId !== session.user.id && session.user.role !== "ADMIN") {
      return { error: "Unauthorized to cancel this order." };
    }

    // Only PENDING or CONFIRMED orders can be cancelled by customer
    const cancellableStatuses = ["PENDING", "CONFIRMED"];
    if (!cancellableStatuses.includes(order.orderStatus)) {
      return {
        error: `Cannot cancel an order that is already ${order.orderStatus.toLowerCase()}. Please contact concierge support.`,
      };
    }

    // Execute cancellation & stock restoration in a transaction
    await db.$transaction(async (tx) => {
      // 1. Update order status
      await tx.order.update({
        where: { id: orderId },
        data: {
          orderStatus: "CANCELLED",
          paymentStatus: order.paymentStatus === "PAID" ? "REFUNDED" : order.paymentStatus,
        },
      });

      // 2. Restore stock for each order item
      for (const item of order.items) {
        if (item.variantId) {
          const currentVariant = await tx.productVariant.findUnique({
            where: { id: item.variantId },
          });

          if (currentVariant) {
            const restoredStock = currentVariant.stock + item.quantity;
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: { stock: restoredStock },
            });

            await tx.inventoryTransaction.create({
              data: {
                productId: item.productId,
                variantId: item.variantId,
                previousStock: currentVariant.stock,
                changedAmount: item.quantity,
                newStock: restoredStock,
                reason: `Customer Order #${order.orderNumber} Cancelled: ${reason || "Customer requested"}`,
                userId: session.user.id,
              },
            });
          }
        }

        // Restore main product stock
        const currentProduct = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (currentProduct) {
          const restoredStock = currentProduct.stock + item.quantity;
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: restoredStock },
          });

          await tx.inventoryTransaction.create({
            data: {
              productId: item.productId,
              previousStock: currentProduct.stock,
              changedAmount: item.quantity,
              newStock: restoredStock,
              reason: `Customer Order #${order.orderNumber} Cancelled: ${reason || "Customer requested"}`,
              userId: session.user.id,
            },
          });
        }
      }
    });

    revalidatePath(`/orders/${orderId}`);
    revalidatePath("/orders");
    revalidatePath("/admin/orders");
    revalidatePath("/admin/inventory");

    return { success: true };
  } catch (error) {
    console.error("Failed to cancel order:", error);
    return { error: "An unexpected error occurred while cancelling your order." };
  }
}
