import { Metadata } from "next";
import { FAQClient } from "./faq-client";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Shopora",
  description: "Find answers regarding shipping times, returns, payment security, and furniture care at Shopora.",
};

export default function FAQPage() {
  return (
    <div className="bg-background min-h-screen pb-24">
      {/* Banner */}
      <div className="bg-secondary/40 py-16 md:py-24 border-b border-border text-center px-4 mb-12">
        <h1 className="text-3xl md:text-5xl font-light tracking-tight mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto font-light leading-relaxed text-sm md:text-base">
          Quick answers to commonly asked questions about our pieces, fulfillment timelines, return guarantees, and materials.
        </p>
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        <FAQClient />
      </div>
    </div>
  );
}
