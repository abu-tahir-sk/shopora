"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { toggleWishlist } from "@/app/actions/wishlist";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  productId: string;
  initialIsWishlisted?: boolean;
  className?: string;
  iconClassName?: string;
}

export function WishlistButton({ 
  productId, 
  initialIsWishlisted = false,
  className,
  iconClassName
}: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!session?.user) {
      toast.error("Please sign in to save products to your wishlist.");
      return;
    }

    setLoading(true);
    
    // Optimistic update: capture previous state
    const previousState = isWishlisted;
    setIsWishlisted(!previousState);

    const res = await toggleWishlist(productId);
    
    if (res.success) {
      setIsWishlisted(res.isWishlisted as boolean);
      if (res.isWishlisted) {
        toast.success("Added to wishlist");
      } else {
        toast.info("Removed from wishlist");
      }
      router.refresh();
    } else {
      // Revert on error
      setIsWishlisted(previousState);
      toast.error(res.error || "Failed to update wishlist");
    }
    
    setLoading(false);
  };

  return (
    <button 
      onClick={handleToggle} 
      disabled={loading}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "p-2 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-sm transition-all hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed",
        isWishlisted ? "text-red-500 hover:text-red-600" : "text-foreground hover:text-red-500",
        className
      )}
    >
      <Heart 
        className={cn(
          "h-5 w-5 transition-all duration-300", 
          isWishlisted ? "fill-current scale-110" : "scale-100",
          iconClassName
        )} 
      />
    </button>
  );
}
