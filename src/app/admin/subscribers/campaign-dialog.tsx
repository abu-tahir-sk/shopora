"use client";

import { useState } from "react";
import { Send, Loader2, Sparkles, Megaphone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { sendCustomCampaign } from "./actions";

export function CampaignDialog({ subscriberCount }: { subscriberCount: number }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    subject: "",
    headline: "",
    message: "",
    ctaText: "Explore Collection",
    ctaUrl: "/products",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.subject || !form.headline || !form.message) {
      toast.error("Please fill in the subject, headline, and message.");
      return;
    }

    if (subscriberCount === 0) {
      toast.error("There are no subscribers to send this email to.");
      return;
    }

    if (!confirm(`Are you sure you want to send this email to all ${subscriberCount} subscriber(s)?`)) {
      return;
    }

    setLoading(true);
    try {
      const res = await sendCustomCampaign(form);
      if (res.success) {
        toast.success("message" in res ? res.message : "Campaign sent to all subscribers successfully!");
        setOpen(false);
        setForm({
          subject: "",
          headline: "",
          message: "",
          ctaText: "Explore Collection",
          ctaUrl: "/products",
        });
      } else {
        toast.error("error" in res ? String(res.error) : "Failed to send campaign");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="h-10 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Megaphone className="h-4 w-4 mr-1.5" />
        Send Campaign Email
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-primary" />
              Send Newsletter Broadcast
            </DialogTitle>
            <DialogDescription>
              Broadcast an announcement, seasonal greeting, or special offer to all{" "}
              <strong>{subscriberCount}</strong> subscribers.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email Subject Line *
              </label>
              <Input
                placeholder="e.g. ✨ Weekend Flash Sale: 20% Off Everything!"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Main Headline *
              </label>
              <Input
                placeholder="e.g. Exclusive Weekend Treat Just For You"
                value={form.headline}
                onChange={(e) => setForm({ ...form, headline: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Message Body *
              </label>
              <textarea
                placeholder="Write your email announcement or offer details here..."
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Button Text (Optional)
                </label>
                <Input
                  placeholder="e.g. Shop The Sale"
                  value={form.ctaText}
                  onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Button Link (Optional)
                </label>
                <Input
                  placeholder="e.g. /products or https://..."
                  value={form.ctaUrl}
                  onChange={(e) => setForm({ ...form, ctaUrl: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter className="pt-3">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send to {subscriberCount} Subscribers
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

