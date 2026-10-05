"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCoupon } from "../actions";

export default function NewCouponPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const res = await createCoupon({
      ...data,
      isActive: data.isActive === "on",
    });

    if (res.success) {
      router.push("/admin/coupons");
    } else {
      setError(res.error || "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold mb-8">Create New Coupon</h1>
        
        {error && <div className="bg-red-50 text-red-600 p-4 rounded mb-6 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg border border-border">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Coupon Code</label>
              <input name="code" required className="border border-border p-2 bg-background rounded" placeholder="e.g. SUMMER20" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Discount Type</label>
              <select name="discountType" className="border border-border p-2 bg-background rounded">
                <option value="PERCENTAGE">Percentage</option>
                <option value="FIXED">Fixed Amount</option>
                <option value="FREE_SHIPPING">Free Shipping</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Discount Value</label>
              <input name="discountValue" type="number" step="0.01" required className="border border-border p-2 bg-background rounded" placeholder="e.g. 20" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Max Uses (Optional)</label>
              <input name="usageLimit" type="number" className="border border-border p-2 bg-background rounded" placeholder="e.g. 100" />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Min Order Amount (Optional)</label>
              <input name="minOrderAmount" type="number" step="0.01" className="border border-border p-2 bg-background rounded" placeholder="e.g. 1500" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Max Discount Amount (Optional)</label>
              <input name="maxDiscount" type="number" step="0.01" className="border border-border p-2 bg-background rounded" placeholder="e.g. 500" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Expiration Date (Optional)</label>
              <input name="expiresAt" type="date" className="border border-border p-2 bg-background rounded" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" name="isActive" id="isActive" defaultChecked />
            <label htmlFor="isActive" className="text-sm font-medium">Active</label>
          </div>

          <div className="flex gap-4 pt-4 border-t border-border">
            <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Coupon"}</Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
