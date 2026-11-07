"use client";

import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { useCart } from "@/store/use-cart";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface QuickAddButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
    image: string;
    brand: string | null;
  };
  variant?: "default" | "icon";
  className?: string;
}

export function QuickAddButton({ product, variant = "default", className }: QuickAddButtonProps) {
  const { data: session } = useSession();
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock === 0) {
      toast.error("This item is currently out of stock");
      return;
    }

    setIsAdding(true);
    try {
      await addItem(
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
          brand: product.brand,
        },
        !!session?.user
      );

      setIsSuccess(true);
      toast.success(`Added "${product.name}" to cart!`);
      setTimeout(() => setIsSuccess(false), 1800);
    } catch {
      toast.error("Failed to add item to cart");
    } finally {
      setIsAdding(false);
    }
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={product.stock === 0 || isAdding}
        title={product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        aria-label={`Add ${product.name} to cart`}
        className={cn(
          "h-9 w-9 rounded-full bg-white dark:bg-card text-foreground shadow-md border border-border/80 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-brand hover:text-white hover:border-brand active:scale-95 disabled:opacity-50 disabled:pointer-events-none group/cart",
          isSuccess && "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-600",
          className
        )}
      >
        {isAdding ? (
          <Loader2 className="h-4 w-4 animate-spin text-brand group-hover/cart:text-white" />
        ) : isSuccess ? (
          <Check className="h-4 w-4" />
        ) : (
          <ShoppingCart className="h-4 w-4" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={product.stock === 0 || isAdding}
      className={cn(
        "w-full h-10 bg-background text-foreground hover:bg-background/90 font-medium tracking-wide uppercase text-xs rounded transition-colors disabled:opacity-50",
        className
      )}
    >
      {product.stock === 0 ? "Out of Stock" : isAdding ? "Adding..." : "Quick Add"}
    </button>
  );
}
