import { db } from "@/lib/db";
import { ProductCard } from "@/components/product/product-card";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductSort } from "@/components/product/product-sort";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Home, Sparkles } from "lucide-react";

export const metadata = {
  title: "New Arrivals | Shopora",
  description: "Discover our freshest handcrafted furniture and decor pieces.",
};

interface NewArrivalsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function NewArrivalsPage({ searchParams }: NewArrivalsPageProps) {
  const session = await auth();

  const params = await searchParams;
  const categoryParam = params.category as string | undefined;
  const sortParam = params.sort as string | undefined;

  const where: any = {
    isActive: true,
  };

  if (categoryParam) {
    where.category = { slug: categoryParam };
  }

  let orderBy: any = { createdAt: "desc" };
  if (sortParam === "price_asc") {
    orderBy = { price: "asc" };
  } else if (sortParam === "price_desc") {
    orderBy = { price: "desc" };
  } else if (sortParam === "rating") {
    orderBy = { rating: "desc" };
  }

  const [products, categories, userWishlist] = await Promise.all([
    db.product.findMany({
      where,
      orderBy,
      include: {
        images: {
          orderBy: { position: "asc" },
          take: 2,
        },
        category: true,
      },
    }),
    db.category.findMany({
      orderBy: { name: "asc" },
    }),
    session?.user
      ? db.wishlist.findMany({
          where: { userId: session.user.id },
          select: { productId: true },
        })
      : Promise.resolve([]),
  ]);

  const wishlistedIds = new Set(userWishlist.map((w) => w.productId));

  return (
    <div className="w-full pb-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl pt-4 sm:pt-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4 font-normal">
          <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="h-3.5 w-3.5 text-muted-foreground" />
          </Link>
          <span className="text-muted-foreground/60">&gt;</span>
          <span className="text-foreground font-medium">New Arrivals</span>
        </div>

        {/* New Arrivals Hero Banner */}
        <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white shadow-md border border-neutral-800 mb-8 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 text-xs font-semibold tracking-wider uppercase border border-amber-500/30">
              <Sparkles className="h-3.5 w-3.5" />
              Season Drop 2026
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-white">
              New Arrivals
            </h1>
            <p className="text-neutral-300 text-sm sm:text-base font-light leading-relaxed">
              Explore our freshest drops, handpicked artisanal solid wood creations, and seasonal statement furniture crafted for modern living.
            </p>
          </div>

          <div className="text-center md:text-right shrink-0">
            <div className="text-4xl sm:text-5xl font-light text-amber-400">
              {products.length}
            </div>
            <div className="text-xs uppercase tracking-widest text-neutral-400 mt-1">
              Fresh Designs In Store
            </div>
          </div>
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-b border-border mb-6">
          <ProductFilters categories={categories} />
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <p className="text-xs text-muted-foreground">
              Showing <span className="font-medium text-foreground">{products.length}</span> new arrivals
            </p>
            <ProductSort />
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-border rounded-xl">
            <Sparkles className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-medium">No new arrivals found</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-6">
              Try adjusting your category filters to view more products.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product as any}
                isWishlisted={wishlistedIds.has(product.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
