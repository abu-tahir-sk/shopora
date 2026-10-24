"use client";

import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/use-cart";

export function CartButton() {
  const { openCart, totalItems } = useCart();
  const [mounted, setMounted] = useState(false);
  const count = mounted ? totalItems() : 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative rounded-full text-foreground hover:bg-secondary transition-all"
      onClick={openCart}
      aria-label={`Open shopping cart (${count} items)`}
      title="Shopping Cart"
    >
      <motion.div
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <ShoppingBag className="h-4 w-4 transition-transform hover:scale-110" />
      </motion.div>

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
      <span className="sr-only">Cart</span>
    </Button>
  );
}
