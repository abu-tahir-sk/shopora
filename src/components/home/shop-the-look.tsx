"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Plus, Eye, Sparkles } from "lucide-react";
import Image from "next/image";

interface Hotspot {
  id: string;
  name: string;
  price: string;
  category: string;
  slug: string;
  image: string;
  top: string; // percentage
  left: string; // percentage
}

const hotspots: Hotspot[] = [
  {
    id: "h1",
    name: "Bouclé Lounge Accent Chair",
    price: "₹18,500",
    category: "Seating",
    slug: "boucle-accent-chair",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80",
    top: "58%",
    left: "26%",
  },
  {
    id: "h2",
    name: "Organic Marble Coffee Table",
    price: "₹24,900",
    category: "Tables",
    slug: "marble-coffee-table",
    image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=400&q=80",
    top: "70%",
    left: "52%",
  },
  {
    id: "h3",
    name: "Brushed Brass Architectural Pendant",
    price: "₹8,200",
    category: "Lighting",
    slug: "architectural-lighting",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80",
    top: "22%",
    left: "64%",
  },
];

export function ShopTheLook() {
  const [activeHotspot, setActiveHotspot] = useState<string | null>("h1");

  return (
    <section className="py-20 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-brand mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Room Inspiration & Styling</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-foreground">
            Shop The Look
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base font-light mt-1 max-w-xl">
            See how our signature artisanal furniture and ambient lighting come together in a modern Japandi interior.
          </p>
        </div>

        <Link
          href="/products"
          className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-foreground hover:text-brand flex items-center gap-1.5 group transition-colors self-start sm:self-auto"
        >
          <span>Explore All Looks</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Main Interactive Stage */}
      <div className="relative rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-[16/9] max-h-[580px] bg-muted border border-border/80 shadow-lg">
        {/* Living room photography */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=2000&q=85")',
          }}
        />

        {/* Ambient Dark Gradient on bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Interactive Hotspot Buttons */}
        {hotspots.map((spot) => {
          const isActive = activeHotspot === spot.id;
          return (
            <div
              key={spot.id}
              className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
              style={{ top: spot.top, left: spot.left }}
            >
              {/* Pulsing Pin Button */}
              <button
                type="button"
                onClick={() => setActiveHotspot(isActive ? null : spot.id)}
                className={`relative h-9 w-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg focus:outline-none ${isActive
                    ? "bg-brand text-white scale-110 ring-4 ring-brand/40"
                    : "bg-white/90 text-foreground hover:bg-white hover:scale-110 ring-2 ring-black/10"
                  }`}
                aria-label={`View ${spot.name}`}
              >
                <Plus
                  className={`h-4 w-4 transition-transform duration-300 ${isActive ? "rotate-45" : ""
                    }`}
                />
                {!isActive && (
                  <span className="absolute -inset-1 rounded-full bg-white/40 animate-ping pointer-events-none" />
                )}
              </button>

              {/* Floating Product Preview Card */}
              {isActive && (
                <div className="absolute left-1/2 bottom-full mb-3 -translate-x-1/2 w-64 bg-card/95 backdrop-blur-md rounded-2xl p-3 border border-border shadow-2xl z-30 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex gap-3 items-center">
                    <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-muted shrink-0 border border-border/60">
                      <Image
                        src={spot.image}
                        alt={spot.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase font-semibold text-brand tracking-wider">
                        {spot.category}
                      </span>
                      <h4 className="font-semibold text-xs text-foreground truncate mt-0.5" title={spot.name}>
                        {spot.name}
                      </h4>
                      <p className="font-bold text-sm text-foreground mt-0.5">{spot.price}</p>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-border/60 flex items-center justify-between">
                    <Link
                      href={`/products`}
                      className="text-[11px] font-semibold text-brand hover:underline inline-flex items-center gap-1"
                    >
                      <span>View Details</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                    <span className="text-[10px] text-muted-foreground font-medium">In Stock</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

