"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/store/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Tag } from "lucide-react";
import { validateCoupon } from "@/app/actions/coupon";

export function CheckoutClient() {
  const { items, totalPrice, clearCart } = useCart();
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pinCode: "",
  });
  
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number; discountType: string } | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        firstName: session.user.name?.split(" ")[0] || "",
        lastName: session.user.name?.split(" ").slice(1).join(" ") || "",
        email: session.user.email || "",
      }));
    }
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      // 1. Create Order
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          shippingAddress: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            pinCode: formData.pinCode,
            phone: formData.phone,
          },
          couponCode: appliedCoupon?.code,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      // Razorpay Integration would go here.
      // For now, let's assume success or trigger razorpay options.
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mock", // Enter the Key ID generated from the Dashboard
        amount: data.amount, 
        currency: "INR",
        name: "Shopora",
        description: "Test Transaction",
        order_id: data.razorpayOrderId, 
        handler: async function (response: any) {
          // Verify Payment
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
            toast.success("Payment successful!");
            clearCart();
            router.push(`/order/success?id=${data.orderId}`);
          } else {
            toast.error(verifyData.error || "Payment verification failed");
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#000000",
        },
      };

      if (typeof window !== "undefined" && (window as any).Razorpay) {
        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          toast.error("Payment failed. Please try again.");
          setIsProcessing(false);
        });
        rzp.open();
      } else {
        // Fallback if Razorpay is not loaded or for testing without real razorpay
        toast.info("Razorpay script not loaded, skipping payment for testing");
        clearCart();
        router.push(`/order/success?id=${data.orderId}`);
      }

    } catch (error: any) {
      toast.error(error.message || "An error occurred during checkout");
    } finally {
      setIsProcessing(false);
    }
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
      toast.error(res.error);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.info("Coupon removed");
  };

  if (!mounted) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  const subtotal = totalPrice();
  let shipping = subtotal > 999 ? 0 : 99;
  
  if (appliedCoupon?.discountType === "FREE_SHIPPING") {
    shipping = 0;
  }
  
  let total = subtotal + shipping - (appliedCoupon?.discountAmount || 0);
  if (total < 0) total = 0;

  return (
    <div className="flex flex-col lg:flex-row gap-12 relative">
      {/* Left side - Form */}
      <div className="w-full lg:w-3/5">
        <form id="checkout-form" onSubmit={handleCheckout} className="space-y-8">
          {/* Contact Info */}
          <div className="space-y-4">
            <h2 className="text-xl font-medium tracking-tight">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required />
            </div>
          </div>

          {/* Shipping Info */}
          <div className="space-y-4 pt-6 border-t border-border">
            <h2 className="text-xl font-medium tracking-tight">Shipping Address</h2>
            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input id="street" name="street" value={formData.street} onChange={handleInputChange} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" name="state" value={formData.state} onChange={handleInputChange} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pinCode">PIN Code</Label>
                <Input id="pinCode" name="pinCode" value={formData.pinCode} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" name="country" value="India" disabled />
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Right side - Order Summary (Sticky) */}
      <div className="w-full lg:w-2/5">
        <div className="bg-secondary/30 p-6 lg:p-8 rounded-none sticky top-24 border border-border">
          <h2 className="text-xl font-medium tracking-tight mb-6">Order Summary</h2>
          
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="h-16 w-16 bg-secondary relative shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <div className="flex items-center">
                  <p className="text-sm font-medium">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <p className="text-sm text-muted-foreground">Your cart is empty.</p>
            )}
          </div>

          <div className="space-y-3 pt-6 border-t border-border text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-brand">
                <span>Discount ({appliedCoupon.code}) <button onClick={removeCoupon} className="text-xs text-muted-foreground underline">Remove</button></span>
                <span>-₹{(appliedCoupon.discountAmount || 0).toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{shipping === 0 ? "Free" : `₹${shipping.toLocaleString("en-IN")}`}</span>
            </div>
            
            <div className="pt-3 pb-2">
              {!appliedCoupon && (
                <div className="flex gap-2">
                  <Input 
                    placeholder="Discount code" 
                    value={couponCode} 
                    onChange={(e) => setCouponCode(e.target.value)} 
                    className="h-10"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleApplyCoupon}
                    disabled={isApplyingCoupon || !couponCode.trim()}
                  >
                    {isApplyingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                  </Button>
                </div>
              )}
            </div>

            <div className="flex justify-between font-medium text-base pt-3 border-t border-border">
              <span>Total</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <Button 
            type="submit" 
            form="checkout-form"
            className="w-full mt-8 bg-foreground text-background hover:bg-foreground/90 h-14 text-sm tracking-widest font-medium uppercase rounded-none"
            disabled={isProcessing || items.length === 0}
          >
            {isProcessing ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
            {isProcessing ? "Processing..." : "Pay Now"}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center mt-4">
            By proceeding, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
