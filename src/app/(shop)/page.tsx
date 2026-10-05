import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Headset } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { db } from "@/lib/db";

export default async function Home() {
  const categories = await db.category.findMany({
    take: 3,
    orderBy: { createdAt: "asc" },
  });

  const featuredProducts = await db.product.findMany({
    where: { isFeatured: true, isActive: true },
    take: 4,
    include: {
      images: {
        orderBy: { position: 'asc' },
        take: 2,
      },
      category: true,
    },
  });

  // Since categories do not have images in DB by default, let's assign dummy images to them based on their names
  const getCategoryImage = (index: number) => {
    const images = [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507646873130-97ce71b8be88?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80"
    ];
    return images[index % images.length];
  };

  return (
    <div className="flex flex-col w-full">
      {/* 5. HERO SECTION */}
      <section className="relative h-[80vh] min-h-[600px] w-full bg-secondary flex items-center justify-center overflow-hidden">
        {/* We would use next/image here in production */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-90 mix-blend-multiply"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
        
        <div className="relative z-10 container px-4 flex flex-col items-center text-center text-white mt-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h1 className="text-5xl md:text-7xl font-light tracking-tight max-w-4xl mb-6">
            Designed for modern living.
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl font-light mb-10 leading-relaxed">
            Thoughtfully selected pieces that bring function, character and timeless style into your everyday spaces.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button size="lg" className="rounded-none bg-white text-black hover:bg-white/90 px-8 h-14 text-sm tracking-widest uppercase">
              <Link href="/products">Shop Collection</Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-none border-white text-white hover:bg-white hover:text-black px-8 h-14 text-sm tracking-widest uppercase">
              <Link href="/products?sort=newest">Explore New Arrivals</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 12. BRAND / COLLECTION STRIP */}
      <div className="border-b border-border bg-background py-6 overflow-hidden">
        <div className="flex items-center justify-between min-w-max md:min-w-0 md:justify-center gap-12 md:gap-24 px-8 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          <span>New Season</span>
          <span className="hidden sm:inline">Essentials</span>
          <span>Studio Collection</span>
          <span className="hidden md:inline">Everyday Edit</span>
          <span>Limited Edition</span>
        </div>
      </div>

      {/* 6. SHOP BY CATEGORY */}
      <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-end justify-between mb-12">
          <h2 className="text-3xl font-light tracking-tight">Shop by Category</h2>
          <Link href="/products" className="text-sm font-medium hover:text-brand flex items-center gap-2 group transition-colors">
            View All Categories
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <Link key={cat.id} href={`/products?category=${cat.slug}`} className="group relative aspect-[4/5] overflow-hidden bg-secondary">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url("${getCategoryImage(i)}")` }}
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-2xl font-light text-white mb-2">{cat.name}</h3>
                  <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 flex items-center gap-2">
                    Explore Collection <ArrowRight className="h-3 w-3" />
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. FEATURED COLLECTION */}
      <section className="py-24 bg-secondary/30 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4">Curated For You</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-light">
              Thoughtfully selected pieces for spaces that feel distinctly yours.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        </div>
      </section>

      {/* 8. EDITORIAL STORY SECTION */}
      <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className="order-2 lg:order-1 relative aspect-[4/5] bg-secondary">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80")' }}
            />
          </div>
          <div className="order-1 lg:order-2 flex flex-col justify-center max-w-lg">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6">Make Space For Better Living</h2>
            <p className="text-lg text-muted-foreground font-light mb-10 leading-relaxed">
              Discover pieces designed to balance beauty, comfort and everyday functionality. Our latest collection focuses on natural materials, subtle textures, and enduring quality that grounds your home.
            </p>
            <div>
              <Link href="/products" className="inline-flex items-center justify-center rounded-none px-8 h-12 text-xs tracking-widest uppercase border border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors">
                Explore Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 13. TRUST SECTION */}
      <section className="border-t border-border bg-background py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <ShieldCheck className="h-8 w-8 text-muted-foreground stroke-[1.5]" />
            <div>
              <h4 className="font-medium mb-1">Secure Payments</h4>
              <p className="text-sm text-muted-foreground font-light">100% secure checkout</p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <Truck className="h-8 w-8 text-muted-foreground stroke-[1.5]" />
            <div>
              <h4 className="font-medium mb-1">Fast Delivery</h4>
              <p className="text-sm text-muted-foreground font-light">Free shipping over ₹999</p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <RotateCcw className="h-8 w-8 text-muted-foreground stroke-[1.5]" />
            <div>
              <h4 className="font-medium mb-1">Easy Returns</h4>
              <p className="text-sm text-muted-foreground font-light">30-day return policy</p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <Headset className="h-8 w-8 text-muted-foreground stroke-[1.5]" />
            <div>
              <h4 className="font-medium mb-1">Dedicated Support</h4>
              <p className="text-sm text-muted-foreground font-light">We're here to help</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* 14. NEWSLETTER */}
      <section className="bg-secondary py-24 px-4 text-center">
        <div className="max-w-xl mx-auto space-y-6">
          <h2 className="text-3xl font-light tracking-tight">Stay in the loop.</h2>
          <p className="text-muted-foreground font-light">
            Get new collections, exclusive offers and product inspiration directly in your inbox.
          </p>
          <form className="flex w-full max-w-md mx-auto items-center space-x-2 pt-4">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex h-12 w-full rounded-none border border-border bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button type="submit" className="h-12 rounded-none px-8 bg-foreground text-background hover:bg-foreground/90 uppercase text-xs tracking-widest">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}

