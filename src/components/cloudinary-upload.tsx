"use client";

// Re-export Universal ImageUpload to replace fragile Cloudinary-only uploader
export { ImageUpload as CloudinaryUpload } from "@/components/image-upload";
