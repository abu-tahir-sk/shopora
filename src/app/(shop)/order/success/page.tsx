import { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2, ShoppingBag, FileText, ArrowRight, Package } from "lucide-react";
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
    redirect("/orders");
  }

  const order = await db.order.findUnique({
    where: { id: orderId, userId: session.user.id },
    include: {
      items: {
        include: {
          product: {
            select: { name: true },
          },
        },
      },
      address: true,
      payment: true,
    },
  });

  if (!order) {
    redirect("/orders");
  }

  const formattedDate = format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a");

  return (
    <div className="bg-background min-h-[75vh] flex flex-col items-center justify-center py-16 px-4">
      <div className="w-full max-w-xl text-center space-y-6">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 mb-2">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest font-semibold text-brand">Order Confirmed</span>
          <h1 className="text-3xl md:text-4xl font-light tracking-tight">Thank you for your order</h1>
          <p className="text-xs md:text-sm text-muted-foreground max-w-md mx-auto">
            Order <span className="font-mono font-semibold text-foreground">#{order.orderNumber}</span> has been placed successfully and is now being processed.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 text-left text-xs md:text-sm shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <span className="text-muted-foreground uppercase tracking-wider text-[11px] font-medium">Order Number</span>
            <span className="font-mono font-semibold">{order.orderNumber}</span>
          </div>

          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <span className="text-muted-foreground uppercase tracking-wider text-[11px] font-medium">Placed On</span>
            <span className="font-medium" suppressHydrationWarning>{formattedDate}</span>
          </div>

          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <span className="text-muted-foreground uppercase tracking-wider text-[11px] font-medium">Payment Status</span>
            <span className={cn(
              "px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border",
              order.paymentStatus === "PAID"
                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                : "bg-amber-500/10 text-amber-600 border-amber-500/20"
            )}>
              {order.payment?.paymentMethod === "COD" ? "Pay on Delivery" : order.paymentStatus}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <span className="text-muted-foreground uppercase tracking-wider text-[11px] font-medium">Total Paid</span>
            <span className="font-semibold text-base text-brand">₹{order.total.toLocaleString("en-IN")}</span>
          </div>

          <div className="space-y-1.5 pt-1">
            <span className="text-muted-foreground uppercase tracking-wider text-[11px] font-medium block">
              Shipping Destination
            </span>
            <p className="font-medium text-foreground">{order.address.street}</p>
            <p className="text-muted-foreground">
              {order.address.city}, {order.address.state} - {order.address.pinCode}
            </p>
            <p className="text-muted-foreground text-xs pt-0.5">Phone: {order.address.phone}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button asChild className="w-full sm:w-auto rounded-full px-6 text-xs uppercase tracking-widest font-semibold bg-brand text-brand-foreground hover:bg-brand/90">
            <Link href={`/orders/${order.id}`}>
              <Package className="h-4 w-4 mr-1.5" /> Track Order
            </Link>
          </Button>

          <Button asChild variant="outline" className="w-full sm:w-auto rounded-full px-6 text-xs uppercase tracking-widest">
            <Link href={`/invoice/${order.id}`} target="_blank">
              <FileText className="h-4 w-4 mr-1.5" /> View Invoice
            </Link>
          </Button>

          <Button asChild variant="ghost" className="w-full sm:w-auto rounded-full px-6 text-xs uppercase tracking-widest">
            <Link href="/products">
              Continue Shopping <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
