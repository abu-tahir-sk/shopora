"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getCart() {
  const session = await auth();
  if (!session?.user?.id) return null;

  return db.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: {
                orderBy: { position: "asc" },
                take: 1,
              },
            },
          },
        },
        orderBy: { id: "asc" }
      },
    },
  });
}

export async function addToCart(productId: string, quantity: number = 1) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in to add items to your cart." };
  }

  const userId = session.user.id;

  try {
    let cart = await db.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await db.cart.create({
        data: { userId },
      });
    }

    const existingItem = await db.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (existingItem) {
      await db.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await db.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error adding to cart:", error);
    return { error: "Failed to add item to cart." };
  }
}

export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  if (quantity <= 0) {
    return removeFromCart(cartItemId);
  }

  try {
    const item = await db.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true },
    });

    if (!item || item.cart.userId !== session.user.id) {
      return { error: "Item not found in your cart" };
    }

    await db.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update quantity" };
  }
}

export async function removeFromCart(cartItemId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    const item = await db.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true },
    });

    if (!item || item.cart.userId !== session.user.id) {
      return { error: "Item not found in your cart" };
    }

    await db.cartItem.delete({
      where: { id: cartItemId },
    });

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    return { error: "Failed to remove item" };
  }
}
