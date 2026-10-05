"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { productSchema } from "@/lib/validations/product";

export async function createProduct(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
    price: parseFloat(formData.get("price") as string),
    comparePrice: formData.get("comparePrice") ? formData.get("comparePrice") : undefined,
    stock: parseInt(formData.get("stock") as string) || 0,
    sku: formData.get("sku") || undefined,
    brand: formData.get("brand") || undefined,
    categoryId: formData.get("categoryId"),
    isFeatured: formData.get("isFeatured") === "on",
    isActive: formData.get("isActive") === "on" || formData.get("isActive") === "true",
    images: formData.getAll("images") as string[],
    variants: formData.get("variants") ? JSON.parse(formData.get("variants") as string) : [],
  };

  const validationResult = productSchema.safeParse(rawData);
  
  if (!validationResult.success) {
    throw new Error(validationResult.error.issues?.[0]?.message || "Validation failed");
  }

  const data = validationResult.data;

  // Generate slug from name
  let slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  
  // Check for uniqueness
  const existing = await db.product.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  const product = await db.product.create({
    data: {
      name: data.name,
      slug,
      description: data.description || "",
      price: data.price,
      comparePrice: data.comparePrice === "" ? null : data.comparePrice,
      stock: data.stock,
      sku: data.sku,
      brand: data.brand,
      categoryId: data.categoryId,
      isFeatured: data.isFeatured,
      isActive: data.isActive,
      images: {
        create: data.images.map((url, i) => ({
          url,
          position: i,
        })),
      },
      variants: {
        create: data.variants?.map((v) => ({
          size: v.size || null,
          color: v.color || null,
          sku: v.sku || null,
          price: v.price === "" ? null : (v.price as number),
          stock: v.stock,
        })) || []
      }
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await db.product.delete({
    where: { id },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
    price: parseFloat(formData.get("price") as string),
    comparePrice: formData.get("comparePrice") ? formData.get("comparePrice") : undefined,
    stock: parseInt(formData.get("stock") as string) || 0,
    sku: formData.get("sku") || undefined,
    brand: formData.get("brand") || undefined,
    categoryId: formData.get("categoryId"),
    isFeatured: formData.get("isFeatured") === "on",
    isActive: formData.get("isActive") === "on" || formData.get("isActive") === "true",
    images: formData.getAll("images") as string[],
    variants: formData.get("variants") ? JSON.parse(formData.get("variants") as string) : [],
  };

  const validationResult = productSchema.safeParse(rawData);
  
  if (!validationResult.success) {
    throw new Error(validationResult.error.issues?.[0]?.message || "Validation failed");
  }

  const data = validationResult.data;

  let slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  
  const existing = await db.product.findUnique({ where: { slug } });
  if (existing && existing.id !== id) {
    slug = `${slug}-${Date.now()}`;
  }

  await db.product.update({
    where: { id },
    data: {
      name: data.name,
      slug,
      description: data.description || "",
      price: data.price,
      comparePrice: data.comparePrice === "" ? null : data.comparePrice,
      stock: data.stock,
      sku: data.sku,
      brand: data.brand,
      categoryId: data.categoryId,
      isFeatured: data.isFeatured,
      isActive: data.isActive,
      images: {
        deleteMany: {},
        create: data.images.map((url, i) => ({
          url,
          position: i,
        })),
      },
      variants: {
        deleteMany: {}, // The simplest way is to recreate them, or do upsert. Since it's a simple relationship, delete and create is fine.
        create: data.variants?.map((v) => ({
          size: v.size || null,
          color: v.color || null,
          sku: v.sku || null,
          price: v.price === "" ? null : (v.price as number),
          stock: v.stock,
        })) || []
      }
    },
  });

  revalidatePath("/admin/products");
  revalidatePath(`/products`);
  revalidatePath(`/product/${slug}`);
  redirect("/admin/products");
}
