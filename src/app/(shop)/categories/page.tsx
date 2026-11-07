import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Layers, Sparkles, ChevronRight, Package, Truck, ShieldCheck } from "lucide-react";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Categories | Shopora",
  description: "Browse our collections of modern furniture, lighting, and home decor by category.",
};

const categoryImages: Record<string, string> = {
  seating: "https://images.unsplash.com/photo-1550254478-ead40cc54513?auto=format&fit=crop&q=80&w=1000",
  tables: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=1000",
  lighting: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=1000",
  decor: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1000",
  bedroom: "https://images.unsplash.com/photo-1540518614846-7ede433c4b63?auto=format&fit=crop&q=80&w=1000",
  kitchen: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1000",
};

const defaultImage = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1000";

export default async function CategoriesPage() {
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  return (
    <div className="bg-background min-h-screen pb-24">
      {/* Luxury Hero Banner */}
      <section className="relative min-h-[340px] md:min-h-[400px] w-full flex items-center justify-center overflow-hidden border-b border-border">
        {/* Background photo with subtle depth */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url("${defaultImage}")` }}
        />
        {/* Multi-layered cinematic contrast gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/40" />
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/60" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-8 max-w-4xl flex flex-col items-center text-center text-white py-14 md:py-20 animate-in fade-in slide-in-from-bottom-3 duration-700">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[11px] sm:text-xs tracking-widest uppercase text-white/70 mb-5 font-medium">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3 text-white/40" />
            <span className="text-white font-semibold">Categories</span>
          </nav>

          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-[11px] sm:text-xs tracking-widest uppercase font-medium mb-5 text-white/95 shadow-sm">
            <Layers className="h-3.5 w-3.5 text-brand" />
            <span>Curated Collections • Autumn / Winter 2026</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight mb-5 text-white capitalize leading-[1.1] text-balance">
            Explore by Category
          </h1>

          {/* Subtitle / Description */}
          <p className="text-white/90 max-w-2xl font-light leading-relaxed text-sm sm:text-base md:text-lg mb-8 text-balance">
            Every piece is designed to harmonize with your living space. Browse by functional category to find the perfect architectural addition to your home.
          </p>

          {/* Micro badges / highlights */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-[11px] sm:text-xs text-white/85 font-medium">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 shadow-xs">
              <Package className="h-3.5 w-3.5 text-brand" />
              {categories.length} Specialized Departments
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 shadow-xs">
              <Truck className="h-3.5 w-3.5 text-emerald-400" />
              White-Glove Delivery Included
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 shadow-xs">
              <ShieldCheck className="h-3.5 w-3.5 text-sky-400" />
              Handcrafted Artisanal Guarantee
            </span>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 md:px-8 max-w-7xl pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const bgImage = categoryImages[category.slug.toLowerCase()] || defaultImage;
            return (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-secondary border border-border/40 shadow-sm hover:shadow-xl transition-all duration-500"
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url("${bgImage}")` }}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 group-hover:from-black/90 transition-colors duration-500" />

                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between text-white">
                  <div className="flex justify-end">
                    <span className="text-xs uppercase tracking-wider font-medium px-3 py-1 rounded-full bg-white/20 backdrop-blur-md">
                      {category._count.products} {category._count.products === 1 ? "Product" : "Products"}
                    </span>
                  </div>

                  <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <h2 className="text-3xl font-light mb-2">{category.name}</h2>
                    {category.description && (
                      <p className="text-white/80 text-sm font-light mb-4 line-clamp-2 leading-relaxed">
                        {category.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-white/90 group-hover:text-white">
                      <span>Explore Collection</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
