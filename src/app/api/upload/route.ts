import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import fs from "fs";
import path from "path";

// Supported image MIME types
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml",
];

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SELLER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}. Allowed: JPEG, PNG, WEBP, GIF, AVIF, SVG` },
        { status: 400 }
      );
    }

    // Maximum file size: 10MB
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 10MB limit" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString("base64");

    // 1. Try Cloudinary if credentials are present and valid
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (cloudName && cloudName !== "shopora" && apiKey && apiSecret) {
      try {
        const timestamp = Math.round(Date.now() / 1000);
        const crypto = await import("crypto");
        const strToSign = `timestamp=${timestamp}${apiSecret}`;
        const signature = crypto.createHash("sha1").update(strToSign).digest("hex");

        const cldFormData = new FormData();
        cldFormData.append("file", `data:${file.type};base64,${base64Data}`);
        cldFormData.append("api_key", apiKey);
        cldFormData.append("timestamp", timestamp.toString());
        cldFormData.append("signature", signature);

        const cldRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: cldFormData,
          }
        );

        if (cldRes.ok) {
          const cldData = await cldRes.json();
          if (cldData.secure_url) {
            return NextResponse.json({ url: cldData.secure_url });
          }
        }
      } catch (cldErr) {
        console.warn("Cloudinary upload failed, using database storage:", cldErr);
      }
    }

    // 2. Generate clean unique ID for the image
    const ext = path.extname(file.name) || ".png";
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 25);
    const uniqueId = `${baseName}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}${ext}`;

    // 3. Save to Neon PostgreSQL Database (100% Serverless / Vercel compatible)
    try {
      await db.$executeRawUnsafe(
        `INSERT INTO "UploadedImage" (id, "mimeType", data, "createdAt")
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (id) DO UPDATE SET data = $3`,
        uniqueId,
        file.type,
        base64Data
      );
    } catch (dbErr: any) {
      console.error("Database image insert error:", dbErr);
      // Auto-create table if somehow missing
      await db.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "UploadedImage" (
          id TEXT PRIMARY KEY,
          "mimeType" TEXT NOT NULL,
          data TEXT NOT NULL,
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `);
      await db.$executeRawUnsafe(
        `INSERT INTO "UploadedImage" (id, "mimeType", data, "createdAt")
         VALUES ($1, $2, $3, NOW())`,
        uniqueId,
        file.type,
        base64Data
      );
    }

    // 4. Also write to local public/uploads ONLY if filesystem is writable (Local development only)
    try {
      if (!process.env.VERCEL) {
        const uploadDir = path.join(process.cwd(), "public/uploads");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const filePath = path.join(uploadDir, uniqueId);
        fs.writeFileSync(filePath, buffer);
      }
    } catch {
      // Safely ignore filesystem restrictions on Vercel / read-only serverless environments
    }

    // Return the serving URL
    const publicUrl = `/api/uploads/${uniqueId}`;
    return NextResponse.json({ url: publicUrl });
  } catch (error: any) {
    console.error("Upload route error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}
