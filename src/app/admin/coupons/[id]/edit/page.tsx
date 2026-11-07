import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { EditCouponForm } from "./edit-form";

export const metadata = {
  title: "Edit Coupon | Admin",
};

interface EditCouponPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCouponPage({ params }: EditCouponPageProps) {
  const { id } = await params;

  const coupon = await db.coupon.findUnique({
    where: { id },
  });

  if (!coupon) {
    notFound();
  }

  return (
    <div>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold mb-8">Edit Coupon: {coupon.code}</h1>
        <EditCouponForm coupon={coupon} />
      </div>
    </div>
  );
}

