import { db } from "@/lib/db";
import { ProductCard } from "@/components/product/product-card";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductSort } from "@/components/product/product-sort";
import { ShopAdBanner } from "@/components/product/shop-ad-banner";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Home, Flame, Tag, Percent } from "lucide-react";

export const metadata = {
  title: "Exclusive Offers & Deals | Shopora",
  description: "Save big with up to 55% OFF + extra discounts on premium furniture.",
};

interface OffersPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function OffersPage({ searchParams }: OffersPageProps) {
  const session = await auth();

  const params = await searchParams;
  const categoryParam = params.category as string | undefined;
  const sortParam = params.sort as string | undefined;

  // Query discounted products (or featured deals)
  const where: any = {
    isActive: true,
    OR: [
      { comparePrice: { not: null } },
      { isFeatured: true },
    ],
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
          <span className="text-foreground font-medium">Offers & Festive Deals</span>
        </div>

        {/* Ad Hero Banner (Matches Reference Image with DEEP26 coupon) */}
        <ShopAdBanner categoryName={categoryParam} totalProducts={products.length} />

        {/* Offers Feature Highlights Ticker */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-6">
          <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-card">
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Percent className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider">Up to 55% OFF</div>
              <div className="text-[11px] text-muted-foreground">On Selected Furniture</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-card">
            <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Tag className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider">Code: DEEP26</div>
              <div className="text-[11px] text-muted-foreground">Extra 15% Instant Off</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-card">
            <div className="h-9 w-9 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
              <Flame className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider">Flash Deals</div>
              <div className="text-[11px] text-muted-foreground">Limited Time Stocks</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-card">
            <div className="h-9 w-9 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Percent className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider">Free Shipping</div>
              <div className="text-[11px] text-muted-foreground">On Prepaid Orders &gt; ₹999</div>
            </div>
          </div>
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-b border-border mb-6">
          <ProductFilters categories={categories} />
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <p className="text-xs text-muted-foreground">
              Showing <span className="font-medium text-foreground">{products.length}</span> discounted items
            </p>
            <ProductSort />
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-border rounded-xl">
            <Tag className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-medium">No offers found in this category</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-6">
              Check out all collections to discover our complete catalogue.
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
