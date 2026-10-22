"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cancelOrderAction } from "@/app/actions/orders";
import { toast } from "sonner";

interface CancelOrderButtonProps {
  orderId: string;
  orderNumber: string;
}

export function CancelOrderButton({ orderId, orderNumber }: CancelOrderButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");

  const handleCancel = async () => {
    setLoading(true);
    try {
      const res = await cancelOrderAction(orderId, reason);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(`Order #${orderNumber} has been successfully cancelled.`);
        setOpen(false);
        router.refresh();
      }
    } catch {
      toast.error("Failed to cancel order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-xs text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30 gap-1.5"
          >
            <XCircle className="h-3.5 w-3.5" />
            Cancel Order
          </Button>
        }
      />

      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-2">
          <div className="h-10 w-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-1">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <DialogTitle className="text-xl font-medium">
            Cancel Order #{orderNumber}?
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
            Are you sure you want to cancel this order? This action will immediately release your reserved items back into inventory and initiate any applicable refunds.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Reason for Cancellation (Optional)
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full text-sm rounded-xl border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Select a reason</option>
            <option value="Changed my mind">Changed my mind</option>
            <option value="Placed order by mistake">Placed order by mistake</option>
            <option value="Found a better price elsewhere">Found a better price elsewhere</option>
            <option value="Need to change shipping address or items">Need to change shipping address or items</option>
            <option value="Delivery time is too long">Delivery time is too long</option>
            <option value="Other">Other reason</option>
          </select>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Keep Order
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleCancel}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Cancellation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
