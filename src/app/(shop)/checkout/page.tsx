import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { CheckoutClient } from "./checkout-client";

export const metadata: Metadata = {
  title: "Checkout | Shopora",
  description: "Secure checkout and order payment",
};

export default async function CheckoutPage() {
  const session = await auth();

  let savedAddresses: Array<{
    id: string;
    label: string | null;
    street: string;
    city: string;
    state: string;
    country: string;
    pinCode: string;
    phone: string;
    isDefault: boolean;
  }> = [];

  if (session?.user?.id) {
    savedAddresses = await db.address.findMany({
      where: { userId: session.user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        label: true,
        street: true,
        city: true,
        state: true,
        country: true,
        pinCode: true,
        phone: true,
        isDefault: true,
      },
    });
  }

  return (
    <div className="bg-background min-h-screen pt-8 pb-24">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <h1 className="text-3xl font-light tracking-tight mb-8">Checkout</h1>
        <CheckoutClient savedAddresses={savedAddresses} />
      </div>
    </div>
  );
}
