import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass, Sparkles, HeartHandshake, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Us | Shopora",
  description: "Learn about Shopora's philosophy, craftsmanship, and commitment to timeless interior design.",
};

export default function AboutPage() {
  const values = [
    {
      icon: Compass,
      title: "Timeless Architecture",
      description: "We don't chase transient trends. Our pieces are sculpted with enduring proportions, quiet silhouettes, and timeless modern geometry.",
    },
    {
      icon: Sparkles,
      title: "Honest Materials",
      description: "From sustainably harvested solid oak to full-grain leather and hand-loomed wool, we prioritize tactile authenticity and natural longevity.",
    },
    {
      icon: HeartHandshake,
      title: "Artisanal Craftsmanship",
      description: "Partnering directly with multi-generational workshops, we fuse traditional joinery techniques with precision modern tooling.",
    },
    {
      icon: ShieldCheck,
      title: "Considered Sustainability",
      description: "We manufacture in disciplined batches to reduce waste, prioritizing non-toxic finishes, recyclable packaging, and lifetime durability.",
    },
  ];

  return (
    <div className="bg-background min-h-screen pb-24">
      {/* Hero Header */}
      <section className="relative py-24 md:py-32 bg-secondary/30 border-b border-border overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl text-center">
          <p className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
            Our Story & Philosophy
          </p>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-6">
            Designing spaces that bring calm, character, and meaning.
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
            Founded on the conviction that everyday objects should elevate everyday rituals, Shopora curates pieces that balance function, form, and integrity.
          </p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-20 container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-secondary">
            <Image
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200"
              alt="Shopora interior craftsmanship"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-light tracking-tight">
              A studio approach to everyday living.
            </h2>
            <p className="text-muted-foreground leading-relaxed font-light">
              We started Shopora with a single observation: the home furniture market was saturated with disposable, mass-manufactured pieces that lacked soul, alongside unattainable luxury pieces priced out of everyday life.
            </p>
            <p className="text-muted-foreground leading-relaxed font-light">
              We bridged this divide by eliminating intermediaries and partnering directly with master artisans across India and Europe. The result is furniture and home accents crafted with uncompromising standards, delivered with complete transparency.
            </p>
            <div className="pt-4">
              <Button asChild className="rounded-none tracking-widest uppercase text-xs h-12 px-8">
                <Link href="/products">
                  Explore The Collection
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-secondary/20 border-y border-border">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-light tracking-tight mb-4">Our Guiding Pillars</h2>
            <p className="text-muted-foreground font-light text-sm">
              The fundamental principles that guide every sketch, material choice, and partner collaboration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold">{v.title}</h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">
                    {v.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
