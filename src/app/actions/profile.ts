"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function updateProfile(data: {
  name: string;
  phone?: string;
  image?: string;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Please sign in to update your profile." };
    }

    const trimmedName = data.name?.trim();
    if (!trimmedName || trimmedName.length < 2) {
      return { success: false, error: "Name must be at least 2 characters." };
    }

    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: {
        name: trimmedName,
        phone: data.phone?.trim() || null,
        image: data.image?.trim() || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
      },
    });

    revalidatePath("/profile");
    return { success: true, user: updatedUser };
  } catch (error: any) {
    console.error("updateProfile error:", error);
    return { success: false, error: error.message || "Failed to update profile." };
  }
}

export async function changePassword(data: {
  currentPassword?: string;
  newPassword: string;
  confirmPassword: string;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Please sign in to change your password." };
    }

    if (!data.newPassword || data.newPassword.length < 6) {
      return { success: false, error: "New password must be at least 6 characters long." };
    }

    if (data.newPassword !== data.confirmPassword) {
      return { success: false, error: "New passwords do not match." };
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    });

    if (!user) {
      return { success: false, error: "User not found." };
    }

    // If the user already has a password set, require current password verification
    if (user.password) {
      if (!data.currentPassword) {
        return { success: false, error: "Current password is required." };
      }
      const isMatch = await bcrypt.compare(data.currentPassword, user.password);
      if (!isMatch) {
        return { success: false, error: "Incorrect current password." };
      }
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    await db.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    });

    revalidatePath("/profile");
    return { success: true, message: "Password updated successfully." };
  } catch (error: any) {
    console.error("changePassword error:", error);
    return { success: false, error: error.message || "Failed to change password." };
  }
}

export async function addAddress(data: {
  label?: string;
  street: string;
  city: string;
  state: string;
  pinCode: string;
  phone: string;
  isDefault?: boolean;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Please sign in to manage addresses." };
    }

    if (!data.street?.trim() || !data.city?.trim() || !data.state?.trim() || !data.pinCode?.trim() || !data.phone?.trim()) {
      return { success: false, error: "Please fill in all required address fields." };
    }

    const existingCount = await db.address.count({
      where: { userId: session.user.id },
    });

    const shouldBeDefault = Boolean(data.isDefault || existingCount === 0);

    if (shouldBeDefault) {
      await db.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      });
    }

    const newAddress = await db.address.create({
      data: {
        userId: session.user.id,
        label: data.label?.trim() || "Home",
        street: data.street.trim(),
        city: data.city.trim(),
        state: data.state.trim(),
        country: "India",
        pinCode: data.pinCode.trim(),
        phone: data.phone.trim(),
        isDefault: shouldBeDefault,
      },
    });

    revalidatePath("/profile");
    revalidatePath("/checkout");
    return { success: true, address: newAddress };
  } catch (error: any) {
    console.error("addAddress error:", error);
    return { success: false, error: error.message || "Failed to add address." };
  }
}

export async function updateAddress(
  id: string,
  data: {
    label?: string;
    street: string;
    city: string;
    state: string;
    pinCode: string;
    phone: string;
    isDefault?: boolean;
  }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Please sign in to manage addresses." };
    }

    const existing = await db.address.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return { success: false, error: "Address not found." };
    }

    if (data.isDefault && !existing.isDefault) {
      await db.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      });
    }

    const updated = await db.address.update({
      where: { id },
      data: {
        label: data.label?.trim() || existing.label,
        street: data.street.trim(),
        city: data.city.trim(),
        state: data.state.trim(),
        pinCode: data.pinCode.trim(),
        phone: data.phone.trim(),
        isDefault: data.isDefault !== undefined ? data.isDefault : existing.isDefault,
      },
    });

    revalidatePath("/profile");
    revalidatePath("/checkout");
    return { success: true, address: updated };
  } catch (error: any) {
    console.error("updateAddress error:", error);
    return { success: false, error: error.message || "Failed to update address." };
  }
}

export async function deleteAddress(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Please sign in to manage addresses." };
    }

    const existing = await db.address.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return { success: false, error: "Address not found." };
    }

    await db.address.delete({ where: { id } });

    // If we deleted the default address, promote the latest remaining one
    if (existing.isDefault) {
      const remaining = await db.address.findFirst({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
      });
      if (remaining) {
        await db.address.update({
          where: { id: remaining.id },
          data: { isDefault: true },
        });
      }
    }

    revalidatePath("/profile");
    revalidatePath("/checkout");
    return { success: true };
  } catch (error: any) {
    console.error("deleteAddress error:", error);
    return { success: false, error: error.message || "Failed to delete address." };
  }
}

export async function setDefaultAddress(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Please sign in to manage addresses." };
    }

    const address = await db.address.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!address) {
      return { success: false, error: "Address not found." };
    }

    await db.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });

    await db.address.update({
      where: { id },
      data: { isDefault: true },
    });

    revalidatePath("/profile");
    revalidatePath("/checkout");
    return { success: true };
  } catch (error: any) {
    console.error("setDefaultAddress error:", error);
    return { success: false, error: error.message || "Failed to set default address." };
  }
}
