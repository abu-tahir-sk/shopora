import { db } from "@/lib/db";
import { ProductCard } from "@/components/product/product-card";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductSort } from "@/components/product/product-sort";
import { ShopAdBanner } from "@/components/product/shop-ad-banner";
import Link from "next/link";
import { auth } from "@/lib/auth";

export const metadata = {
  title: "All Products | Shopora",
  description: "Shop our premium collection of furniture and decor.",
};

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const session = await auth();
  
  // Parse search params
  const params = await searchParams;
  const categoryParam = params.category as string | undefined;
  const sortParam = params.sort as string | undefined;
  const qParam = params.q as string | undefined;

  // Build Prisma query
  const where: any = {};
  if (categoryParam) {
    where.category = { slug: categoryParam };
  }
  if (qParam) {
    where.OR = [
      { name: { contains: qParam, mode: "insensitive" } },
      { description: { contains: qParam, mode: "insensitive" } },
      { brand: { contains: qParam, mode: "insensitive" } },
    ];
  }

  let orderBy: any = { createdAt: 'desc' };
  if (sortParam === 'price_asc') {
    orderBy = { price: 'asc' };
  } else if (sortParam === 'price_desc') {
    orderBy = { price: 'desc' };
  } else if (sortParam === 'featured') {
    orderBy = [{ isFeatured: 'desc' }, { createdAt: 'desc' }];
  } else if (sortParam === 'rating') {
    orderBy = { rating: 'desc' };
  } else if (sortParam === 'newest') {
    orderBy = { createdAt: 'desc' };
  }

  const [products, categories, userWishlist] = await Promise.all([
    db.product.findMany({
      where,
      orderBy,
      include: {
        images: {
          orderBy: { position: 'asc' },
          take: 2,
        },
        category: true,
      },
    }),
    db.category.findMany({
      orderBy: { name: 'asc' },
    }),
    session?.user ? db.wishlist.findMany({
      where: { userId: session.user.id },
      select: { productId: true }
    }) : Promise.resolve([])
  ]);

  const wishlistedIds = new Set(userWishlist.map(w => w.productId));

  return (
    <div className="w-full pb-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl pt-4 sm:pt-6">
        {/* Ad Hero Banner (Matches Reference Image 1) */}
        <ShopAdBanner categoryName={categoryParam} totalProducts={products.length} />

        {/* Toolbar: Filter by pills, View Switcher & Sort (Matches Reference Image 1) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-border/70">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Filter by
            </span>
            <ProductFilters categories={categories} />
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
            <span className="text-xs text-muted-foreground font-medium">
              {products.length} products
            </span>
            <div className="h-3.5 w-px bg-border hidden sm:block" />
            <ProductSort currentSort={sortParam} category={categoryParam} />
          </div>
        </div>

        {/* Category quick links */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none text-xs uppercase tracking-wider font-medium">
          <Link 
            href={`/products${sortParam ? `?sort=${sortParam}` : ''}`} 
            className={`px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap border text-xs ${
              !categoryParam 
                ? 'bg-foreground text-background font-bold border-foreground shadow-xs' 
                : 'bg-card text-muted-foreground border-border hover:border-foreground/40 hover:text-foreground'
            }`}
          >
            All Products
          </Link>
          {categories.map((cat) => (
            <Link 
              key={cat.id}
              href={`/products?category=${cat.slug}${sortParam ? `&sort=${sortParam}` : ''}`}
              className={`px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap border text-xs ${
                categoryParam === cat.slug 
                  ? 'bg-foreground text-background font-bold border-foreground shadow-xs' 
                  : 'bg-card text-muted-foreground border-border hover:border-foreground/40 hover:text-foreground'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Product Grid (Matches Reference Image 2: 5 columns on desktop, 2 on mobile) */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4 md:gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product as any} isWishlisted={wishlistedIds.has(product.id)} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center bg-card rounded-2xl border border-border">
            <h3 className="text-xl font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground mb-6">We couldn't find any products matching your current filters.</p>
            <Link href="/products" className="inline-flex items-center justify-center bg-foreground text-background px-6 py-3 text-sm font-medium tracking-wide uppercase hover:bg-foreground/90 transition-colors rounded-lg">
              Clear Filters
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
