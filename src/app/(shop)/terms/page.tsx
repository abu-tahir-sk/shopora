import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Shopora",
  description: "Terms and conditions governing the use of Shopora's website, products, and services.",
};

export default function TermsPage() {
  return (
    <div className="bg-background min-h-screen py-16 pb-24">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-light tracking-tight mb-3">Terms of Service</h1>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Last updated: October 2026</p>
        </div>

        <div className="prose dark:prose-invert max-w-none text-sm text-muted-foreground font-light space-y-6 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-foreground text-xl font-medium">1. Agreement to Terms</h2>
            <p>
              By accessing and using the Shopora website (shopora.com) or purchasing products from us, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please discontinue use of our site immediately.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-xl font-medium">2. Products & Pricing</h2>
            <p>
              We make every effort to display the colors, materials, and textures of our furnishings as accurately as possible. However, due to monitor color calibration and the organic nature of natural solid hardwoods, marble veining, and hand-woven textiles, slight variations may occur and are celebrated as hallmarks of authenticity.
            </p>
            <p>
              All prices are listed in Indian Rupees (INR) and include applicable Goods and Services Tax (GST) unless explicitly noted otherwise. Prices are subject to adjustment without prior notice.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-xl font-medium">3. Orders & Payment</h2>
            <p>
              When placing an order, you agree that all provided information is accurate and authorized. We reserve the right to cancel or limit quantities on any order suspected of fraudulent activity or unauthorized reseller exploitation. Payments must be verified before dispatch.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-xl font-medium">4. Intellectual Property</h2>
            <p>
              All site content, including brand trademarks, photography, product silhouettes, graphic designs, code, and editorial copy, is the exclusive intellectual property of Shopora and protected under Indian and international copyright treaties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-xl font-medium">5. Governing Law</h2>
            <p>
              These Terms shall be interpreted and governed in accordance with the laws of India. Any legal disputes arising in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts in Mumbai, Maharashtra.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
