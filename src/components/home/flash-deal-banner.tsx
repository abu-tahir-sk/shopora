"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Flame, Copy, Check, ArrowRight, Clock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function FlashDealBanner() {
  const [copied, setCopied] = useState(false);
  const couponCode = "DEEP26";

  // Countdown timer calculation (target: 2 days, 14 hours ahead)
  const [timeLeft, setTimeLeft] = useState({
    days: "02",
    hours: "14",
    minutes: "38",
    seconds: "45",
  });

  useEffect(() => {
    const target = Date.now() + (2 * 24 * 60 * 60 + 14 * 60 * 60 + 38 * 60) * 1000;

    const timer = setInterval(() => {
      const distance = Math.max(0, target - Date.now());
      const d = Math.floor(distance / (1000 * 60 * 60 * 24));
      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({
        days: d.toString().padStart(2, "0"),
        hours: h.toString().padStart(2, "0"),
        minutes: m.toString().padStart(2, "0"),
        seconds: s.toString().padStart(2, "0"),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCopyCoupon = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    toast.success(`Coupon code "${couponCode}" copied to clipboard!`);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full">
      <div className="relative rounded-3xl overflow-hidden bg-[#0c4442] text-white shadow-xl border border-[#0d5552] flex flex-col lg:flex-row items-stretch justify-between min-h-[320px] sm:min-h-[360px]">
        {/* Left Side: Festive Typography, Timer & Coupon */}
        <div className="relative z-10 flex-1 p-6 sm:p-10 md:p-12 flex flex-col justify-center items-start max-w-2xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/25 border border-[#eec15c]/40 text-[#fde047] text-xs font-semibold tracking-widest uppercase mb-4 shadow-sm">
            <Flame className="h-3.5 w-3.5 text-[#f59e0b] animate-pulse" />
            <span>Limited-Time Festive Sale</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-white capitalize leading-[1.1]">
            Diwali Living Fest
          </h2>

          <p className="text-emerald-100 text-sm sm:text-base mt-2 max-w-lg font-light leading-relaxed">
            Elevate your home this season with handcrafted statement furniture, ambient lighting, and artisanal accessories.
          </p>

          {/* Discount callout */}
          <div className="mt-4 flex flex-wrap items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#fde047] tracking-tight">
              UP TO 55% OFF
            </span>
            <span className="text-xs sm:text-sm font-semibold tracking-wider text-emerald-200 uppercase">
              + Extra 15% Prepaid Discount
            </span>
          </div>

          {/* Countdown Clock */}
          <div className="mt-6 flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 text-xs text-emerald-200 mr-1">
              <Clock className="h-4 w-4 text-[#fde047]" />
              <span className="font-semibold uppercase tracking-wider text-[11px]">Ends in:</span>
            </div>
            {[
              { val: timeLeft.days, label: "Days" },
              { val: timeLeft.hours, label: "Hours" },
              { val: timeLeft.minutes, label: "Mins" },
              { val: timeLeft.seconds, label: "Secs" },
            ].map((unit, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-black/35 backdrop-blur-md border border-white/15"
              >
                <span className="text-base sm:text-lg font-mono font-bold text-white leading-none">
                  {unit.val}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-emerald-200/80 mt-0.5">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>

          {/* Actions: Coupon + CTA */}
          <div className="mt-6 flex flex-wrap items-center gap-3.5">
            <button
              type="button"
              onClick={handleCopyCoupon}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#eec15c] hover:bg-[#f6cd6b] text-[#1a1405] font-bold text-xs uppercase tracking-widest shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>CODE:</span>
              <span className="font-mono underline decoration-dashed underline-offset-2">{couponCode}</span>
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-900" /> : <Copy className="h-3.5 w-3.5" />}
            </button>

            <Button
              asChild
              className="rounded-xl bg-white text-black hover:bg-white/90 h-10 px-5 text-xs font-semibold uppercase tracking-wider shadow-md gap-2"
            >
              <Link href="/products?sort=featured">
                <span>Shop Festive Deals</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Right Side: Warm Photography Scene */}
        <div className="relative flex-1 min-h-[220px] lg:min-h-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85")',
            }}
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0c4442] via-[#0c4442]/60 to-transparent" />
          <div className="absolute top-1/3 right-1/4 w-36 h-36 bg-amber-400/25 rounded-full blur-3xl pointer-events-none" />
        </div>
      </div>
    </section>
  );
}

