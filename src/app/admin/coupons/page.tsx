import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AdminCouponsPage() {
  const coupons = await db.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Coupons</h1>
        <Button asChild>
          <Link href="/admin/coupons/new">Create Coupon</Link>
        </Button>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary/50 text-muted-foreground uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Code</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium">Value</th>
              <th className="px-6 py-4 font-medium">Usage</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-secondary/10 transition-colors">
                <td className="px-6 py-4 font-medium tracking-widest">{coupon.code}</td>
                <td className="px-6 py-4">{coupon.discountType}</td>
                <td className="px-6 py-4">
                  {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                </td>
                <td className="px-6 py-4">
                  {coupon.usedCount} / {coupon.usageLimit ? coupon.usageLimit : "∞"}
                </td>
                <td className="px-6 py-4">
                  {coupon.isActive && (!coupon.expiresAt || new Date(coupon.expiresAt) > new Date()) ? (
                    <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs">Active</span>
                  ) : (
                    <span className="text-red-600 bg-red-50 px-2 py-1 rounded text-xs">Inactive/Expired</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/coupons/${coupon.id}/edit`}>Edit</Link>
                  </Button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                  No coupons found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
