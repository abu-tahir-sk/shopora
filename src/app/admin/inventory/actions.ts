"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function adjustInventory(
  type: "product" | "variant",
  id: string,
  adjustment: number,
  reason: string
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  if (adjustment === 0) return;

  await db.$transaction(async (tx) => {
    let currentStock = 0;
    let productId = "";
    let variantId = null;

    if (type === "product") {
      const product = await tx.product.findUnique({ where: { id } });
      if (!product) throw new Error("Product not found");
      currentStock = product.stock;
      productId = product.id;

      const newStock = Math.max(0, currentStock + adjustment);

      await tx.product.update({
        where: { id },
        data: { stock: newStock },
      });

      await tx.inventoryTransaction.create({
        data: {
          productId,
          previousStock: currentStock,
          changedAmount: adjustment,
          newStock,
          reason,
          userId: session.user.id,
        },
      });
    } else {
      const variant = await tx.productVariant.findUnique({
        where: { id },
        include: { product: true },
      });
      if (!variant) throw new Error("Variant not found");
      currentStock = variant.stock;
      productId = variant.productId;
      variantId = variant.id;

      const newStock = Math.max(0, currentStock + adjustment);

      await tx.productVariant.update({
        where: { id },
        data: { stock: newStock },
      });

      await tx.inventoryTransaction.create({
        data: {
          productId,
          variantId,
          previousStock: currentStock,
          changedAmount: adjustment,
          newStock,
          reason,
          userId: session.user.id,
        },
      });
    }
  });

  revalidatePath("/admin/inventory");
  revalidatePath("/admin/products");
}

export async function updateThreshold(
  type: "product" | "variant",
  id: string,
  threshold: number
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  if (type === "product") {
    await db.product.update({
      where: { id },
      data: { lowStockThreshold: threshold },
    });
  } else {
    await db.productVariant.update({
      where: { id },
      data: { lowStockThreshold: threshold },
    });
  }

  revalidatePath("/admin/inventory");
}
