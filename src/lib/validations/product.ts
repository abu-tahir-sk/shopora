import { z } from "zod";

export const variantSchema = z.object({
  id: z.string().optional(),
  size: z.string().optional(),
  color: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be a positive number").optional().or(z.literal("")),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative").default(0),
  sku: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  comparePrice: z.coerce.number().min(0).optional().or(z.literal("")),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  sku: z.string().optional(),
  brand: z.string().optional(),
  categoryId: z.string().min(1, "Please select a category"),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
  variants: z.array(variantSchema).default([]),
});

export type VariantFormValues = z.infer<typeof variantSchema>;
export type ProductFormValues = z.infer<typeof productSchema>;
