"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface WishlistNavButtonProps {
  initialCount?: number;
}

export function WishlistNavButton({ initialCount = 0 }: WishlistNavButtonProps) {
  const [prevInitialCount, setPrevInitialCount] = useState(initialCount);
  const [overrideCount, setOverrideCount] = useState<number | null>(null);

  // React 19 pattern: sync state with prop changes during render without useEffect
  if (initialCount !== prevInitialCount) {
    setPrevInitialCount(initialCount);
    setOverrideCount(null);
  }

  const count = overrideCount ?? initialCount;

  useEffect(() => {
    const handleWishlistUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ isWishlisted?: boolean; count?: number }>;
      if (typeof customEvent.detail?.count === "number") {
        setOverrideCount(customEvent.detail.count);
      } else if (typeof customEvent.detail?.isWishlisted === "boolean") {
        setOverrideCount((prev) => {
          const current = prev ?? initialCount;
          return customEvent.detail.isWishlisted ? current + 1 : Math.max(0, current - 1);
        });
      }
    };

    window.addEventListener("wishlist-updated", handleWishlistUpdate);
    return () => window.removeEventListener("wishlist-updated", handleWishlistUpdate);
  }, [initialCount]);

  return (
    <Button
      variant="ghost"
      size="icon"
      asChild
      className="relative rounded-full text-foreground hover:bg-secondary transition-all"
    >
      <Link href="/wishlist" aria-label={`View Wishlist (${count} saved)`} title="Wishlist">
        <Heart className="h-4 w-4 transition-transform hover:scale-110" />
        <span className="sr-only">Wishlist</span>

        <AnimatePresence>
          {count > 0 && (
            <motion.span
              key={count}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className="absolute top-1 right-1 flex h-3.5 min-w-3.5 px-0.5 items-center justify-center rounded-full bg-brand text-[9px] text-brand-foreground font-bold leading-none shadow-xs"
            >
              {count > 99 ? "99+" : count}
            </motion.span>
          )}
        </AnimatePresence>
      </Link>
    </Button>
  );
}
