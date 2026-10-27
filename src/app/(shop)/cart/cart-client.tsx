"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Trash2, 
  Minus, 
  Plus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Tag,
  Loader2
} from "lucide-react";
import { useCart } from "@/store/use-cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { validateCoupon } from "@/app/actions/coupon";
import { useMounted } from "@/hooks/use-mounted";

interface CartClientProps {
  isLoggedIn: boolean;
}

export function CartClient({ isLoggedIn }: CartClientProps) {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();
  const isMounted = useMounted();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountType: string;
    discountValue: number;
    discountAmount: number;
  } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  if (!isMounted) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
      </div>
    );
  }

  const subtotal = totalPrice();
  const freeShippingThreshold = 9999;
  const progressToFreeShipping = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const amountNeededForFreeShipping = Math.max(freeShippingThreshold - subtotal, 0);

  // Discount calculation
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;

  const shipping = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 250;
  const total = Math.max(subtotal - discount + shipping, 0);

  const handleQuantity = async (id: string, qty: number) => {
    setUpdatingId(id);
    await updateQuantity(id, qty, isLoggedIn);
    setUpdatingId(null);
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    try {
      const res = await validateCoupon(couponCode.trim(), subtotal);
      if (!res.success) {
        toast.error(res.error || "Invalid coupon");
      } else {
        setAppliedCoupon({
          code: res.code || couponCode.trim(),
          discountType: res.discountType || "PERCENTAGE",
          discountValue: 0,
          discountAmount: res.discountAmount || 0,
        });
        toast.success(`Coupon "${res.code}" applied!`);
      }
    } catch {
      toast.error("Failed to apply coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.info("Coupon removed");
  };

  if (items.length === 0) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-4">
        <div className="h-20 w-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-light tracking-tight mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground text-sm font-light mb-8">
          Looks like you haven&apos;t added any items to your cart yet. Explore our curated catalog of furniture and home essentials.
        </p>
        <Button asChild size="lg" className="rounded-none px-8 tracking-widest uppercase text-xs">
          <Link href="/products">Explore Collection</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      {/* Left Column: Cart Items List */}
      <div className="lg:col-span-8 space-y-6">
        {/* Free Shipping Notification Bar */}
        <div className="p-4 rounded-xl border border-border bg-secondary/30 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-brand" />
              {amountNeededForFreeShipping === 0 ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  🎉 Congratulations! You qualify for Free Standard Delivery.
                </span>
              ) : (
                <span>
                  Add <strong className="text-foreground">{formatPrice(amountNeededForFreeShipping)}</strong> more to get <strong>FREE SHIPPING</strong>
                </span>
              )}
            </span>
            <span className="text-muted-foreground">{Math.round(progressToFreeShipping)}%</span>
          </div>
          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
            <div 
              className="bg-brand h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>

        {/* Item Rows */}
        <div className="divide-y divide-border border-y border-border">
          {items.map((item) => (
            <div key={item.id} className="py-6 flex gap-4 sm:gap-6 items-start group">
              {/* Product Thumbnail */}
              <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 bg-secondary rounded-lg overflow-hidden border border-border">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                    No image
                  </div>
                )}
              </div>

              {/* Item Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    {item.brand && (
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                        {item.brand}
                      </p>
                    )}
                    <h3 className="text-base font-medium text-foreground hover:text-brand transition-colors">
                      <Link href={`/product/${item.productId}`}>
                        {item.name}
                      </Link>
                    </h3>
                  </div>
                  <button
                    onClick={() => removeItem(item.id, isLoggedIn)}
                    className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-1 text-sm font-semibold text-foreground">
                  {formatPrice(item.price)}
                </div>

                {/* Quantity and Line Total */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-border rounded-lg bg-card">
                    <button
                      onClick={() => handleQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1 || updatingId === item.id}
                      className="p-1.5 hover:bg-secondary rounded-l-lg transition-colors disabled:opacity-40"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-10 text-center text-xs font-semibold">
                      {updatingId === item.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin mx-auto text-muted-foreground" />
                      ) : (
                        item.quantity
                      )}
                    </span>
                    <button
                      onClick={() => handleQuantity(item.id, item.quantity + 1)}
                      disabled={updatingId === item.id}
                      className="p-1.5 hover:bg-secondary rounded-r-lg transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-muted-foreground block">Total</span>
                    <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Shopping Link */}
        <div className="pt-2">
          <Link
            href="/products"
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2 font-medium"
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>

      {/* Right Column: Order Summary */}
      <div className="lg:col-span-4">
        <div className="sticky top-28 p-6 rounded-2xl border border-border bg-card space-y-6 shadow-sm">
          <h2 className="text-lg font-semibold tracking-tight pb-3 border-b border-border">
            Order Summary
          </h2>

          {/* Coupon Code Input */}
          <div>
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                <div>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                    {appliedCoupon.code}
                  </span>
                  <p className="text-muted-foreground">Discount applied successfully</p>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-destructive hover:underline text-xs font-medium"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="pl-9 uppercase text-xs"
                  />
                </div>
                <Button type="submit" variant="outline" size="sm" disabled={couponLoading || !couponCode.trim()}>
                  {couponLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Apply"}
                </Button>
              </form>
            )}
          </div>

          {/* Totals Breakdown */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="text-foreground font-medium">{formatPrice(subtotal)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Discount</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}

            <div className="flex justify-between text-muted-foreground">
              <span>Estimated Shipping</span>
              <span className="text-foreground font-medium">
                {shipping === 0 ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">FREE</span>
                ) : (
                  formatPrice(shipping)
                )}
              </span>
            </div>

            <div className="pt-3 border-t border-border flex justify-between items-baseline">
              <span className="text-base font-semibold">Estimated Total</span>
              <span className="text-xl font-bold">{formatPrice(total)}</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Taxes calculated during checkout based on delivery address.
            </p>
          </div>

          {/* Checkout Button */}
          <Button asChild size="lg" className="w-full rounded-xl h-12 uppercase tracking-widest text-xs font-semibold gap-2">
            <Link href="/checkout">
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          {/* Trust Guarantees */}
          <div className="pt-4 border-t border-border grid grid-cols-2 gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand shrink-0" />
              <span>Secure Checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-brand shrink-0" />
              <span>7 Days Easy Return</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
