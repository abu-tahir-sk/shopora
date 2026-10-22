import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim();

    if (!query || query.length < 2) {
      return NextResponse.json({ products: [] });
    }

    const products = await db.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { brand: { contains: query, mode: "insensitive" } },
          { category: { name: { contains: query, mode: "insensitive" } } },
        ],
      },
      take: 8,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        comparePrice: true,
        brand: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        images: {
          orderBy: { position: "asc" },
          take: 1,
          select: { url: true },
        },
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ error: "Failed to search products" }, { status: 500 });
  }
}
