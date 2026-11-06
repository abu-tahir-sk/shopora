"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateMessageStatus(id: string, status: string) {
  try {
    await db.contactMessage.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    console.error("Failed to update message status:", error);
    return { success: false, error: "Failed to update status" };
  }
}

export async function deleteMessage(id: string) {
  try {
    await db.contactMessage.delete({
      where: { id },
    });
    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete message:", error);
    return { success: false, error: "Failed to delete message" };
  }
}

