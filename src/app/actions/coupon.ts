"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function validateCoupon(code: string, subtotal: number) {
  try {
    const coupon = await db.coupon.findUnique({
      where: { code },
    });

    if (!coupon) {
      return { success: false, error: "Invalid coupon code" };
    }

    if (!coupon.isActive) {
      return { success: false, error: "Coupon is no longer active" };
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return { success: false, error: "Coupon has expired" };
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return { success: false, error: "Coupon usage limit reached" };
    }

    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      return { success: false, error: `Minimum order amount of ₹${coupon.minOrderAmount} required` };
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discountAmount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else if (coupon.discountType === "FIXED") {
      discountAmount = coupon.discountValue;
    } else if (coupon.discountType === "FREE_SHIPPING") {
      // Free shipping handled in the client, but let's pass a flag
      discountAmount = 0; 
    }

    return {
      success: true,
      discountAmount,
      discountType: coupon.discountType,
      code: coupon.code,
    };
  } catch (error: any) {
    return { success: false, error: "Something went wrong" };
  }
}
