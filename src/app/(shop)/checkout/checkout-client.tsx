"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Loader2,
  CheckCircle2,
  MapPin,
  Plus,
  CreditCard,
  Banknote,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  Home,
  Briefcase,
  AlertCircle,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/store/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { validateCoupon } from "@/app/actions/coupon";

interface SavedAddress {
  id: string;
  label: string | null;
  street: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  phone: string;
  isDefault: boolean;
}

interface CheckoutClientProps {
  savedAddresses?: SavedAddress[];
}

export function CheckoutClient({ savedAddresses = [] }: CheckoutClientProps) {
  const { items, totalPrice, clearCart } = useCart();
  const { data: session, status } = useSession();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Address selection mode: "saved" | "new"
  const defaultSaved = savedAddresses.find((a) => a.isDefault) || savedAddresses[0];
  const [useSavedAddress, setUseSavedAddress] = useState<boolean>(savedAddresses.length > 0);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(defaultSaved?.id || "");

  // New Address Form fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pinCode: "",
    label: "Home",
  });
  const [saveAddressToProfile, setSaveAddressToProfile] = useState(true);

  // Payment Method: "ONLINE" | "COD" | "DEMO"
  const [paymentMethod, setPaymentMethod] = useState<"ONLINE" | "COD" | "DEMO">("ONLINE");

  // Coupon
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    discountType: string;
  } | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (session?.user) {
      const parts = session.user.name?.split(" ") || ["", ""];
      setFormData((prev) => ({
        ...prev,
        firstName: parts[0] || "",
        lastName: parts.slice(1).join(" ") || "",
        email: session.user.email || "",
      }));
    }
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    const res = await validateCoupon(couponCode, totalPrice());
    setIsApplyingCoupon(false);

    if (res.success) {
      toast.success("Coupon applied!");
      setAppliedCoupon({
        code: res.code as string,
        discountAmount: res.discountAmount as number,
        discountType: res.discountType as string,
      });
      setCouponCode("");
    } else {
      toast.error(res.error || "Invalid coupon");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.info("Coupon removed");
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (status === "unauthenticated") {
      toast.error("Please login to proceed with checkout");
      router.push("/login?callbackUrl=/checkout");
      return;
    }

    setIsProcessing(true);

    try {
      // Prepare payload
      const payload: any = {
        items,
        couponCode: appliedCoupon?.code,
        paymentMethod: paymentMethod === "DEMO" ? "ONLINE" : paymentMethod,
      };

      if (useSavedAddress && selectedAddressId) {
        payload.shippingAddressId = selectedAddressId;
      } else {
        payload.shippingAddress = {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pinCode: formData.pinCode,
          phone: formData.phone,
          label: formData.label,
        };
        payload.saveAddressToProfile = saveAddressToProfile;
      }

      // 1. Create Order
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      // Handle Cash On Delivery (COD)
      if (paymentMethod === "COD") {
        toast.success("Order placed successfully with Cash on Delivery!");
        clearCart();
        router.push(`/order/success?id=${data.orderId}`);
        return;
      }

      // Handle Demo / Test 1-Click Pay
      if (paymentMethod === "DEMO") {
        toast.info("Processing Demo Payment...");
        const verifyRes = await fetch("/api/checkout/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: data.orderId,
            razorpay_order_id: data.razorpayOrderId,
            razorpay_payment_id: `demo_pay_${Date.now()}`,
            isMock: true,
          }),
        });

        if (verifyRes.ok) {
          toast.success("Demo payment verified successfully!");
          clearCart();
          router.push(`/order/success?id=${data.orderId}`);
        } else {
          toast.error("Demo payment verification failed");
        }
        return;
      }

      // Handle Online Payment via Razorpay
      const options = {
        key: data.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mock",
        amount: data.amount,
        currency: "INR",
        name: "Shopora",
        description: `Order #${data.orderNumber}`,
        order_id: data.razorpayOrderId,
        handler: async function (response: any) {
          toast.info("Verifying payment...");
          const verifyRes = await fetch("/api/checkout/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              orderId: data.orderId,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyRes.ok) {
            toast.success("Payment verified successfully!");
            clearCart();
            router.push(`/order/success?id=${data.orderId}`);
          } else {
            toast.error(verifyData.error || "Payment verification failed");
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#A38C6D",
        },
      };

      if (typeof window !== "undefined" && (window as any).Razorpay) {
        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", function () {
          toast.error("Payment failed or was cancelled. Please try again.");
          setIsProcessing(false);
        });
        rzp.open();
      } else {
        // Fallback: If Razorpay SDK not available or test mode
        toast.info("Razorpay modal unavailable; verifying simulated order...");
        const verifyRes = await fetch("/api/checkout/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: data.orderId,
            razorpay_order_id: data.razorpayOrderId,
            razorpay_payment_id: `sim_pay_${Date.now()}`,
            isMock: true,
          }),
        });

        if (verifyRes.ok) {
          toast.success("Order confirmed!");
          clearCart();
          router.push(`/order/success?id=${data.orderId}`);
        } else {
          toast.error("Failed to confirm order.");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred during checkout");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
        <p className="text-xs text-muted-foreground uppercase tracking-widest">Loading checkout...</p>
      </div>
    );
  }

  const subtotal = totalPrice();
  let shipping = subtotal > 9999 ? 0 : 99; // Free shipping over 9999
  if (appliedCoupon?.discountType === "FREE_SHIPPING") {
    shipping = 0;
  }

  let total = subtotal + shipping - (appliedCoupon?.discountAmount || 0);
  if (total < 0) total = 0;

  if (items.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center border border-border rounded-2xl bg-card p-12 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mb-4" />
        <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
        <p className="text-xs text-muted-foreground mb-6 max-w-sm">
          Please add items to your cart before proceeding to checkout.
        </p>
        <Button asChild className="rounded-full px-8 text-xs uppercase tracking-widest font-medium">
          <Link href="/products">Browse Collection</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-10 relative">
      {/* Left side: Form */}
      <div className="w-full lg:w-3/5 space-y-8">
        <form id="checkout-form" onSubmit={handleCheckout} className="space-y-8">
          {/* Step 1: Contact Information */}
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-2">
              <h2 className="text-lg font-medium tracking-tight flex items-center gap-2">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-brand/10 text-brand text-xs font-semibold">
                  1
                </span>
                Contact Information
              </h2>
              {session?.user && (
                <span className="text-xs text-muted-foreground">Logged in as {session.user.email}</span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-xs uppercase tracking-wider font-medium text-foreground/80">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  placeholder="Eleanor"
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-xs uppercase tracking-wider font-medium text-foreground/80">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  placeholder="Vance"
                  className="rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs uppercase tracking-wider font-medium text-foreground/80">
                  Email (Order Confirmation)
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="you@domain.com"
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs uppercase tracking-wider font-medium text-foreground/80">
                  Phone (Delivery Tracking)
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required={!useSavedAddress}
                  placeholder="+91 98765 43210"
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Shipping Destination */}
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-2">
              <h2 className="text-lg font-medium tracking-tight flex items-center gap-2">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-brand/10 text-brand text-xs font-semibold">
                  2
                </span>
                Shipping Address
              </h2>
              {savedAddresses.length > 0 && (
                <button
                  type="button"
                  onClick={() => setUseSavedAddress(!useSavedAddress)}
                  className="text-xs text-brand hover:underline font-medium flex items-center gap-1"
                >
                  {useSavedAddress ? "+ Enter New Address" : "Choose Saved Address"}
                </button>
              )}
            </div>

            {/* If using saved addresses */}
            {useSavedAddress && savedAddresses.length > 0 ? (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">Select a saved delivery address from your account:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedAddresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={cn(
                          "cursor-pointer rounded-xl border p-4 transition-all relative flex flex-col justify-between",
                          isSelected
                            ? "border-brand bg-brand/5 shadow-sm"
                            : "border-border hover:border-brand/40 bg-background"
                        )}
                      >
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-semibold text-sm flex items-center gap-1.5">
                              {addr.label === "Office" ? (
                                <Briefcase className="h-3.5 w-3.5 text-brand" />
                              ) : (
                                <Home className="h-3.5 w-3.5 text-brand" />
                              )}
                              {addr.label || "Home"}
                            </span>
                            {addr.isDefault && (
                              <span className="text-[10px] uppercase tracking-wider font-semibold bg-brand text-brand-foreground px-2 py-0.5 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-foreground/90 font-medium">{addr.street}</p>
                          <p className="text-muted-foreground">
                            {addr.city}, {addr.state} - {addr.pinCode}
                          </p>
                          <p className="text-muted-foreground pt-1">Phone: {addr.phone}</p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between">
                          <span className="text-[11px] font-medium text-brand">
                            {isSelected ? "Selected Destination" : "Select this address"}
                          </span>
                          <div
                            className={cn(
                              "h-4 w-4 rounded-full border flex items-center justify-center",
                              isSelected ? "border-brand bg-brand text-brand-foreground" : "border-border"
                            )}
                          >
                            {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* New Address Input */
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="street" className="text-xs uppercase tracking-wider font-medium text-foreground/80">
                    Street Address / Flat / Building
                  </Label>
                  <Input
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    required={!useSavedAddress}
                    placeholder="e.g. 104 Willow Woods, MG Road"
                    className="rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="city" className="text-xs uppercase tracking-wider font-medium text-foreground/80">
                      City
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required={!useSavedAddress}
                      placeholder="Mumbai"
                      className="rounded-lg"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="state" className="text-xs uppercase tracking-wider font-medium text-foreground/80">
                      State
                    </Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required={!useSavedAddress}
                      placeholder="Maharashtra"
                      className="rounded-lg"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="pinCode" className="text-xs uppercase tracking-wider font-medium text-foreground/80">
                      PIN Code
                    </Label>
                    <Input
                      id="pinCode"
                      name="pinCode"
                      value={formData.pinCode}
                      onChange={handleInputChange}
                      required={!useSavedAddress}
                      placeholder="400001"
                      className="rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="saveAddressCheckbox"
                    checked={saveAddressToProfile}
                    onChange={(e) => setSaveAddressToProfile(e.target.checked)}
                    className="rounded border-border text-brand focus:ring-brand"
                  />
                  <label htmlFor="saveAddressCheckbox" className="text-xs font-medium cursor-pointer">
                    Save this address to my profile address book
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Payment Method Selection */}
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-2">
              <h2 className="text-lg font-medium tracking-tight flex items-center gap-2">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-brand/10 text-brand text-xs font-semibold">
                  3
                </span>
                Payment Options
              </h2>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> 100% Encrypted
              </span>
            </div>

            <div className="space-y-3">
              {/* Option 1: Razorpay Online */}
              <div
                onClick={() => setPaymentMethod("ONLINE")}
                className={cn(
                  "cursor-pointer rounded-xl border p-4 transition-all flex items-start gap-4",
                  paymentMethod === "ONLINE"
                    ? "border-brand bg-brand/5 shadow-sm"
                    : "border-border hover:border-brand/40 bg-background"
                )}
              >
                <div className="mt-0.5">
                  <div
                    className={cn(
                      "h-4 w-4 rounded-full border flex items-center justify-center",
                      paymentMethod === "ONLINE" ? "border-brand bg-brand text-brand-foreground" : "border-border"
                    )}
                  >
                    {paymentMethod === "ONLINE" && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </div>
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-brand" /> Online Payment (UPI, Cards, NetBanking)
                    </span>
                    <Badge variant="outline" className="text-[10px] text-brand border-brand/30">
                      Recommended
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Pay securely using Google Pay, PhonePe, Paytm, Visa, Mastercard, RuPay, or NetBanking via Razorpay.
                  </p>
                </div>
              </div>

              {/* Option 2: Cash on Delivery (COD) */}
              <div
                onClick={() => setPaymentMethod("COD")}
                className={cn(
                  "cursor-pointer rounded-xl border p-4 transition-all flex items-start gap-4",
                  paymentMethod === "COD"
                    ? "border-brand bg-brand/5 shadow-sm"
                    : "border-border hover:border-brand/40 bg-background"
                )}
              >
                <div className="mt-0.5">
                  <div
                    className={cn(
                      "h-4 w-4 rounded-full border flex items-center justify-center",
                      paymentMethod === "COD" ? "border-brand bg-brand text-brand-foreground" : "border-border"
                    )}
                  >
                    {paymentMethod === "COD" && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </div>
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold flex items-center gap-2">
                      <Banknote className="h-4 w-4 text-brand" /> Cash On Delivery (COD)
                    </span>
                    <Badge variant="secondary" className="text-[10px]">
                      Pay at Doorstep
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Pay with Cash or UPI QR to the delivery executive when your package arrives.
                  </p>
                </div>
              </div>

              {/* Option 3: Demo / Fast Test Checkout */}
              <div
                onClick={() => setPaymentMethod("DEMO")}
                className={cn(
                  "cursor-pointer rounded-xl border p-4 transition-all flex items-start gap-4 border-dashed",
                  paymentMethod === "DEMO"
                    ? "border-brand bg-brand/5 shadow-sm"
                    : "border-border hover:border-brand/40 bg-background"
                )}
              >
                <div className="mt-0.5">
                  <div
                    className={cn(
                      "h-4 w-4 rounded-full border flex items-center justify-center",
                      paymentMethod === "DEMO" ? "border-brand bg-brand text-brand-foreground" : "border-border"
                    )}
                  >
                    {paymentMethod === "DEMO" && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </div>
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold flex items-center gap-2 text-foreground/90">
                      <Zap className="h-4 w-4 text-amber-500" /> Instant Demo / Test Pay
                    </span>
                    <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-300">
                      Development Mode
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Simulates instant verified payment without opening real bank portals. Ideal for quick testing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Right side: Sticky Order Summary */}
      <div className="w-full lg:w-2/5">
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 sticky top-24 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <h2 className="text-lg font-medium tracking-tight">Order Summary</h2>
            <span className="text-xs text-muted-foreground">
              {items.reduce((acc, i) => acc + i.quantity, 0)} {items.length === 1 ? "Item" : "Items"}
            </span>
          </div>

          {/* Items List */}
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3.5 py-1.5">
                <div className="h-16 w-16 bg-secondary relative rounded-lg overflow-hidden shrink-0 border border-border/60">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                  <span className="absolute bottom-1 right-1 bg-background/90 text-[10px] font-mono px-1 rounded border border-border leading-none py-0.5">
                    x{item.quantity}
                  </span>
                </div>
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <p className="text-xs md:text-sm font-medium line-clamp-1">{item.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">₹{item.price.toLocaleString("en-IN")} each</p>
                </div>
                <div className="flex items-center justify-end">
                  <p className="text-xs md:text-sm font-semibold">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Coupon Code Input */}
          <div className="pt-4 border-t border-border/60">
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-brand/10 border border-brand/20 text-xs text-brand font-medium">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  Coupon Applied: <strong>{appliedCoupon.code}</strong>
                </span>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-xs underline text-muted-foreground hover:text-foreground"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Coupon code (e.g. SUMMER20)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="h-10 text-xs uppercase"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleApplyCoupon}
                  disabled={isApplyingCoupon || !couponCode.trim()}
                  className="h-10 text-xs px-4"
                >
                  {isApplyingCoupon ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Apply"}
                </Button>
              </div>
            )}
          </div>

          {/* Cost Breakdown */}
          <div className="space-y-2.5 pt-4 border-t border-border/60 text-xs md:text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="text-foreground">₹{subtotal.toLocaleString("en-IN")}</span>
            </div>

            {appliedCoupon && (
              <div className="flex justify-between text-brand font-medium">
                <span>Discount ({appliedCoupon.code})</span>
                <span>-₹{(appliedCoupon.discountAmount || 0).toLocaleString("en-IN")}</span>
              </div>
            )}

            <div className="flex justify-between text-muted-foreground">
              <span>Delivery Fee</span>
              <span className="text-foreground">
                {shipping === 0 ? (
                  <span className="text-emerald-600 font-medium">FREE</span>
                ) : (
                  `₹${shipping.toLocaleString("en-IN")}`
                )}
              </span>
            </div>

            <div className="flex justify-between text-base font-semibold pt-3 border-t border-border text-foreground">
              <span>Grand Total</span>
              <span className="text-brand">₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            form="checkout-form"
            disabled={isProcessing || items.length === 0}
            className="w-full rounded-full h-12 text-xs uppercase tracking-widest font-semibold shadow-md bg-brand text-brand-foreground hover:bg-brand/90 transition-all"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing Order...
              </>
            ) : paymentMethod === "COD" ? (
              `Place COD Order • ₹${total.toLocaleString("en-IN")}`
            ) : paymentMethod === "DEMO" ? (
              `Confirm Demo Order • ₹${total.toLocaleString("en-IN")}`
            ) : (
              `Pay Securely • ₹${total.toLocaleString("en-IN")}`
            )}
          </Button>

          {/* Assurance footer */}
          <div className="text-[11px] text-muted-foreground text-center space-y-1">
            <p className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-brand" />
              Verified secure SSL checkout • 7 days easy returns
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
