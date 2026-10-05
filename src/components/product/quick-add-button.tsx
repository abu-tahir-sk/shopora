"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/store/use-cart";
import { useSession } from "next-auth/react";

interface QuickAddButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
    image: string;
    brand: string | null;
  };
}

export function QuickAddButton({ product }: QuickAddButtonProps) {
  const { data: session } = useSession();
  const { addItem } = useCart();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    await addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      brand: product.brand,
    }, !!session?.user);
  };

  return (
    <Button 
      onClick={handleAddToCart}
      className="w-full bg-background text-foreground hover:bg-background/90 font-medium tracking-wide uppercase text-xs" 
      disabled={product.stock === 0}
    >
      {product.stock === 0 ? "Out of Stock" : "Quick Add"}
    </Button>
  );
}
