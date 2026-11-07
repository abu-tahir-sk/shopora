import Link from "next/link";
import { ArrowRight, Leaf, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CraftsmanshipStory() {
  return (
    <section className="py-24 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left: Atmospheric Photography */}
        <div className="lg:col-span-6 relative aspect-[4/5] rounded-3xl overflow-hidden bg-muted border border-border/80 shadow-xl group">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85")',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Floating Artisan Stat Tag */}
          <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-card/90 backdrop-blur-md border border-white/20 shadow-lg text-foreground">
            <div className="grid grid-cols-3 gap-2 text-center divide-x divide-border">
              <div>
                <p className="font-bold text-lg text-foreground">100%</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Solid Wood</p>
              </div>
              <div>
                <p className="font-bold text-lg text-emerald-600 dark:text-emerald-400">Zero</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Plastic Packing</p>
              </div>
              <div>
                <p className="font-bold text-lg text-brand">40+</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Master Artisans</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Editorial Narrative */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-brand">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Our Craft Philosophy</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-foreground leading-[1.15]">
            Heirloom Quality, Sustainable Soul.
          </h2>

          <p className="text-muted-foreground text-base sm:text-lg font-light leading-relaxed">
            We reject the disposable nature of mass production. Every Shopora piece begins with ethically harvested, kiln-dried hardwoods and is shaped by generational woodcarvers who treat furniture as functional sculpture.
          </p>

          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-brand/10 text-brand shrink-0 mt-0.5">
                <Leaf className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-foreground">Sustainably Harvested Hardwoods</h4>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  Certified plantation teak and European oaks seasoned for minimum moisture to prevent warping.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-brand/10 text-brand shrink-0 mt-0.5">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-foreground">Non-Toxic Botanical Finishes</h4>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  Hand-buffed with natural beeswax and linseed oils for rich texture and pet/child safety.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center gap-4">
            <Button asChild size="lg" className="rounded-xl px-6 h-12 text-xs uppercase tracking-wider font-semibold gap-2">
              <Link href="/about">
                <span>Discover Our Heritage</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-xl px-6 h-12 text-xs uppercase tracking-wider font-semibold">
              <Link href="/products">
                Shop The Collection
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

