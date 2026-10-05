import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Wishlist | Shopora",
  description: "Your saved products",
};

export default async function WishlistPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login?callbackUrl=/wishlist");
  }

  const wishlistItems = await db.wishlist.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        include: {
          images: { orderBy: { position: "asc" }, take: 2 },
          category: true,
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="bg-background min-h-[70vh] py-12">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <h1 className="text-3xl font-light tracking-tight mb-2">My Wishlist</h1>
        <p className="text-muted-foreground mb-8">
          {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
        </p>

        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-secondary/30 border border-border">
            <h2 className="text-xl font-medium mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">Save items you love to view them later.</p>
            <Button asChild className="h-12 px-8 uppercase tracking-widest text-xs font-medium rounded-none">
              <Link href="/products">Explore Products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="relative group">
                <ProductCard product={item.product as any} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
