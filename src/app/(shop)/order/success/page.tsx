import { Metadata } from "next";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Order Success | Shopora",
  description: "Your order was placed successfully",
};

export default async function OrderSuccessPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  const p = await searchParams;
  const orderId = p.id;

  if (!orderId) {
    redirect("/");
  }

  const order = await db.order.findUnique({
    where: { id: orderId, userId: session.user.id },
    include: {
      items: {
        include: {
          product: {
            select: { name: true },
          }
        }
      },
      address: true,
    }
  });

  if (!order) {
    redirect("/");
  }

  return (
    <div className="bg-background min-h-[70vh] flex flex-col items-center justify-center py-24 px-4">
      <CheckCircle2 className="h-16 w-16 text-green-500 mb-6" />
      <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-4 text-center">Thank you for your order</h1>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        Your order <span className="font-medium text-foreground">{order.orderNumber}</span> has been placed successfully and is currently being processed.
      </p>
      
      <div className="w-full max-w-lg bg-secondary/30 border border-border p-6 mb-8 text-sm">
        <h2 className="font-medium tracking-tight mb-4 text-lg">Order Details</h2>
        <div className="space-y-4">
          <div className="flex justify-between pb-4 border-b border-border">
            <span className="text-muted-foreground">Order Date</span>
            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between pb-4 border-b border-border">
            <span className="text-muted-foreground">Payment Status</span>
            <span className="text-green-600 font-medium">{order.paymentStatus}</span>
          </div>
          <div className="flex justify-between pb-4 border-b border-border">
            <span className="text-muted-foreground">Total Amount</span>
            <span className="font-medium">₹{order.total.toLocaleString("en-IN")}</span>
          </div>
          <div className="pt-2">
            <span className="text-muted-foreground block mb-2">Shipping Address</span>
            <p className="font-medium">{order.address.street}</p>
            <p>{order.address.city}, {order.address.state} {order.address.pinCode}</p>
            <p>{order.address.country}</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/dashboard/orders" className={cn(buttonVariants({ size: "lg" }), "bg-foreground text-background hover:bg-foreground/90 h-14 text-sm tracking-widest font-medium uppercase rounded-none px-8")}>
          View Orders
        </Link>
        <Link href={`/invoice/${order.id}`} target="_blank" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-14 text-sm tracking-widest font-medium uppercase rounded-none px-8")}>
          View Invoice
        </Link>
        <Link href="/products" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-14 text-sm tracking-widest font-medium uppercase rounded-none px-8")}>
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
