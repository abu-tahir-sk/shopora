"use client";

import { Truck, ShieldCheck, RefreshCw, Compass, Sparkles } from "lucide-react";

const valuePillars = [
  {
    icon: Truck,
    title: "White-Glove Delivery",
    subtitle: "Complimentary across India over ₹9,999",
  },
  {
    icon: ShieldCheck,
    title: "10-Year Frame Warranty",
    subtitle: "Artisanal kiln-dried solid hardwoods",
  },
  {
    icon: RefreshCw,
    title: "7-Day In-Home Trial",
    subtitle: "Risk-free returns, zero restock fees",
  },
  {
    icon: Compass,
    title: "Bespoke Design Service",
    subtitle: "Complimentary 3D room styling advice",
  },
];

const tickerItems = [
  "Solid Teak & Oak",
  "Hand-Carved Joinery",
  "Zero-VOC Eco Finishes",
  "Direct Artisan Sourcing",
  "Italian Full-Grain Leather",
  "Mouth-Blown Glass",
  "Architectural Lighting",
];

export function FeaturesMarquee() {
  return (
    <div className="w-full bg-background border-b border-border/80">
      {/* 4 Pillars Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {valuePillars.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/60 hover:border-brand/40 transition-all duration-300 shadow-2xs hover:shadow-xs group"
              >
                <div className="h-12 w-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-foreground">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ticker Strip */}
      <div className="border-t border-border/60 bg-muted/30 py-3.5 overflow-hidden">
        <div className="flex items-center justify-between min-w-max md:min-w-0 md:justify-center gap-8 md:gap-16 px-6 text-[11px] font-semibold tracking-widest text-muted-foreground uppercase select-none">
          {tickerItems.map((text, i) => (
            <div key={i} className="flex items-center gap-3">
              <Sparkles className="h-3 w-3 text-brand/70" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

