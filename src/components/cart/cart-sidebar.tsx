"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, ShoppingCart, Loader2 } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCart } from "@/store/use-cart";
import { formatPrice, cn } from "@/lib/utils";

interface CartSidebarProps {
  isLoggedIn?: boolean;
}

export function CartSidebar({ isLoggedIn = false }: CartSidebarProps) {
  const { items, isOpen, closeCart, updateQuantity, removeItem, totalPrice } = useCart();
  const [isMounted, setIsMounted] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Prevent hydration errors
  }

  const handleUpdateQuantity = async (id: string, quantity: number) => {
    setUpdatingId(id);
    await updateQuantity(id, quantity, isLoggedIn);
    setUpdatingId(null);
  };

  const handleRemove = async (id: string) => {
    setUpdatingId(id);
    await removeItem(id, isLoggedIn);
    setUpdatingId(null);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col p-0 border-l border-border">
        <SheetHeader className="px-6 py-6 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-light tracking-tight">Your Cart</SheetTitle>
            <Button variant="ghost" size="icon" onClick={closeCart} className="rounded-full">
              <X className="h-5 w-5" />
              <span className="sr-only">Close cart</span>
            </Button>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
              <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center">
                <ShoppingCart className="h-10 w-10 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xl font-medium mb-2">Your cart is empty</p>
                <p className="text-muted-foreground font-light mb-8">
                  Looks like you haven't added anything to your cart yet.
                </p>
                <Link href="/products" onClick={closeCart} className={cn(buttonVariants(), "rounded-none px-8 h-12 uppercase tracking-widest text-xs")}>
                  Continue Shopping
                </Link>
              </div>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                <div className="relative aspect-square h-24 w-24 md:h-32 md:w-32 bg-secondary flex-shrink-0 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 96px, 128px"
                  />
                </div>
                <div className="flex flex-col justify-between flex-1 py-1">
                  <div>
                    {item.brand && <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{item.brand}</p>}
                    <Link href={`/product/${item.productId}`} onClick={closeCart} className="hover:underline">
                      <h4 className="font-medium line-clamp-2 leading-snug">{item.name}</h4>
                    </Link>
                    <p className="text-sm font-medium mt-2">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-border">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none disabled:opacity-50"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={updatingId === item.id}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">
                        {updatingId === item.id ? <Loader2 className="h-3 w-3 animate-spin mx-auto" /> : item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none disabled:opacity-50"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={updatingId === item.id}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <button
                      onClick={() => handleRemove(item.id)}
                      disabled={updatingId === item.id}
                      className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 underline underline-offset-4"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border p-6 bg-background">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium text-lg">Subtotal</span>
              <span className="font-medium text-lg">{formatPrice(totalPrice())}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-6 font-light">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="grid gap-3">
              <Link href="/checkout" onClick={closeCart} className={cn(buttonVariants(), "w-full rounded-none h-14 uppercase tracking-widest text-sm")}>
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
