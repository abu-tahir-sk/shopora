"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addReview(productId: string, data: { rating: number, comment?: string, image?: string }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "You must be logged in to review" };
    }

    // Check if the user has already reviewed this product
    const existingReview = await db.review.findFirst({
      where: {
        productId,
        userId: session.user.id,
      },
    });

    if (existingReview) {
      return { success: false, error: "You have already reviewed this product" };
    }

    // Check if user has purchased this product
    const hasPurchased = await db.order.findFirst({
      where: {
        userId: session.user.id,
        orderStatus: "DELIVERED", // assuming review is allowed after delivery, or just ordered
        items: {
          some: {
            productId,
          }
        }
      }
    });

    // Alternatively, just check if they ever bought it
    const anyPurchase = await db.order.findFirst({
      where: {
        userId: session.user.id,
        items: {
          some: {
            productId,
          }
        }
      }
    });

    const isVerifiedPurchase = !!anyPurchase;

    if (!isVerifiedPurchase) {
      return { success: false, error: "You can only review products you have purchased" };
    }

    await db.review.create({
      data: {
        productId,
        userId: session.user.id,
        rating: data.rating,
        comment: data.comment,
        image: data.image,
        isVerifiedPurchase,
        // isApproved is default true, or you can make it false for manual approval
        isApproved: true, 
      }
    });

    // Update product rating and review count
    const allReviews = await db.review.findMany({
      where: { productId, isApproved: true },
    });

    const avgRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length;

    await db.product.update({
      where: { id: productId },
      data: {
        rating: avgRating,
        reviewCount: allReviews.length,
      }
    });

    revalidatePath(`/product/[slug]`, 'page');

    return { success: true };
  } catch (error: any) {
    console.error("Failed to add review:", error);
    return { success: false, error: error.message || "Failed to add review" };
  }
}
