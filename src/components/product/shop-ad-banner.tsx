"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, Sparkles, Copy, Check, Flame } from "lucide-react";
import { toast } from "sonner";

interface ShopAdBannerProps {
  categoryName?: string;
  totalProducts?: number;
}

export function ShopAdBanner({ categoryName, totalProducts }: ShopAdBannerProps) {
  const [copied, setCopied] = useState(false);
  const couponCode = "DEEP26";

  const handleCopyCoupon = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    toast.success(`Coupon code "${couponCode}" copied to clipboard!`);
    setTimeout(() => setCopied(false), 2200);
  };

  const displayCategory = categoryName ? categoryName.replace("-", " ") : "Side Tables & Living";

  return (
    <div className="w-full mb-6">
      {/* 1. Breadcrumb navigation above banner */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 font-normal">
        <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
          <Home className="h-3.5 w-3.5 text-muted-foreground" />
        </Link>
        <span className="text-muted-foreground/60">&gt;</span>
        <Link href="/products" className="hover:text-foreground transition-colors">
          Products
        </Link>
        {categoryName && (
          <>
            <span className="text-muted-foreground/60">&gt;</span>
            <span className="text-foreground font-medium capitalize">{displayCategory}</span>
          </>
        )}
      </div>

      {/* 2. Promotional Ad Hero Banner (Matches Reference Image) */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-[#0c4442] text-white shadow-md border border-[#0d5552] flex flex-col md:flex-row items-stretch justify-between min-h-[220px] sm:min-h-[250px] md:min-h-[270px]">
        {/* Left Side: Offer & Festive Typography */}
        <div className="relative z-10 flex-1 p-6 sm:p-8 md:p-10 flex flex-col justify-center items-start max-w-xl">
          {/* Category Eyebrow with gold divider lines */}
          <div className="flex items-center gap-3 mb-2 text-[#d4af37] text-xs font-semibold tracking-[0.25em] uppercase">
            <span className="w-6 h-px bg-[#d4af37]/60" />
            <span>{categoryName ? categoryName.replace("-", " ") : "Side Tables"}</span>
            <span className="w-6 h-px bg-[#d4af37]/60" />
          </div>

          {/* Decorative Festive Logo & Frame */}
          <div className="relative my-1 inline-block">
            <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-lg border border-[#eec15c]/40 bg-black/20 backdrop-blur-xs">
              <Flame className="h-4 w-4 text-[#f59e0b] animate-pulse" />
              <span className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal tracking-wide text-[#fef3c7]">
                Diwali Fest
              </span>
              <Sparkles className="h-4 w-4 text-[#f59e0b]" />
            </div>
          </div>

          {/* Big Discount Callout */}
          <div className="mt-3 space-y-0.5">
            <div className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white uppercase drop-shadow-sm">
              Up to <span className="text-[#fde047]">55% OFF</span>
            </div>
            <div className="text-xs sm:text-sm font-semibold tracking-wider text-emerald-200 uppercase">
              + 15% EXTRA OFF on Prepaid Orders
            </div>
          </div>

          {/* Golden Interactive Coupon Voucher */}
          <button
            type="button"
            onClick={handleCopyCoupon}
            title="Click to copy coupon code"
            className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded bg-[#eec15c] hover:bg-[#f6cd6b] text-[#1a1405] font-bold text-xs uppercase tracking-widest shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>COUPON CODE:</span>
            <span className="font-mono underline decoration-dashed underline-offset-2">{couponCode}</span>
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-800" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-[#1a1405]/80" />
            )}
          </button>
        </div>

        {/* Right Side: Cozy Lifestyle Photography Scene */}
        <div className="relative flex-1 min-h-[180px] md:min-h-full overflow-hidden">
          {/* Atmospheric Room Photography */}
          <div
            className="absolute inset-0 bg-cover bg-center md:bg-right"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=1200&q=85")',
            }}
          />

          {/* Gradient Blend to seamlessly merge with left teal background */}
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0c4442] via-[#0c4442]/60 to-transparent" />

          {/* Warm Ambient Lamp Glow Overlay */}
          <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

