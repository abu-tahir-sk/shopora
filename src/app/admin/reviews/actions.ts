"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function approveReview(id: string) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");
  await db.review.update({ where: { id }, data: { isApproved: true } });
  revalidatePath("/admin/reviews");
}

export async function hideReview(id: string) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");
  await db.review.update({ where: { id }, data: { isApproved: false } });
  revalidatePath("/admin/reviews");
}

export async function deleteReview(id: string) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");
  await db.review.delete({ where: { id } });
  revalidatePath("/admin/reviews");
}
