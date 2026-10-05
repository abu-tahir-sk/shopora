import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const primaryImage = product.images?.[0]?.url || "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80";
  const secondaryImage = product.images?.[1]?.url || "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80";
  
  const discount = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) 
    : 0;

  return (
    <div className={cn("group flex flex-col cursor-pointer", className)}>
      <div className="relative aspect-[3/4] mb-4 bg-secondary overflow-hidden">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
          {product.stock === 0 ? (
            <span className="bg-foreground text-background text-[10px] uppercase font-bold tracking-wider px-2 py-1">Sold Out</span>
          ) : product.stock < 5 ? (
            <span className="bg-destructive text-destructive-foreground text-[10px] uppercase font-bold tracking-wider px-2 py-1">Low Stock</span>
          ) : discount > 0 ? (
            <span className="bg-brand text-brand-foreground text-[10px] uppercase font-bold tracking-wider px-2 py-1">{discount}% Off</span>
          ) : product.isFeatured ? (
            <span className="bg-foreground text-background text-[10px] uppercase font-bold tracking-wider px-2 py-1">Best Seller</span>
          ) : null}
        </div>
        
        {/* Wishlist Button */}
        <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
          <WishlistButton 
            productId={product.id} 
            initialIsWishlisted={isWishlisted}
            className="h-8 w-8 flex items-center justify-center bg-background/80 hover:bg-background"
            iconClassName="h-4 w-4"
          />
        </div>

        {/* Images */}
        <Link href={`/product/${product.slug}`} className="absolute inset-0 z-10">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-500 group-hover:opacity-0"
            style={{ backgroundImage: `url("${primaryImage}")` }}
          />
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105"
            style={{ backgroundImage: `url("${secondaryImage}")` }}
          />
        </Link>
        
        {/* Quick Add */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 focus-within:translate-y-0 transition-transform duration-300 z-20">
          <QuickAddButton 
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
      </div>
      
      {/* Product Details */}
      <Link href={`/product/${product.slug}`} className="flex flex-col space-y-1">
        <div className="flex justify-between items-start gap-2">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">{product.brand || "Shopora"}</p>
          {product.rating > 0 && (
            <div className="flex items-center gap-1 text-xs">
              <Star className="h-3 w-3 fill-brand text-brand" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({product.reviewCount})</span>
            </div>
          )}
        </div>
        <h3 className="font-medium text-foreground line-clamp-1">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="font-medium">₹{product.price.toLocaleString("en-IN")}</span>
          {product.comparePrice && (
            <span className="text-sm text-muted-foreground line-through">
              ₹{product.comparePrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}
