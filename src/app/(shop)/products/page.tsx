import { db } from "@/lib/db";
import { ProductCard } from "@/components/product/product-card";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductSort } from "@/components/product/product-sort";
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
    <div className="w-full pb-24">
      {/* Header Banner */}
      <div className="bg-secondary/50 py-16 md:py-24 border-b border-border text-center px-4">
        <h1 className="text-3xl md:text-5xl font-light tracking-tight mb-4 capitalize">
          {categoryParam ? categoryParam.replace('-', ' ') : "All Products"}
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto font-light leading-relaxed">
          Thoughtfully designed pieces that balance form and function. Explore our collection of premium materials and timeless silhouettes.
        </p>
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-7xl pt-8">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-8 border-b border-border">
          <div className="flex items-center gap-2">
            <ProductFilters categories={categories} />
            <span className="text-sm text-muted-foreground hidden md:inline-block ml-4">
              Showing {products.length} products {qParam ? `for "${qParam}"` : ''}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-4 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs uppercase tracking-wider font-medium">
              <Link 
                href={`/products${sortParam ? `?sort=${sortParam}` : ''}`} 
                className={`transition-colors whitespace-nowrap py-1 ${!categoryParam ? 'text-foreground font-bold border-b-2 border-brand' : 'text-muted-foreground hover:text-foreground'}`}
              >
                All
              </Link>
              {categories.map((cat) => (
                <Link 
                  key={cat.id}
                  href={`/products?category=${cat.slug}${sortParam ? `&sort=${sortParam}` : ''}`}
                  className={`transition-colors whitespace-nowrap py-1 ${categoryParam === cat.slug ? 'text-foreground font-bold border-b-2 border-brand' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            <div className="h-4 w-px bg-border hidden sm:block shrink-0" />

            <ProductSort currentSort={sortParam} category={categoryParam} />
          </div>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((product) => (
              <ProductCard key={product.id} product={product as any} isWishlisted={wishlistedIds.has(product.id)} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <h3 className="text-xl font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground mb-6">We couldn't find any products matching your current filters.</p>
            <Link href="/products" className="inline-flex items-center justify-center bg-foreground text-background px-6 py-3 text-sm font-medium tracking-wide uppercase hover:bg-foreground/90 transition-colors">
              Clear Filters
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
