import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { ProductReviews } from "@/components/product/product-reviews";
import { WishlistButton } from "@/components/product/wishlist-button";
import { Button } from "@/components/ui/button";
import { Star, Truck, ShieldCheck, ChevronRight } from "lucide-react";
import { auth } from "@/lib/auth";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = await params;
  const product = await db.product.findUnique({
    where: { slug: p.slug },
  });

  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | Shopora`,
    description: product.description || `Buy ${product.name} at Shopora`,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await params;
  const session = await auth();
  
  const product = await db.product.findUnique({
    where: { slug: p.slug },
    include: {
      images: { orderBy: { position: 'asc' } },
      variants: true,
      category: true,
      reviews: {
        where: { isApproved: true },
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, image: true } } },
      },
    },
  }) as any;

  if (!product) {
    notFound();
  }
  
  let isWishlisted = false;
  if (session?.user?.id) {
    const w = await db.wishlist.findUnique({
      where: { userId_productId: { userId: session.user.id, productId: product.id } }
    });
    isWishlisted = !!w;
  }

  // Fetch related products from the same category
  const relatedProducts = await db.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    take: 4,
    include: {
      images: { orderBy: { position: 'asc' }, take: 2 },
    },
  });

  return (
    <div className="bg-background min-h-screen">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/products" className="hover:text-foreground transition-colors">Shop</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/products?category=${product.category.slug}`} className="hover:text-foreground transition-colors">{product.category.name}</Link>
      </div>

      <div className="container mx-auto px-4 md:px-8 pb-24 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 relative">
          
          {/* Left Column - Image Stack */}
          <div className="w-full lg:w-3/5 flex flex-col gap-4">
            {product.images.map((image: any, idx: number) => (
              <div key={image.id} className={`bg-secondary w-full relative ${idx === 0 ? "aspect-[4/5]" : "aspect-[3/4]"}`}>
                {/* Fallback to background image for easy scaling if next/image isn't configured */}
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url("${image.url}")` }}
                />
              </div>
            ))}
          </div>

          {/* Right Column - Product Details (Sticky) */}
          <div className="w-full lg:w-2/5">
            <div className="sticky top-24 flex flex-col pt-4">
              
              {product.brand && (
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3">
                  {product.brand}
                </p>
              )}
              
              <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="text-2xl font-light tracking-tight">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                {product.comparePrice && (
                  <span className="text-lg text-muted-foreground line-through decoration-1">
                    ₹{product.comparePrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              {product.rating > 0 && (
                <div className="flex items-center gap-2 mb-8 text-sm">
                  <div className="flex text-brand">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'opacity-30'}`} />
                    ))}
                  </div>
                  <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
                </div>
              )}

              <p className="text-muted-foreground font-light leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-8 flex flex-col gap-6">
                  {/* Colors - Grouping mock logic for now */}
                  <div className="flex flex-col gap-3">
                    <span className="text-sm font-medium uppercase tracking-wide">Color</span>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set(product.variants.map((v: any) => v.color).filter(Boolean))).map((color: any, idx: number) => (
                        <button key={idx} className={`px-4 py-2 text-sm border transition-colors ${idx === 0 ? 'border-foreground bg-foreground text-background' : 'border-border text-muted-foreground hover:border-foreground/50'}`}>
                          {String(color)}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Sizes */}
                  {product.variants.some((v: any) => v.size) && (
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium uppercase tracking-wide">Size</span>
                        <button className="text-xs text-muted-foreground underline underline-offset-4">Size Guide</button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {Array.from(new Set(product.variants.map((v: any) => v.size).filter(Boolean))).map((size: any, idx: number) => (
                          <button key={idx} className={`px-4 py-2 text-sm border transition-colors ${idx === 0 ? 'border-foreground bg-foreground text-background' : 'border-border text-muted-foreground hover:border-foreground/50'}`}>
                            {String(size)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Add to Cart */}
              <div className="flex flex-col gap-4 mb-10 pt-4 border-t border-border">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <AddToCartButton 
                      product={{
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.images[0]?.url || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80",
                        brand: product.brand,
                        stock: product.stock,
                      }} 
                    />
                  </div>
                  <WishlistButton productId={product.id} initialIsWishlisted={isWishlisted} />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    <span>Free shipping over ₹999</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    <span>2 Year Warranty</span>
                  </div>
                </div>
              </div>

              {/* Accordions */}
              <div className="border-t border-border flex flex-col text-sm">
                <details className="group border-b border-border" open>
                  <summary className="flex cursor-pointer list-none items-center justify-between py-5 font-medium uppercase tracking-widest">
                    <span>Details</span>
                    <span className="transition group-open:rotate-180">
                      <ChevronDownIcon />
                    </span>
                  </summary>
                  <div className="pb-5 font-light text-muted-foreground leading-relaxed">
                    Designed for comfort and longevity. Crafted from premium materials carefully selected for their durability and aesthetic appeal. This piece represents the perfect balance between modern minimalism and everyday functionality.
                  </div>
                </details>
                <details className="group border-b border-border">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-5 font-medium uppercase tracking-widest">
                    <span>Dimensions</span>
                    <span className="transition group-open:rotate-180">
                      <ChevronDownIcon />
                    </span>
                  </summary>
                  <div className="pb-5 font-light text-muted-foreground">
                    <ul className="space-y-2">
                      <li>Width: 215 cm</li>
                      <li>Depth: 90 cm</li>
                      <li>Height: 75 cm</li>
                      <li>Seat Height: 42 cm</li>
                    </ul>
                  </div>
                </details>
                <details className="group border-b border-border">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-5 font-medium uppercase tracking-widest">
                    <span>Shipping & Returns</span>
                    <span className="transition group-open:rotate-180">
                      <ChevronDownIcon />
                    </span>
                  </summary>
                  <div className="pb-5 font-light text-muted-foreground leading-relaxed">
                    We offer standard and expedited shipping. Items can be returned within 30 days of delivery in their original condition and packaging. Custom orders are final sale.
                  </div>
                </details>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="container mx-auto px-4 md:px-8 pb-24 max-w-7xl">
        <ProductReviews productId={product.id} reviews={product.reviews as any} />
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-border bg-secondary/30">
          <div className="container mx-auto px-4 md:px-8 py-24 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
              <h2 className="text-2xl md:text-3xl font-light tracking-tight">You might also like</h2>
              <Link href={`/products?category=${product.category.slug}`} className="text-sm font-medium uppercase tracking-widest border-b border-foreground pb-1 hover:text-muted-foreground hover:border-muted-foreground transition-all mt-4 md:mt-0">
                Shop all {product.category.name}
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p as any} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
