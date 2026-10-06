"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function deleteUser(userId: string) {
  const session = await auth();
  
  if (!session || session.user.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  // Prevent deleting oneself
  if (session.user.id === userId) {
    return { success: false, error: "Cannot delete your own account" };
  }

  try {
    await db.user.delete({
      where: { id: userId },
    });
    
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: "Failed to delete user" };
  }
}

export async function updateUserRole(userId: string, newRole: "ADMIN" | "CUSTOMER" | "SELLER") {
  const session = await auth();
  
  if (!session || session.user.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  // Prevent changing own role
  if (session.user.id === userId) {
    return { success: false, error: "Cannot change your own role" };
  }

  try {
    await db.user.update({
      where: { id: userId },
      data: { role: newRole },
    });
    
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { success: false, error: "Failed to update user role" };
  }
}
