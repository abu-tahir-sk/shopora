"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash2, Edit2, Power, Loader2 } from "lucide-react";
import { deleteCoupon, toggleCouponStatus } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CouponActionsProps {
  coupon: {
    id: string;
    code: string;
    isActive: boolean;
  };
}

export function CouponActions({ coupon }: CouponActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    const nextState = !coupon.isActive;
    const res = await toggleCouponStatus(coupon.id, nextState);
    setIsToggling(false);

    if (res.success) {
      toast.success(
        nextState
          ? `Coupon ${coupon.code} activated`
          : `Coupon ${coupon.code} deactivated`
      );
      router.refresh();
    } else {
      toast.error(res.error || "Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to permanently delete coupon "${coupon.code}"?`)) {
      return;
    }

    setIsDeleting(true);
    const res = await deleteCoupon(coupon.id);
    setIsDeleting(false);

    if (res.success) {
      toast.success(`Coupon ${coupon.code} deleted`);
      router.refresh();
    } else {
      toast.error(res.error || "Failed to delete coupon");
    }
  };

  return (
    <div className="flex items-center justify-end gap-1.5">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        disabled={isToggling}
        title={coupon.isActive ? "Deactivate Coupon" : "Activate Coupon"}
        className={coupon.isActive ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10" : "text-muted-foreground hover:bg-muted"}
      >
        {isToggling ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Power className="h-4 w-4" />
        )}
      </Button>

      <Button asChild variant="outline" size="sm" className="h-8 px-2.5">
        <Link href={`/admin/coupons/${coupon.id}/edit`}>
          <Edit2 className="h-3.5 w-3.5 mr-1" />
          Edit
        </Link>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        disabled={isDeleting}
        title="Delete Coupon"
        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
      >
        {isDeleting ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Trash2 className="h-3.5 w-3.5" />
        )}
      </Button>
    </div>
  );
}

