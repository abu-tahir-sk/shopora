"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function toggleWishlist(productId: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Please sign in to save products to your wishlist." };
    }

    // Validate product exists
    const product = await db.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return { success: false, error: "Product not found or unavailable." };
    }

    const existing = await db.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        }
      }
    });

    if (existing) {
      await db.wishlist.delete({ where: { id: existing.id } });
      revalidatePath("/wishlist");
      return { success: true, isWishlisted: false };
    } else {
      await db.wishlist.create({
        data: {
          userId: session.user.id,
          productId,
        }
      });
      revalidatePath("/wishlist");
      return { success: true, isWishlisted: true };
    }
  } catch (error) {
    console.error("Wishlist action error:", error);
    return { success: false, error: "Failed to update wishlist. Please try again later." };
  }
}
