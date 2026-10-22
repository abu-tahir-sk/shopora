import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Shopora",
  description: "Learn how Shopora collects, protects, and handles your personal information with absolute integrity.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-background min-h-screen py-16 pb-24">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-light tracking-tight mb-3">Privacy Policy</h1>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Last updated: October 2026</p>
        </div>

        <div className="prose dark:prose-invert max-w-none text-sm text-muted-foreground font-light space-y-6 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-foreground text-xl font-medium">1. Information We Collect</h2>
            <p>
              We collect information you directly provide when creating an account, browsing collections, configuring delivery addresses, placing orders, or contacting our concierge service. This includes your name, email, phone number, shipping address, and order transaction history.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-xl font-medium">2. How We Use Your Data</h2>
            <p>
              Your data is solely used to:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Process and fulfill your furniture orders and coordinate delivery logistics.</li>
              <li>Send critical transactional emails (order confirmations, dispatch updates, invoices).</li>
              <li>Provide personalized customer support and verify account security.</li>
              <li>Improve site performance and prevent fraudulent transactions.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-xl font-medium">3. Payment Security & Data Sharing</h2>
            <p>
              We <strong>NEVER</strong> sell or rent your personal data to third-party advertisers. Payment card data is processed directly via PCI-compliant encryption through our gateway partner (Razorpay) and is never accessible on our internal servers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-xl font-medium">4. Cookies & Preferences</h2>
            <p>
              We use functional session cookies to remember your cart items, authentication session, and visual theme preference (Dark or Light mode). You may adjust browser cookie settings at any time.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-xl font-medium">5. Contact Our Data Officer</h2>
            <p>
              If you wish to view, update, or request permanent erasure of your personal data, contact us directly at <strong className="text-foreground">privacy@shopora.com</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
