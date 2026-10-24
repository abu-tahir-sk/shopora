"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Armchair, Table, Lamp, Sparkles, Compass, ShieldCheck } from "lucide-react";

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const categoryColumns = [
  {
    title: "Seating",
    href: "/products?category=seating",
    description: "Architectural sofas & lounge chairs",
    icon: Armchair,
    items: [
      { name: "Lounge Sofas", href: "/products?category=seating" },
      { name: "Accent & Lounge Chairs", href: "/products?category=seating" },
      { name: "Minimalist Benches", href: "/products?category=seating" },
      { name: "Daybeds & Ottomans", href: "/products?category=seating" },
    ],
  },
  {
    title: "Tables",
    href: "/products?category=tables",
    description: "Solid European oak & stone tops",
    icon: Table,
    items: [
      { name: "Oak Dining Tables", href: "/products?category=tables" },
      { name: "Sculptural Coffee Tables", href: "/products?category=tables" },
      { name: "Accent & Side Tables", href: "/products?category=tables" },
      { name: "Console Tables", href: "/products?category=tables" },
    ],
  },
  {
    title: "Lighting",
    href: "/products?category=lighting",
    description: "Ceramic & diffused luminaires",
    icon: Lamp,
    items: [
      { name: "Ceramic Table Lamps", href: "/products?category=lighting" },
      { name: "Architectural Pendants", href: "/products?category=lighting" },
      { name: "Linear Floor Lamps", href: "/products?category=lighting" },
      { name: "Ambient Sconces", href: "/products?category=lighting" },
    ],
  },
  {
    title: "Decor & Objects",
    href: "/products?category=decor",
    description: "Woven textiles & ceramic silhouettes",
    icon: Sparkles,
    items: [
      { name: "Handwoven Linen Rugs", href: "/products?category=decor" },
      { name: "Artisan Ceramic Vases", href: "/products?category=decor" },
      { name: "Minimalist Mirrors", href: "/products?category=decor" },
      { name: "Sculptural Accents", href: "/products?category=decor" },
    ],
  },
];

export function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="absolute top-full left-0 w-full bg-background/98 backdrop-blur-xl border-b border-border shadow-2xl z-40"
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Categories Grid (8 cols) */}
          <div className="col-span-8 grid grid-cols-4 gap-6">
            {categoryColumns.map((col) => {
              const Icon = col.icon;
              return (
                <div key={col.title} className="space-y-4">
                  <Link
                    href={col.href}
                    onClick={onClose}
                    className="group block space-y-1"
                  >
                    <div className="flex items-center gap-2 text-foreground group-hover:text-brand transition-colors">
                      <div className="p-1.5 rounded-md bg-secondary/80 group-hover:bg-brand/10 transition-colors">
                        <Icon className="h-4 w-4 text-brand" />
                      </div>
                      <h3 className="font-semibold text-sm tracking-tight uppercase tracking-wider">{col.title}</h3>
                    </div>
                    <p className="text-[11px] text-muted-foreground font-light line-clamp-1">
                      {col.description}
                    </p>
                  </Link>

                  <ul className="space-y-2 border-t border-border/40 pt-3">
                    {col.items.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className="text-xs text-muted-foreground hover:text-foreground hover:translate-x-1 inline-block transition-all font-light"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={col.href}
                    onClick={onClose}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-brand hover:underline pt-1"
                  >
                    View All {col.title}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Right Spotlight Card (4 cols) */}
          <div className="col-span-4 pl-6 border-l border-border/60">
            <Link
              href="/products?sort=featured"
              onClick={onClose}
              className="group block relative rounded-xl overflow-hidden bg-secondary aspect-[16/10] border border-border/60 shadow-sm hover:shadow-md transition-all"
            >
              <Image
                src="https://images.unsplash.com/photo-1550254478-ead40cc54513?auto=format&fit=crop&q=80&w=800"
                alt="Architectural Living Room Spotlight"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
              <div className="absolute inset-0 p-5 flex flex-col justify-between text-white">
                <div className="flex justify-between items-start">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-white/20 backdrop-blur-md">
                    Featured Spotlight
                  </span>
                  <span className="text-[11px] text-white/80 font-light">From ₹18,500</span>
                </div>
                <div>
                  <h4 className="text-base font-medium tracking-tight mb-1 text-white group-hover:text-brand-foreground">
                    The Architectural Living Edit
                  </h4>
                  <p className="text-xs text-white/80 font-light line-clamp-1 mb-2">
                    Clean lines, Belgian linen, and solid European oak.
                  </p>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-foreground">
                    <span>Shop Curated Edit</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Quick trust perks */}
            <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-secondary/30">
                <Compass className="h-3.5 w-3.5 text-brand shrink-0" />
                <span className="truncate">Architectural Consultation</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-secondary/30">
                <ShieldCheck className="h-3.5 w-3.5 text-brand shrink-0" />
                <span className="truncate">7-Day In-Home Trial</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner Strip */}
        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-6">
            <span className="font-medium text-foreground">Need bespoke dimensions or contract pricing?</span>
            <Link
              href="/contact"
              onClick={onClose}
              className="hover:text-brand underline underline-offset-4 font-light"
            >
              Contact our Architectural Concierge →
            </Link>
          </div>
          <Link
            href="/categories"
            onClick={onClose}
            className="text-foreground font-semibold hover:text-brand flex items-center gap-1 uppercase tracking-wider text-[11px]"
          >
            Explore All Categories <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
