import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import {
  ChevronLeft,
  Package,
  FileText,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  MapPin,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { OrderStatus } from "@prisma/client";
import { CancelOrderButton } from "@/components/orders/cancel-order-button";

export const metadata: Metadata = {
  title: "Order Details | Shopora",
  description: "View your order details and delivery status",
};

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();

  if (!session?.user?.id) {
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
              images: { take: 1, orderBy: { position: "asc" } },
            },
          },
          variant: true,
        },
      },
      address: true,
      payment: true,
    },
  });

  if (!order) {
    notFound();
  }

  const formattedDate = format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a");

  const STATUS_STEPS = [
    { status: OrderStatus.CONFIRMED, label: "Confirmed", icon: Clock },
    { status: OrderStatus.PROCESSING, label: "Processing", icon: Package },
    { status: OrderStatus.SHIPPED, label: "Shipped", icon: Truck },
    { status: OrderStatus.DELIVERED, label: "Delivered", icon: CheckCircle2 },
  ];

  const getStepIndex = (status: OrderStatus) => {
    if (status === OrderStatus.CANCELLED) return -1;
    if (status === OrderStatus.PENDING) return 0;
    if (status === OrderStatus.OUT_FOR_DELIVERY) return 2.5;
    return STATUS_STEPS.findIndex((s) => s.status === status);
  };

  const currentStep = getStepIndex(order.orderStatus);

  return (
    <div className="bg-background min-h-screen py-10 pb-24 text-foreground">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/orders"
            className="text-xs uppercase tracking-wider font-medium text-muted-foreground hover:text-foreground flex items-center transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to All Orders
          </Link>
          <div className="flex items-center gap-2">
            {(order.orderStatus === OrderStatus.PENDING || order.orderStatus === OrderStatus.CONFIRMED) && (
              <CancelOrderButton orderId={order.id} orderNumber={order.orderNumber} />
            )}
            <Button asChild variant="outline" size="sm" className="rounded-full text-xs gap-1.5">
              <Link href={`/invoice/${order.id}`} target="_blank">
                <FileText className="h-3.5 w-3.5" />
                Download Invoice
              </Link>
            </Button>
          </div>
        </div>

        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border border-border bg-card mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <h1 className="text-2xl md:text-3xl font-light tracking-tight">Order #{order.orderNumber}</h1>
              <span
                className={cn(
                  "px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider rounded-full border",
                  order.orderStatus === OrderStatus.DELIVERED
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    : order.orderStatus === OrderStatus.CANCELLED
                    ? "bg-destructive/10 text-destructive border-destructive/20"
                    : "bg-brand/10 text-brand border-brand/20"
                )}
              >
                {order.orderStatus}
              </span>
            </div>
            <p className="text-xs text-muted-foreground" suppressHydrationWarning>
              Placed on {formattedDate}
            </p>
          </div>

          <div className="text-right flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-border/60">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Total Amount</span>
            <span className="text-xl md:text-2xl font-semibold text-brand">₹{order.total.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* Visual Progress Stepper (Only if not cancelled) */}
        {order.orderStatus !== OrderStatus.CANCELLED ? (
          <div className="border border-border bg-card rounded-2xl p-6 md:p-8 mb-8">
            <h2 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-6">
              Delivery Progress
            </h2>
            <div className="relative flex items-center justify-between">
              {/* Background Line */}
              <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 h-0.5 bg-secondary -z-0" />
              {/* Active Fill Line */}
              <div
                className="absolute top-1/2 left-0 -translate-y-1/2 h-0.5 bg-brand transition-all duration-500 -z-0"
                style={{
                  width: `${Math.min(100, Math.max(0, (currentStep / (STATUS_STEPS.length - 1)) * 100))}%`,
                }}
              />

              {STATUS_STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = idx <= currentStep;
                const isCurrent = idx === Math.floor(currentStep);

                return (
                  <div key={step.status} className="flex flex-col items-center relative z-10">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all",
                        isCompleted
                          ? "bg-brand text-brand-foreground border-brand"
                          : "bg-card text-muted-foreground border-border"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span
                      className={cn(
                        "mt-2 text-[11px] uppercase tracking-wider font-medium text-center",
                        isCurrent ? "text-brand font-semibold" : isCompleted ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="border border-destructive/20 bg-destructive/5 rounded-2xl p-6 mb-8 flex items-center gap-3 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <div>
              <p className="font-semibold text-sm">Order Cancelled</p>
              <p className="text-xs text-muted-foreground">This order was cancelled and will not be delivered.</p>
            </div>
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="border border-border rounded-2xl p-6 bg-card">
              <h2 className="text-sm uppercase tracking-widest font-semibold text-muted-foreground mb-4">
                Ordered Items ({order.items.length})
              </h2>
              <div className="divide-y divide-border/60">
                {order.items.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                    <div className="h-20 w-20 relative bg-secondary rounded-lg overflow-hidden shrink-0 border border-border/60">
                      {item.product.images[0] ? (
                        <Image
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground opacity-50" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-center min-w-0">
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="font-medium hover:text-brand transition-colors text-sm md:text-base line-clamp-1 mb-1"
                      >
                        {item.product.name}
                      </Link>
                      {item.variant && (
                        <p className="text-xs text-muted-foreground">
                          Variant: {item.variant.size || item.variant.color || "Standard"}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-0.5">Quantity: {item.quantity}</p>
                    </div>
                    <div className="flex flex-col justify-center items-end shrink-0">
                      <p className="font-semibold text-sm md:text-base">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-[11px] text-muted-foreground">
                          ₹{item.price.toLocaleString("en-IN")} each
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary & Destination Column */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <div className="border border-border rounded-2xl p-6 bg-card space-y-4">
              <h2 className="text-sm uppercase tracking-widest font-semibold text-muted-foreground">
                Payment Summary
              </h2>
              <div className="space-y-2.5 text-xs md:text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground">₹{order.subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping Fee</span>
                  <span className="text-foreground">
                    {order.shipping === 0 ? "FREE" : `₹${order.shipping.toLocaleString("en-IN")}`}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-brand font-medium">
                    <span>Discount</span>
                    <span>-₹{order.discount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-base pt-3 border-t border-border/60">
                  <span>Total</span>
                  <span className="text-brand">₹{order.total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Payment Details */}
              <div className="pt-3 border-t border-border/60 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Method</span>
                  <span className="font-medium">
                    {order.payment?.paymentMethod === "COD" ? "Cash On Delivery (COD)" : "Online (Razorpay)"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Payment Status</span>
                  <span className={cn(
                    "font-semibold",
                    order.paymentStatus === "PAID" ? "text-emerald-600" : "text-amber-600"
                  )}>
                    {order.paymentStatus}
                  </span>
                </div>
                {order.payment?.razorpayId && (
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                    <span>Ref ID</span>
                    <span className="font-mono">{order.payment.razorpayId}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="border border-border rounded-2xl p-6 bg-card space-y-3">
              <h2 className="text-sm uppercase tracking-widest font-semibold text-muted-foreground flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-brand" /> Delivery Destination
              </h2>
              <div className="text-xs md:text-sm text-muted-foreground space-y-1 leading-relaxed">
                <p className="font-medium text-foreground">{session.user.name}</p>
                <p>{order.address.street}</p>
                <p>
                  {order.address.city}, {order.address.state} - {order.address.pinCode}
                </p>
                <p>{order.address.country}</p>
                <p className="pt-1 text-foreground font-medium">Phone: {order.address.phone}</p>
              </div>
            </div>

            {/* Need Help Card */}
            <div className="border border-border/80 bg-secondary/30 rounded-2xl p-6 text-center space-y-2">
              <HelpCircle className="h-6 w-6 text-brand mx-auto mb-1" />
              <h3 className="text-sm font-medium">Need Assistance with this order?</h3>
              <p className="text-xs text-muted-foreground">
                Our support concierge is available 24/7 to resolve queries or handle returns.
              </p>
              <Button asChild variant="outline" size="sm" className="rounded-full text-xs mt-2">
                <Link href="/contact">Contact Concierge</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
