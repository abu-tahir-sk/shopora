import { Metadata } from "next";
import Link from "next/link";
import { Truck, RotateCcw, ShieldCheck, Clock, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Shipping & Returns Policy | Shopora",
  description: "Detailed information about Shopora's nationwide delivery timelines, white-glove assembly, and 7-day hassle-free return policy.",
};

export default function ShippingReturnsPage() {
  return (
    <div className="bg-background min-h-screen pb-24">
      {/* Banner */}
      <div className="bg-secondary/40 py-16 md:py-24 border-b border-border text-center px-4 mb-16">
        <h1 className="text-3xl md:text-5xl font-light tracking-tight mb-4">
          Shipping & Returns
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto font-light leading-relaxed text-sm md:text-base">
          Transparent timelines, white-glove logistics, and a commitment to ensuring every piece arrives safely at your doorstep.
        </p>
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-4xl space-y-16">
        {/* Shipping Overview */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
              <Truck className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-light tracking-tight">Delivery Services & Rates</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
              <h3 className="font-semibold text-base">Complimentary Shipping</h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                Orders with a subtotal exceeding <strong className="text-foreground">₹9,999</strong> receive complimentary standard shipping nationwide.
              </p>
              <div className="inline-block px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                Free over ₹9,999
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
              <h3 className="font-semibold text-base">Standard Flat Rate</h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                For smaller cart sizes under ₹9,999, a flat shipping and handling charge of <strong className="text-foreground">₹250</strong> is calculated at checkout.
              </p>
              <div className="inline-block px-2.5 py-1 rounded-md bg-secondary text-muted-foreground text-xs font-medium">
                Flat ₹250
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-secondary/30 border border-border space-y-3">
            <h3 className="text-base font-semibold">White-Glove Furniture Delivery</h3>
            <p className="text-sm text-muted-foreground font-light leading-relaxed">
              Oversized structural items (such as sofas, sectionals, and solid wood dining tables) are dispatched through our dedicated two-person white-glove transport partners. Our team contacts you in advance to schedule a 3-hour delivery window, carries the piece into your room of choice, unboxes, inspects, and removes all protective debris.
            </p>
          </div>
        </section>

        {/* Returns Section */}
        <section className="space-y-6 border-t border-border pt-12">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
              <RotateCcw className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-light tracking-tight">7-Day Hassle-Free Returns</h2>
          </div>

          <div className="prose dark:prose-invert max-w-none text-sm text-muted-foreground font-light space-y-4 leading-relaxed">
            <p>
              We want you to love living with your Shopora pieces. If an item doesn&apos;t suit your space as envisioned, you may request a return within <strong>7 calendar days</strong> from the delivery timestamp.
            </p>
            <h4 className="text-foreground font-medium text-base pt-2">Return Conditions</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li>Item must be in like-new, unused condition without scuffs, stains, or structural alterations.</li>
              <li>Original branded packaging, hardware packs, and certification certificates must be preserved.</li>
              <li>Custom commissioned upholstery or bespoke sizing are final sale unless damaged during transport.</li>
            </ul>
            <h4 className="text-foreground font-medium text-base pt-2">How to Request a Return</h4>
            <p>
              Log in to your account, navigate to <strong>My Orders</strong>, select the relevant order, and click &ldquo;Request Return&rdquo;. Alternatively, email our concierge team at <strong className="text-foreground">care@shopora.com</strong> with your order number and photo documentation.
            </p>
          </div>
        </section>

        {/* Damaged in Transit */}
        <section className="p-8 rounded-2xl bg-card border border-border flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-lg font-semibold">Received a Damaged or Defective Item?</h3>
            <p className="text-sm text-muted-foreground font-light max-w-lg">
              Every shipment is transit-insured. If your piece arrives with external or structural damage, report it within 48 hours for immediate prioritized replacement at zero expense.
            </p>
          </div>
          <Button asChild className="rounded-none tracking-widest uppercase text-xs h-11 px-6 shrink-0">
            <Link href="/contact">
              Report Issue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </section>
      </div>
    </div>
  );
}
