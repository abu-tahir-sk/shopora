"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Sparkles, Truck, RefreshCw, Headphones } from "lucide-react";

interface Announcement {
  id: number;
  text: string;
  highlight?: string;
  href?: string;
  icon: typeof Sparkles;
}

const announcements: Announcement[] = [
  {
    id: 1,
    text: "Free white-glove delivery on all orders over ₹9,999",
    highlight: "Free Delivery",
    href: "/shipping-returns",
    icon: Truck,
  },
  {
    id: 2,
    text: "Use code FIRST10 for 10% off your inaugural luxury piece",
    highlight: "FIRST10",
    href: "/products",
    icon: Sparkles,
  },
  {
    id: 3,
    text: "Complimentary 7-day in-home trial & hassle-free returns",
    highlight: "7-Day Trial",
    href: "/shipping-returns",
    icon: RefreshCw,
  },
  {
    id: 4,
    text: "Complimentary bespoke interior styling consultation",
    highlight: "Design Concierge",
    href: "/contact",
    icon: Headphones,
  },
];

export function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Auto-rotate every 4.5 seconds unless hovered
  useEffect(() => {
    if (isPaused || !isVisible) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, isVisible]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
  };

  if (!isVisible) return null;

  const current = announcements[currentIndex];
  const CurrentIcon = current.icon;

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full bg-brand text-brand-foreground text-xs font-medium border-b border-brand/20 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-8 flex items-center justify-between">
        {/* Left utility links (desktop only) */}
        <div className="hidden lg:flex items-center gap-4 text-[11px] opacity-85">
          <span className="flex items-center gap-1.5 font-light tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            India • INR (₹)
          </span>
          <span className="opacity-40">|</span>
          <Link href="/about" className="hover:opacity-100 transition-opacity font-light">
            Our Craftsmanship
          </Link>
        </div>

        {/* Center Rotating Announcements */}
        <div className="flex-1 flex items-center justify-center gap-2 overflow-hidden h-full">
          <button
            onClick={handlePrev}
            className="p-1 rounded-full hover:bg-black/15 transition-colors text-brand-foreground/80 hover:text-brand-foreground"
            aria-label="Previous announcement"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>

          <div className="relative h-6 flex items-center justify-center min-w-[280px] sm:min-w-[420px] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex items-center justify-center gap-2 text-center"
              >
                <CurrentIcon className="h-3 w-3 shrink-0 opacity-80" />
                {current.href ? (
                  <Link
                    href={current.href}
                    className="hover:underline underline-offset-4 tracking-wide font-medium flex items-center gap-1.5 truncate text-[11px] sm:text-xs"
                  >
                    <span>{current.text}</span>
                  </Link>
                ) : (
                  <span className="tracking-wide text-[11px] sm:text-xs truncate">{current.text}</span>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            onClick={handleNext}
            className="p-1 rounded-full hover:bg-black/15 transition-colors text-brand-foreground/80 hover:text-brand-foreground"
            aria-label="Next announcement"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Right utility links & dismiss */}
        <div className="hidden lg:flex items-center gap-4 text-[11px] opacity-85 justify-end">
          <Link href="/orders" className="hover:opacity-100 transition-opacity font-light">
            Track Order
          </Link>
          <span className="opacity-40">|</span>
          <Link href="/contact" className="hover:opacity-100 transition-opacity font-light">
            Concierge
          </Link>
          <button
            onClick={() => setIsVisible(false)}
            className="ml-2 p-0.5 rounded-full hover:bg-black/15 transition-colors opacity-70 hover:opacity-100"
            title="Dismiss announcement bar"
            aria-label="Dismiss"
          >
            <X className="h-3 w-3" />
          </button>
        </div>

        {/* Mobile Close Button */}
        <div className="flex lg:hidden items-center">
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 rounded-full hover:bg-black/15 transition-colors opacity-70 hover:opacity-100"
            aria-label="Dismiss announcement"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
