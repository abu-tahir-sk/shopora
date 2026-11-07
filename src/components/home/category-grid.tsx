import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  _count?: { products: number };
}

interface CategoryGridProps {
  categories: CategoryItem[];
}

const defaultCategoryImages: Record<string, string> = {
  seating: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
  tables: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=800&q=80",
  lighting: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
  decor: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
  bedroom: "https://images.unsplash.com/photo-1540518614846-7ede433c4b63?auto=format&fit=crop&w=800&q=80",
  kitchen: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
};

const fallbackImages = [
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1507646873130-97ce71b8be88?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
];

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="py-20 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-brand mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Curated Living Spaces</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-foreground">
            Explore by Category
          </h2>
        </div>
        <Link
          href="/categories"
          className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-foreground hover:text-brand flex items-center gap-1.5 group transition-colors self-start sm:self-auto"
        >
          <span>View All Departments</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {categories.map((cat, i) => {
          const imgUrl =
            defaultCategoryImages[cat.slug.toLowerCase()] ||
            fallbackImages[i % fallbackImages.length];
          const count = cat._count?.products ?? 0;

          return (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-muted border border-border/60 shadow-2xs hover:shadow-lg transition-all duration-500"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-108"
                style={{ backgroundImage: `url("${imgUrl}")` }}
              />

              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 group-hover:via-black/40 transition-colors duration-500" />

              {/* Tag / Product count pill */}
              <div className="absolute top-3.5 left-3.5 z-10">
                <span className="px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md text-[10px] font-bold text-white/90 border border-white/20 uppercase tracking-wider">
                  {count > 0 ? `${count} Pieces` : "Explore"}
                </span>
              </div>

              {/* Title & CTA button at bottom */}
              <div className="absolute inset-0 p-5 flex flex-col justify-end z-10 text-white">
                <div className="transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-lg sm:text-xl font-light text-white tracking-tight leading-tight">
                    {cat.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-white/80 font-medium mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <span>Shop Collection</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

