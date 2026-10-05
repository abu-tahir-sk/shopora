import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, PackageOpen } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "My Orders | Shopora",
  description: "View your order history",
};

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/orders");
  }

  const orders = await db.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: { take: 1, orderBy: { position: 'asc' } },
            },
          },
        },
      },
    },
  });

  return (
    <div className="bg-background min-h-[80vh] py-12">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        <h1 className="text-3xl font-light tracking-tight mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-secondary/30 border border-border">
            <PackageOpen className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
            <h2 className="text-xl font-medium mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">You haven't placed any orders yet.</p>
            <Link href="/products" className={cn(buttonVariants(), "rounded-none uppercase tracking-widest font-medium")}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="border border-border">
                <div className="bg-secondary/30 p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border">
                  <div className="flex flex-wrap gap-8 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1 uppercase tracking-wider text-xs">Order Placed</p>
                      <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1 uppercase tracking-wider text-xs">Total</p>
                      <p className="font-medium">₹{order.total.toLocaleString("en-IN")}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1 uppercase tracking-wider text-xs">Order #</p>
                      <p className="font-medium">{order.orderNumber}</p>
                    </div>
                  </div>
                  <div>
                    <span className={`inline-block px-3 py-1 text-xs font-medium uppercase tracking-wider border ${order.orderStatus === 'DELIVERED' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-secondary text-foreground border-border'}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                <div className="p-4 md:p-6">
                  <div className="divide-y divide-border">
                    {order.items.map((item) => (
                      <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                        <div className="h-20 w-20 relative bg-secondary shrink-0">
                          {item.product.images[0] ? (
                            <Image src={item.product.images[0].url} alt={item.product.name} fill className="object-cover" />
                          ) : (
                            <div className="absolute inset-0 bg-secondary" />
                          )}
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <Link href={`/product/${item.product.slug}`} className="font-medium hover:underline line-clamp-1">
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-muted-foreground mt-1">Qty: {item.quantity}</p>
                        </div>
                        <div className="flex flex-col items-end justify-center">
                          <p className="font-medium">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-secondary/10 p-4 border-t border-border flex justify-end">
                  <Link href={`/orders/${order.id}`} className="text-sm font-medium flex items-center hover:underline">
                    View Order Details <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
