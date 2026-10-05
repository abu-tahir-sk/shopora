import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Order Details | Shopora",
  description: "View your order details",
};

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  const p = await params;
  
  const order = await db.order.findUnique({
    where: { id: p.id, userId: session.user.id },
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
      address: true,
      payment: true,
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen py-8 pb-24">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        <div className="mb-6">
          <Link href="/orders" className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Orders
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-light tracking-tight mb-2">Order {order.orderNumber}</h1>
            <p className="text-muted-foreground text-sm">Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
          </div>
          <div className="flex items-center gap-3">
             <span className={`inline-block px-3 py-1 text-xs font-medium uppercase tracking-wider border ${order.orderStatus === 'DELIVERED' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-secondary text-foreground border-border'}`}>
              {order.orderStatus}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="border border-border p-6 bg-card">
              <h2 className="text-lg font-medium tracking-tight mb-6">Items</h2>
              <div className="divide-y divide-border">
                {order.items.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                    <div className="h-24 w-24 relative bg-secondary shrink-0">
                      {item.product.images[0] ? (
                        <Image src={item.product.images[0].url} alt={item.product.name} fill className="object-cover" />
                      ) : (
                        <div className="absolute inset-0 bg-secondary flex items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground opacity-50" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <Link href={`/product/${item.product.slug}`} className="font-medium hover:underline text-lg line-clamp-1 mb-1">
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="flex flex-col justify-center items-end">
                      <p className="font-medium text-lg">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-muted-foreground mt-1">₹{item.price.toLocaleString("en-IN")} each</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="border border-border p-6 bg-card">
              <h2 className="text-lg font-medium tracking-tight mb-4">Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{order.subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{order.shipping === 0 ? "Free" : `₹${order.shipping.toLocaleString("en-IN")}`}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{order.discount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                {order.tax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>₹{order.tax.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between font-medium text-base pt-3 border-t border-border">
                  <span>Total</span>
                  <span>₹{order.total.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            <div className="border border-border p-6 bg-card space-y-6">
              <div>
                <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-3">Shipping Address</h2>
                <div className="text-sm space-y-1">
                  <p className="font-medium">{session.user.name}</p>
                  <p>{order.address.street}</p>
                  <p>{order.address.city}, {order.address.state} {order.address.pinCode}</p>
                  <p>{order.address.country}</p>
                  <p className="pt-2">Phone: {order.address.phone}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-3">Payment Info</h2>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Status</span>
                    <span className={`font-medium ${order.paymentStatus === 'PAID' ? 'text-green-600' : ''}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                  {order.payment && (
                    <div className="flex justify-between text-muted-foreground text-xs">
                      <span>Transaction ID</span>
                      <span>{order.payment.razorpayId || order.payment.id}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button variant="outline" className="w-full h-12 uppercase tracking-widest text-xs">
                Need Help?
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
