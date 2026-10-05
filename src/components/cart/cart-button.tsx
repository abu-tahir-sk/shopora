"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/use-cart";
import { useEffect, useState } from "react";

export function CartButton() {
  const { openCart, totalItems } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Button variant="ghost" size="icon" className="relative rounded-full" onClick={openCart}>
      <ShoppingCart className="h-4 w-4" />
      {mounted && totalItems() > 0 && (
        <span className="absolute top-1.5 right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-brand text-[9px] text-brand-foreground font-bold">
          {totalItems()}
        </span>
      )}
      <span className="sr-only">Cart</span>
    </Button>
  );
}
