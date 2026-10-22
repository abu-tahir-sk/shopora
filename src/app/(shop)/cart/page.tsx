import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { CartClient } from "./cart-client";

export const metadata: Metadata = {
  title: "Shopping Cart | Shopora",
  description: "View and manage items in your shopping cart before checkout.",
};

export default async function CartPage() {
  const session = await auth();

  return (
    <div className="bg-background min-h-screen py-10 pb-24">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-8">
          Shopping Cart
        </h1>
        <CartClient isLoggedIn={!!session?.user} />
      </div>
    </div>
  );
}
