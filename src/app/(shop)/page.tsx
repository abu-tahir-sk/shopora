import Link from "next/link";
import { ArrowRight, Sparkles, Tag } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { NewsletterForm } from "@/components/home/newsletter-form";
import { HeroSlider } from "@/components/home/hero-slider";
import { FeaturesMarquee } from "@/components/home/features-marquee";
import { CategoryGrid } from "@/components/home/category-grid";
import { FlashDealBanner } from "@/components/home/flash-deal-banner";
import { ShopTheLook } from "@/components/home/shop-the-look";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { CraftsmanshipStory } from "@/components/home/craftsmanship-story";

export const metadata = {
  title: "Shopora | Modern Living, Artisanal Furniture & Architectural Decor",
  description:
    "Discover handcrafted solid wood furniture, organic sculptural seating, and minimalist ambient lighting designed for timeless living.",
};

export default async function Home() {
  const session = await auth();

  let categories: any[] = [];
  let featuredProducts: any[] = [];
  let allProducts: any[] = [];
  let userWishlist: any[] = [];

  try {
    [categories, featuredProducts, allProducts, userWishlist] = await Promise.all([
      db.category.findMany({
        orderBy: { name: "asc" },
        include: {
          _count: {
            select: { products: true },
          },
        },
      }),
      db.product.findMany({
        where: { isActive: true },
        take: 8,
        include: {
          images: {
            orderBy: { position: "asc" },
            take: 2,
          },
          category: true,
        },
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      }),
      db.product.findMany({
        where: { isActive: true },
        take: 10,
        include: {
          images: {
            orderBy: { position: "asc" },
            take: 2,
          },
          category: true,
        },
        orderBy: { price: "asc" },
      }),
      session?.user
        ? db.wishlist.findMany({
            where: { userId: session.user.id },
            select: { productId: true },
          })
        : Promise.resolve([]),
    ]);
  } catch (error) {
    console.error("Failed to fetch home page data:", error);
  }

  const wishlistedIds = new Set(userWishlist.map((w) => w.productId));

  // Affordable accent pieces for section 7
  const budgetPicks =
    allProducts.filter((p) => p.price <= 5000).length >= 2
      ? allProducts.filter((p) => p.price <= 5000).slice(0, 5)
      : allProducts.slice(0, 5);

  return (
    <div className="flex flex-col w-full bg-background overflow-hidden">
      {/* ========================================================
          1. SECTION 1: HERO MOTION CAROUSEL (3-Slide Auto Slider)
          ======================================================== */}
      <HeroSlider />

      {/* ========================================================
          2. SECTION 2: VALUE PILLARS & LUXURY TICKER STRIP
          ======================================================== */}
      <FeaturesMarquee />

      {/* ========================================================
          3. SECTION 3: EXPLORE BY CATEGORY (Visual Department Tiles)
          ======================================================== */}
      <CategoryGrid categories={categories} />

      {/* ========================================================
          4. SECTION 4: CURATED BESTSELLERS & FEATURED COLLECTION
          ======================================================== */}
      <section className="py-20 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-brand mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Signature Essentials</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-foreground">
              Curated For You
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base font-light mt-1">
              Thoughtfully selected pieces with artisan joinery and enduring modern silhouettes.
            </p>
          </div>

          <Link
            href="/products?sort=featured"
            className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-foreground hover:text-brand flex items-center gap-1.5 group transition-colors self-start sm:self-auto"
          >
            <span>View All Bestsellers</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 5-Column Responsive Grid matching Reference Image 2 */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4 md:gap-5">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={wishlistedIds.has(product.id)}
            />
          ))}
        </div>
      </section>

      {/* ========================================================
          5. SECTION 5: FESTIVE / DIWALI FLASH DEAL BANNER WITH COUNTDOWN
          ======================================================== */}
      <FlashDealBanner />

      {/* ========================================================
          6. SECTION 6: SHOP THE LOOK INTERACTIVE ROOM LOOKBOOK
          ======================================================== */}
      <ShopTheLook />

      {/* ========================================================
          7. SECTION 7: ACCENTS & ESSENTIALS UNDER ₹4,999
          ======================================================== */}
      <section className="py-20 px-4 sm:px-6 md:px-8 bg-muted/30 border-y border-border/80">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">
                <Tag className="h-3.5 w-3.5" />
                <span>Instant Home Refresh</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-light tracking-tight text-foreground">
                Affordable Luxury Under ₹4,999
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base font-light mt-1">
                Elevate your bedside, study, and coffee tables with sculptural accent pieces.
              </p>
            </div>

            <Link
              href="/products?sort=price_asc"
              className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-foreground hover:text-brand flex items-center gap-1.5 group transition-colors self-start sm:self-auto"
            >
              <span>Explore Budget Edit</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4 md:gap-5">
            {budgetPicks.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlistedIds.has(product.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          8. SECTION 8: CUSTOMER REVIEWS & SOCIAL PROOF WALL
          ======================================================== */}
      <TestimonialsSection />

      {/* ========================================================
          9. SECTION 9: EDITORIAL CRAFTSMANSHIP & SUSTAINABILITY
          ======================================================== */}
      <CraftsmanshipStory />

      {/* ========================================================
          10. SECTION 10: VIP DESIGN CLUB & ₹1,500 VOUCHER NEWSLETTER
          ======================================================== */}
      <section className="relative py-24 px-4 sm:px-6 md:px-8 bg-[#0c4442] text-white overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 border border-[#eec15c]/40 text-[#fde047] text-xs font-semibold tracking-widest uppercase">
            <Sparkles className="h-3.5 w-3.5 text-[#f59e0b]" />
            <span>Join The Shopora Circle</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-white leading-tight">
            Unlock ₹1,500 Off Your First Order
          </h2>

          <p className="text-emerald-100 text-sm sm:text-base font-light max-w-lg mx-auto leading-relaxed">
            Subscribe to receive private preview drops, complimentary design consultations, and exclusive festive vouchers straight to your inbox.
          </p>

          <div className="pt-2 max-w-md mx-auto">
            <NewsletterForm />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-emerald-200/80 pt-2 font-medium">
            <span>• No spam ever</span>
            <span>• Unsubscribe anytime</span>
            <span>• Instant coupon code delivery</span>
          </div>
        </div>
      </section>
    </div>
  );
}
