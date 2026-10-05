"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useCart } from "@/store/use-cart";
import { useSession } from "next-auth/react";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    brand: string | null;
    stock: number;
  };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const { status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async () => {
    setIsLoading(true);
    await addItem(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        brand: product.brand,
        quantity: 1,
      },
      status === "authenticated"
    );
    setIsLoading(false);
  };

  return (
    <Button
      onClick={handleAdd}
      size="lg"
      className="w-full bg-foreground text-background hover:bg-foreground/90 h-14 text-sm tracking-widest font-medium uppercase rounded-none"
      disabled={product.stock === 0 || isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : product.stock === 0 ? (
        "Out of Stock"
      ) : (
        "Add to Cart"
      )}
    </Button>
  );
}
