"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateCoupon } from "../../actions";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

interface CouponData {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";
  discountValue: number;
  minOrderAmount: number | null;
  maxDiscount: number | null;
  usageLimit: number | null;
  usedCount: number;
  isActive: boolean;
  expiresAt: Date | null;
}

export function EditCouponForm({ coupon }: { coupon: CouponData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formattedDate = coupon.expiresAt
    ? new Date(coupon.expiresAt).toISOString().split("T")[0]
    : "";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const res = await updateCoupon(coupon.id, {
      ...data,
      isActive: data.isActive === "on",
    });

    if (res.success) {
      toast.success("Coupon updated successfully");
      router.push("/admin/coupons");
      router.refresh();
    } else {
      setError(res.error || "Failed to update coupon");
      toast.error(res.error || "Failed to update coupon");
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild className="gap-1.5">
          <Link href="/admin/coupons">
            <ArrowLeft className="h-4 w-4" />
            Back to Coupons
          </Link>
        </Button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded mb-6 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg border border-border">
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Coupon Code</label>
            <input
              name="code"
              defaultValue={coupon.code}
              required
              className="border border-border p-2 bg-background rounded uppercase"
              placeholder="e.g. SUMMER20"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Discount Type</label>
            <select
              name="discountType"
              defaultValue={coupon.discountType}
              className="border border-border p-2 bg-background rounded"
            >
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="FIXED">Fixed Amount (₹)</option>
              <option value="FREE_SHIPPING">Free Shipping</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Discount Value</label>
            <input
              name="discountValue"
              type="number"
              step="0.01"
              defaultValue={coupon.discountValue}
              required
              className="border border-border p-2 bg-background rounded"
              placeholder="e.g. 20"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Max Uses (Optional)</label>
            <input
              name="usageLimit"
              type="number"
              defaultValue={coupon.usageLimit ?? ""}
              className="border border-border p-2 bg-background rounded"
              placeholder="e.g. 100"
            />
            <span className="text-xs text-muted-foreground">Used {coupon.usedCount} times</span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Min Order Amount (Optional)</label>
            <input
              name="minOrderAmount"
              type="number"
              step="0.01"
              defaultValue={coupon.minOrderAmount ?? ""}
              className="border border-border p-2 bg-background rounded"
              placeholder="e.g. 1500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Max Discount Amount (Optional)</label>
            <input
              name="maxDiscount"
              type="number"
              step="0.01"
              defaultValue={coupon.maxDiscount ?? ""}
              className="border border-border p-2 bg-background rounded"
              placeholder="e.g. 500"
            />
          </div>

          <div className="flex flex-col gap-2 col-span-2">
            <label className="text-sm font-medium">Expiration Date (Optional)</label>
            <input
              name="expiresAt"
              type="date"
              defaultValue={formattedDate}
              className="border border-border p-2 bg-background rounded"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <input
            type="checkbox"
            name="isActive"
            id="isActive"
            defaultChecked={coupon.isActive}
            className="h-4 w-4"
          />
          <label htmlFor="isActive" className="text-sm font-medium cursor-pointer">
            Active (Available for checkout)
          </label>
        </div>

        <div className="flex gap-4 pt-4 border-t border-border">
          <Button type="submit" disabled={loading} className="gap-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Saving..." : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/coupons")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

