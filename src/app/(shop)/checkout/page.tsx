import { Metadata } from "next";
import Head from "next/head";
import { CheckoutClient } from "./checkout-client";

export const metadata: Metadata = {
  title: "Checkout | Shopora",
  description: "Secure checkout",
};

export default function CheckoutPage() {
  return (
    <div className="bg-background min-h-screen pt-8 pb-24">
      <Head><script src="https://checkout.razorpay.com/v1/checkout.js" async></script></Head>
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <h1 className="text-3xl font-light tracking-tight mb-8">Checkout</h1>
        <CheckoutClient />
      </div>
    </div>
  );
}
