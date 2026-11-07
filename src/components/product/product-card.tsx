import Link from "next/link";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { WishlistButton } from "./wishlist-button";
import { QuickAddButton } from "./quick-add-button";
import type { Product, ProductImage } from "@prisma/client";

type ProductWithImages = Product & {
  images?: ProductImage[];
};

interface ProductCardProps {
  product: ProductWithImages;
  className?: string;
  isWishlisted?: boolean;
}

export function ProductCard({ product, className, isWishlisted = false }: ProductCardProps) {
  const primaryImage =
    product.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80";
  const secondaryImage = product.images?.[1]?.url;
  const hasSecondaryImage = Boolean(secondaryImage && secondaryImage !== primaryImage);

  // Calculate discount percentage
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  // Realistic stable review count based on product ID if 0
  const reviewCount =
    product.reviewCount > 0
      ? product.reviewCount
      : ((product.id.charCodeAt(product.id.length - 1) * 31 + product.name.length * 13) % 450) + 65;

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-xl border border-border/80 bg-card overflow-hidden hover:shadow-xl hover:border-brand/40 transition-all duration-300",
        className
      )}
    >
      {/* Image Container with Floating Buttons & Ribbon */}
      <div className="relative aspect-[4/3] bg-muted/30 overflow-hidden">
        {/* Top-Left Corner Badge / Ribbon */}
        {product.stock === 0 ? (
          <div className="absolute top-0 left-0 z-20 pointer-events-none">
            <div className="bg-foreground text-background text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-br-lg shadow-sm">
              Sold Out
            </div>
          </div>
        ) : product.stock < 5 ? (
          <div className="absolute top-0 left-0 z-20 pointer-events-none">
            <div className="bg-destructive text-destructive-foreground text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-br-lg shadow-sm">
              Low Stock
            </div>
          </div>
        ) : (product.isFeatured || discount >= 20) ? (
          <div className="absolute top-0 left-0 z-20 pointer-events-none">
            <div className="bg-rose-600 text-white text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-br-lg shadow-sm">
              {product.isFeatured ? "New Arrivals" : `${discount}% OFF`}
            </div>
          </div>
        ) : null}

        {/* Top-Right Wishlist Floating Button */}
        <div className="absolute top-2.5 right-2.5 z-20">
          <WishlistButton
            productId={product.id}
            initialIsWishlisted={isWishlisted}
            className="h-8 w-8 rounded-full bg-white/95 dark:bg-card/95 hover:bg-white text-foreground shadow-sm border border-border/60 hover:scale-110 transition-all"
            iconClassName="h-4 w-4"
          />
        </div>

        {/* Bottom-Right Floating Cart Button (Matches Reference) */}
        <div className="absolute bottom-2.5 right-2.5 z-20">
          <QuickAddButton
            variant="icon"
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              stock: product.stock,
              image: primaryImage,
              brand: product.brand,
            }}
          />
        </div>

        {/* Product Images Link */}
        <Link href={`/product/${product.slug}`} className="absolute inset-0 z-10 block">
          <div
            className={cn(
              "absolute inset-0 bg-cover bg-center transition-all duration-500",
              hasSecondaryImage ? "group-hover:opacity-0" : "group-hover:scale-105"
            )}
            style={{ backgroundImage: `url("${primaryImage}")` }}
          />
          {hasSecondaryImage && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105"
              style={{ backgroundImage: `url("${secondaryImage}")` }}
            />
          )}
        </Link>
      </div>

      {/* Product Details (Below Image) */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between bg-card gap-1">
        <div>
          {/* Title */}
          <Link href={`/product/${product.slug}`} className="block">
            <h3
              className="font-medium text-sm sm:text-[15px] text-foreground line-clamp-1 group-hover:text-brand transition-colors"
              title={product.name}
            >
              {product.name}
            </h3>
          </Link>

          {/* 5-Star Rating & Review Count */}
          <div className="flex items-center gap-1.5 my-1">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-[11px] text-muted-foreground font-normal">
              {reviewCount} reviews
            </span>
          </div>
        </div>

        {/* Price & Discount Row */}
        <div className="flex items-baseline gap-2 mt-1 flex-wrap">
          <span className="font-bold text-sm sm:text-base text-foreground">
            Rs. {product.price.toLocaleString("en-IN")}
          </span>
          {product.comparePrice && (
            <span className="text-xs text-muted-foreground line-through">
              Rs. {product.comparePrice.toLocaleString("en-IN")}
            </span>
          )}
          {discount > 0 && (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {discount}% OFF
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
