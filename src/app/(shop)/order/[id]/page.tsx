import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Clock, Package, Truck, ArrowLeft } from "lucide-react";
import { OrderStatus } from "@prisma/client";

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const p = await params;
  const session = await auth();

  if (!session?.user) {
    redirect(`/login?callbackUrl=/order/${p.id}`);
  }

  const order = await db.order.findUnique({
    where: { id: p.id },
    include: {
      items: {
        include: {
          product: {
            include: { images: true }
          }
        }
      },
      address: true,
    }
  });

  if (!order || order.userId !== session.user.id) {
    notFound();
  }

  const STATUS_STEPS = [
    { status: OrderStatus.CONFIRMED, label: "Order Confirmed", icon: Clock },
    { status: OrderStatus.PROCESSING, label: "Processing", icon: Package },
    { status: OrderStatus.SHIPPED, label: "Shipped", icon: Truck },
    { status: OrderStatus.DELIVERED, label: "Delivered", icon: CheckCircle2 },
  ];

  const getStatusIndex = (status: OrderStatus) => {
    if (status === OrderStatus.CANCELLED) return -1;
    if (status === OrderStatus.PENDING) return 0; // hasn't reached confirmed
    if (status === OrderStatus.OUT_FOR_DELIVERY) return 2.5; // between shipped and delivered
    const index = STATUS_STEPS.findIndex(s => s.status === status);
    return index;
  };

  const currentIndex = getStatusIndex(order.orderStatus);

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/account" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-light tracking-tight mb-1">Order #{order.orderNumber}</h1>
            <p className="text-muted-foreground text-sm">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </p>
          </div>
          <Link 
            href={`/invoice/${order.id}`}
            className="px-6 py-2 border border-border text-sm uppercase tracking-widest font-medium hover:bg-secondary transition-colors"
          >
            View Invoice
          </Link>
        </div>

        {/* Tracking Workflow */}
        <div className="bg-secondary/30 border border-border p-8 mb-10">
          <h2 className="text-lg font-medium mb-8">Order Status</h2>
          
          {order.orderStatus === OrderStatus.CANCELLED ? (
            <div className="flex flex-col items-center justify-center py-6 text-destructive">
              <span className="text-lg font-medium">Order Cancelled</span>
              <p className="text-sm mt-2">This order was cancelled and will not be fulfilled.</p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 z-0 hidden md:block" />
              <div className="flex flex-col md:flex-row justify-between relative z-10 gap-6 md:gap-0">
                {STATUS_STEPS.map((step, idx) => {
                  const isCompleted = currentIndex >= idx;
                  const isCurrent = currentIndex === idx;
                  const Icon = step.icon;
                  
                  return (
                    <div key={step.status} className="flex md:flex-col items-center gap-4 md:gap-3 group">
                      <div className={`
                        flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                        ${isCompleted 
                          ? 'bg-foreground border-foreground text-background' 
                          : 'bg-background border-border text-muted-foreground'}
                      `}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className={`text-sm font-medium ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-xl font-medium border-b border-border pb-4">Items</h2>
            <div className="space-y-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-24 h-24 bg-secondary">
                    {item.product.images?.[0] && (
                      <Image
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-1">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">₹{item.price.toLocaleString("en-IN")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-medium border-b border-border pb-4 mb-4">Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{order.subtotal.toLocaleString("en-IN")}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-brand">
                    <span>Discount</span>
                    <span>-₹{order.discount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{order.shipping === 0 ? "Free" : `₹${order.shipping.toLocaleString("en-IN")}`}</span>
                </div>
                <div className="flex justify-between font-medium text-base pt-4 border-t border-border">
                  <span>Total</span>
                  <span>₹{order.total.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-medium border-b border-border pb-4 mb-4">Shipping Address</h2>
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">{session.user.name}</p>
                <p>{order.address.street}</p>
                <p>{order.address.city}, {order.address.state} {order.address.pinCode}</p>
                <p>{order.address.country}</p>
                <p className="pt-2">Phone: {order.address.phone}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
