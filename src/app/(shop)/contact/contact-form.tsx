"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    orderNumber: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Thank you! Your message has been sent to our concierge team.");
    }, 1000);
  };

  if (submitted) {
    return (
      <div className="p-8 rounded-2xl bg-secondary/40 border border-border text-center space-y-4">
        <h3 className="text-xl font-medium">Message Received</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Thank you for reaching out, <strong className="text-foreground">{formData.name}</strong>. Our customer care team will review your inquiry and respond to <strong className="text-foreground">{formData.email}</strong> within 24 hours.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setSubmitted(false);
            setFormData({ name: "", email: "", orderNumber: "", subject: "", message: "" });
          }}
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Your Name *
          </label>
          <Input
            placeholder="Jane Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Email Address *
          </label>
          <Input
            type="email"
            placeholder="jane@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={loading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Subject *
          </label>
          <Input
            placeholder="Order inquiry, design advice..."
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            required
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Order Number (Optional)
          </label>
          <Input
            placeholder="#ORD-XXXX"
            value={formData.orderNumber}
            onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Your Message *
        </label>
        <textarea
          rows={5}
          placeholder="How can our concierge team assist you today?"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
          disabled={loading}
          className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <Button type="submit" size="lg" className="w-full rounded-xl tracking-widest uppercase text-xs" disabled={loading}>
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <Send className="h-4 w-4 mr-2" />
        )}
        Submit Inquiry
      </Button>
    </form>
  );
}
