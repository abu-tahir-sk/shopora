"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FAQItem {
  q: string;
  a: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: "Orders & Shipping",
    q: "How long does delivery take?",
    a: "Standard delivery for smaller decor and lighting pieces typically takes 3-5 business days. Heavy architectural furniture pieces (like sofas and solid wood dining tables) are shipped via white-glove logistics and take 7-12 business days, including scheduled room placement and unboxing.",
  },
  {
    category: "Orders & Shipping",
    q: "Do you offer free shipping?",
    a: "Yes! All orders over ₹9,999 qualify for complimentary standard shipping across India. For orders below this threshold, a flat delivery fee of ₹250 is applied at checkout.",
  },
  {
    category: "Orders & Shipping",
    q: "How can I track my order status?",
    a: "As soon as your pieces are dispatched, you will receive an SMS and email notification with your tracking link. You can also view live delivery status by visiting the 'My Orders' section in your account profile.",
  },
  {
    category: "Returns & Exchanges",
    q: "What is your return policy?",
    a: "We offer a 7-day hassle-free return policy from the date of delivery. If you are not completely satisfied with your purchase, the item must be in its original condition and packaging. Simply initiate a return from your profile or contact our concierge team.",
  },
  {
    category: "Returns & Exchanges",
    q: "How long do refunds take to process?",
    a: "Once the returned piece is inspected and checked into our fulfillment center, refunds are initiated within 48 hours to your original payment method. For Cash on Delivery orders, we provide instant bank transfer or store credit.",
  },
  {
    category: "Payments & Security",
    q: "What payment methods are supported?",
    a: "We accept all major Credit and Debit Cards (Visa, MasterCard, RuPay, Amex), UPI (Google Pay, PhonePe, Paytm), Net Banking across 50+ banks, and Cash on Delivery (COD) for eligible pin codes.",
  },
  {
    category: "Payments & Security",
    q: "Is my payment information secure?",
    a: "Completely. All digital payments are processed through Razorpay's PCI-DSS Level 1 compliant gateway with 256-bit bank-grade SSL encryption. We never store your card numbers or CVV on our servers.",
  },
  {
    category: "Product Care & Warranty",
    q: "Do your furniture pieces come with a warranty?",
    a: "Yes. All structural wooden furniture and metal frames carry a 3-year structural warranty against manufacturing defects. Upholstery fabrics and lighting electrical components are covered under a 1-year limited warranty.",
  },
  {
    category: "Product Care & Warranty",
    q: "How do I care for solid wood and natural stone pieces?",
    a: "Avoid placing furniture in direct harsh sunlight or directly beside heating radiators. Wipe surfaces with a lightly damp microfiber cloth and dry immediately. For honed marble, promptly blot spills (especially wine or citrus) to preserve the sealant.",
  },
];

export function FAQClient() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Orders & Shipping", "Returns & Exchanges", "Payments & Security", "Product Care & Warranty"];

  const filteredFaqs = activeCategory === "All"
    ? faqs
    : faqs.filter((f) => f.category === activeCategory);

  return (
    <div className="space-y-12">
      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setOpenIndex(null);
            }}
            className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-medium transition-all ${
              activeCategory === cat
                ? "bg-foreground text-background shadow-sm"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion Questions */}
      <div className="max-w-3xl mx-auto divide-y divide-border border-y border-border">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={faq.q} className="py-5">
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between text-left font-medium text-base text-foreground hover:text-brand transition-colors gap-4"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 transition-transform duration-300 text-muted-foreground ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="mt-3 text-sm text-muted-foreground font-light leading-relaxed pr-8 animate-in fade-in slide-in-from-top-1 duration-200">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still need help CTA */}
      <div className="max-w-xl mx-auto p-8 rounded-2xl bg-secondary/30 border border-border text-center space-y-4">
        <HelpCircle className="h-8 w-8 text-brand mx-auto" />
        <h3 className="text-xl font-light">Still have questions?</h3>
        <p className="text-sm text-muted-foreground font-light">
          Cannot find what you&apos;re looking for? Our design concierge is available Monday through Saturday.
        </p>
        <Button asChild className="rounded-none tracking-widest uppercase text-xs h-11 px-6">
          <Link href="/contact">
            Contact Support
            <ArrowRight className="h-3.5 w-3.5 ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
