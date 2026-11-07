import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import fs from "fs";
import path from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // 1. Check local file system if available (Local dev)
    try {
      const localPath = path.join(process.cwd(), "public/uploads", id);
      if (fs.existsSync(localPath)) {
        const fileBuffer = fs.readFileSync(localPath);
        const ext = path.extname(id).toLowerCase();
        const mimeTypes: Record<string, string> = {
          ".png": "image/png",
          ".jpg": "image/jpeg",
          ".jpeg": "image/jpeg",
          ".webp": "image/webp",
          ".gif": "image/gif",
          ".svg": "image/svg+xml",
          ".avif": "image/avif",
        };
        const mime = mimeTypes[ext] || "image/jpeg";
        return new NextResponse(fileBuffer, {
          headers: {
            "Content-Type": mime,
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }
    } catch {
      // Ignore filesystem errors in serverless environments
    }

    // 2. Query Database (Vercel / Production Neon Storage)
    const rows = await db.$queryRawUnsafe<Array<{ mimeType: string; data: string }>>(
      `SELECT "mimeType", data FROM "UploadedImage" WHERE id = $1 LIMIT 1`,
      id
    );

    if (rows && rows.length > 0) {
      const img = rows[0];
      const buffer = Buffer.from(img.data, "base64");
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": img.mimeType || "image/jpeg",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    return new NextResponse("Image Not Found", { status: 404 });
  } catch (error: any) {
    console.error("Error serving uploaded image:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

