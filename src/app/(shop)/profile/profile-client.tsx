"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  User as UserIcon,
  ShoppingBag,
  Heart,
  MapPin,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Edit2,
  Home,
  Briefcase,
  Phone,
  Mail,
  Calendar,
  ChevronRight,
  Loader2,
  LogOut,
  Sparkles,
  ExternalLink,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  updateProfile,
  changePassword,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/app/actions/profile";

interface AddressItem {
  id: string;
  label: string | null;
  street: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  phone: string;
  isDefault: boolean;
  createdAt: Date | string;
}

interface OrderItemPreview {
  id: string;
  orderNumber: string;
  subtotal: number;
  total: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: Date | string;
  formattedDate?: string;
  items: {
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      slug: string;
      images: { url: string }[];
    };
  }[];
}

interface ProfileClientProps {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    phone: string | null;
    role: string;
    createdAt: Date | string;
    memberSince?: string;
    hasPassword: boolean;
  };
  addresses: AddressItem[];
  recentOrders: OrderItemPreview[];
  stats: {
    orderCount: number;
    wishlistCount: number;
    addressCount: number;
    totalSpent: number;
  };
}

export function ProfileClient({
  user: initialUser,
  addresses: initialAddresses,
  recentOrders,
  stats,
}: ProfileClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "details" | "addresses" | "security">("overview");

  // Profile Edit State
  const [user, setUser] = useState(initialUser);
  const [profileName, setProfileName] = useState(initialUser.name || "");
  const [profilePhone, setProfilePhone] = useState(initialUser.phone || "");
  const [profileImage, setProfileImage] = useState(initialUser.image || "");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Addresses State
  const [addresses, setAddresses] = useState<AddressItem[]>(initialAddresses);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);

  // Address Form fields
  const [addressLabel, setAddressLabel] = useState("Home");
  const [addressStreet, setAddressStreet] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressState, setAddressState] = useState("");
  const [addressPin, setAddressPin] = useState("");
  const [addressPhone, setAddressPhone] = useState(initialUser.phone || "");
  const [addressIsDefault, setAddressIsDefault] = useState(false);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  // Handle Profile Update
  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsUpdatingProfile(true);

    try {
      const res = await updateProfile({
        name: profileName,
        phone: profilePhone,
        image: profileImage,
      });

      if (res.success && res.user) {
        toast.success("Profile updated successfully!");
        setUser((prev) => ({
          ...prev,
          name: res.user.name,
          phone: res.user.phone,
          image: res.user.image,
        }));
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update profile.");
      }
    } catch {
      toast.error("Something went wrong while updating profile.");
    } finally {
      setIsUpdatingProfile(false);
    }
  }

  // Handle Address Edit button click
  function startEditAddress(addr: AddressItem) {
    setEditingAddressId(addr.id);
    setAddressLabel(addr.label || "Home");
    setAddressStreet(addr.street);
    setAddressCity(addr.city);
    setAddressState(addr.state);
    setAddressPin(addr.pinCode);
    setAddressPhone(addr.phone);
    setAddressIsDefault(addr.isDefault);
    setShowAddressForm(true);
  }

  function resetAddressForm() {
    setEditingAddressId(null);
    setAddressLabel("Home");
    setAddressStreet("");
    setAddressCity("");
    setAddressState("");
    setAddressPin("");
    setAddressPhone(user.phone || "");
    setAddressIsDefault(false);
    setShowAddressForm(false);
  }

  // Handle Address Save
  async function handleAddressSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAddressLoading(true);

    try {
      if (editingAddressId) {
        const res = await updateAddress(editingAddressId, {
          label: addressLabel,
          street: addressStreet,
          city: addressCity,
          state: addressState,
          pinCode: addressPin,
          phone: addressPhone,
          isDefault: addressIsDefault,
        });

        if (res.success && res.address) {
          toast.success("Address updated successfully!");
          setAddresses((prev) =>
            prev.map((a) => {
              if (a.id === editingAddressId) {
                return res.address as AddressItem;
              }
              if (addressIsDefault) {
                return { ...a, isDefault: false };
              }
              return a;
            })
          );
          resetAddressForm();
          router.refresh();
        } else {
          toast.error(res.error || "Failed to update address.");
        }
      } else {
        const res = await addAddress({
          label: addressLabel,
          street: addressStreet,
          city: addressCity,
          state: addressState,
          pinCode: addressPin,
          phone: addressPhone,
          isDefault: addressIsDefault,
        });

        if (res.success && res.address) {
          toast.success("New address added successfully!");
          setAddresses((prev) => {
            const nextList = addressIsDefault
              ? prev.map((a) => ({ ...a, isDefault: false }))
              : [...prev];
            return [res.address as AddressItem, ...nextList];
          });
          resetAddressForm();
          router.refresh();
        } else {
          toast.error(res.error || "Failed to add address.");
        }
      }
    } catch {
      toast.error("Something went wrong with the address operation.");
    } finally {
      setAddressLoading(false);
    }
  }

  // Handle Set Default Address
  async function handleSetDefault(id: string) {
    try {
      const res = await setDefaultAddress(id);
      if (res.success) {
        toast.success("Default address updated.");
        setAddresses((prev) =>
          prev.map((a) => ({
            ...a,
            isDefault: a.id === id,
          }))
        );
        router.refresh();
      } else {
        toast.error(res.error || "Failed to set default address.");
      }
    } catch {
      toast.error("Could not set default address.");
    }
  }

  // Handle Delete Address
  async function handleDeleteAddress(id: string) {
    if (!confirm("Are you sure you want to remove this address?")) return;

    try {
      const res = await deleteAddress(id);
      if (res.success) {
        toast.success("Address removed.");
        setAddresses((prev) => prev.filter((a) => a.id !== id));
        router.refresh();
      } else {
        toast.error(res.error || "Failed to delete address.");
      }
    } catch {
      toast.error("Could not delete address.");
    }
  }

  // Handle Password Change
  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (res.success) {
        toast.success(res.message || "Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(res.error || "Failed to change password.");
      }
    } catch {
      toast.error("Error updating password.");
    } finally {
      setIsChangingPassword(false);
    }
  }

  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];

  return (
    <div className="bg-background min-h-[85vh] py-10 md:py-16 text-foreground">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        {/* Top Profile Card / Hero */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-secondary/30 p-6 md:p-8 mb-8 shadow-sm">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative group">
                <Avatar className="h-20 w-20 md:h-24 md:md:w-24 ring-2 ring-brand/40 ring-offset-2 ring-offset-background transition-transform duration-300 group-hover:scale-105">
                  <AvatarImage src={user.image || ""} alt={user.name || "User"} />
                  <AvatarFallback className="bg-secondary text-brand font-semibold text-2xl md:text-3xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={() => setActiveTab("details")}
                  className="absolute bottom-0 right-0 bg-brand text-brand-foreground p-1.5 rounded-full shadow-md hover:bg-brand/90 transition-colors"
                  title="Edit Avatar"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl md:text-3xl font-light tracking-tight text-foreground">
                    {user.name || "Shopora Member"}
                  </h1>
                  <span className="px-2.5 py-0.5 text-[11px] font-medium tracking-wider uppercase rounded-full bg-brand/10 text-brand border border-brand/20">
                    {user.role}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs md:text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    {user.email}
                  </span>
                  {user.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      {user.phone}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5" suppressHydrationWarning>
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    Member since {user.memberSince || "Shopora Member"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto self-stretch md:self-auto justify-start md:justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setActiveTab("addresses");
                  setShowAddressForm(true);
                }}
                className="rounded-full text-xs gap-1.5 hover:border-brand/40"
              >
                <Plus className="h-3.5 w-3.5" />
                New Address
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="rounded-full text-xs gap-1.5"
              >
                <Link href="/orders">
                  <ShoppingBag className="h-3.5 w-3.5" />
                  My Orders
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut({ callbackUrl: `${window.location.origin}/login` })}
                className="rounded-full text-xs text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div
            onClick={() => router.push("/orders")}
            className="cursor-pointer group p-5 rounded-xl border border-border bg-card/60 backdrop-blur hover:border-brand/40 transition-all duration-200 hover:shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Orders</span>
              <div className="p-2 rounded-lg bg-secondary text-brand group-hover:bg-brand/10 transition-colors">
                <ShoppingBag className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl md:text-3xl font-semibold tracking-tight">{stats.orderCount}</span>
              <span className="text-[11px] text-brand flex items-center font-medium group-hover:translate-x-0.5 transition-transform">
                View <ChevronRight className="h-3 w-3 ml-0.5" />
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Lifetime purchases</p>
          </div>

          <div className="p-5 rounded-xl border border-border bg-card/60 backdrop-blur">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Spent</span>
              <div className="p-2 rounded-lg bg-secondary text-brand">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl md:text-3xl font-semibold tracking-tight">
                ₹{stats.totalSpent.toLocaleString("en-IN")}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Across completed orders</p>
          </div>

          <div
            onClick={() => router.push("/wishlist")}
            className="cursor-pointer group p-5 rounded-xl border border-border bg-card/60 backdrop-blur hover:border-brand/40 transition-all duration-200 hover:shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Wishlist</span>
              <div className="p-2 rounded-lg bg-secondary text-brand group-hover:bg-brand/10 transition-colors">
                <Heart className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl md:text-3xl font-semibold tracking-tight">{stats.wishlistCount}</span>
              <span className="text-[11px] text-brand flex items-center font-medium group-hover:translate-x-0.5 transition-transform">
                Browse <ChevronRight className="h-3 w-3 ml-0.5" />
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Saved favorites</p>
          </div>

          <div
            onClick={() => setActiveTab("addresses")}
            className="cursor-pointer group p-5 rounded-xl border border-border bg-card/60 backdrop-blur hover:border-brand/40 transition-all duration-200 hover:shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Addresses</span>
              <div className="p-2 rounded-lg bg-secondary text-brand group-hover:bg-brand/10 transition-colors">
                <MapPin className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl md:text-3xl font-semibold tracking-tight">{addresses.length}</span>
              <span className="text-[11px] text-brand flex items-center font-medium group-hover:translate-x-0.5 transition-transform">
                Manage <ChevronRight className="h-3 w-3 ml-0.5" />
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Saved delivery points</p>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center gap-2 border-b border-border pb-4 mb-8 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={cn(
              "px-4 py-2 text-xs md:text-sm font-medium rounded-full transition-all uppercase tracking-wider whitespace-nowrap",
              activeTab === "overview"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
            )}
          >
            Account Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={cn(
              "px-4 py-2 text-xs md:text-sm font-medium rounded-full transition-all uppercase tracking-wider whitespace-nowrap",
              activeTab === "details"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
            )}
          >
            Personal Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("addresses")}
            className={cn(
              "px-4 py-2 text-xs md:text-sm font-medium rounded-full transition-all uppercase tracking-wider whitespace-nowrap",
              activeTab === "addresses"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
            )}
          >
            Addresses ({addresses.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={cn(
              "px-4 py-2 text-xs md:text-sm font-medium rounded-full transition-all uppercase tracking-wider whitespace-nowrap",
              activeTab === "security"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
            )}
          >
            Security & Login
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Recent Orders */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-light tracking-tight">Recent Orders</h2>
                  <p className="text-xs text-muted-foreground">Track and review your recent shopping history</p>
                </div>
                <Link
                  href="/orders"
                  className="text-xs uppercase tracking-wider font-medium text-brand hover:underline flex items-center"
                >
                  View All Orders <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className="rounded-xl border border-border bg-card p-10 text-center flex flex-col items-center justify-center">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground/40 mb-3" />
                  <h3 className="text-base font-medium mb-1">No orders placed yet</h3>
                  <p className="text-xs text-muted-foreground mb-5 max-w-sm">
                    Discover our collection of curated essentials and place your first order today.
                  </p>
                  <Button asChild size="sm" className="rounded-full px-6 text-xs uppercase tracking-widest font-medium">
                    <Link href="/products">Start Exploring</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-brand/40"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3 mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono font-medium text-foreground">
                            {order.orderNumber}
                          </span>
                          <span className="text-xs text-muted-foreground" suppressHydrationWarning>
                            {order.formattedDate || (typeof order.createdAt === "string" ? order.createdAt.slice(0, 10) : "")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded-full border",
                              order.orderStatus === "DELIVERED"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
                                : order.orderStatus === "CANCELLED"
                                ? "bg-destructive/10 text-destructive border-destructive/20"
                                : "bg-brand/10 text-brand border-brand/20"
                            )}
                          >
                            {order.orderStatus}
                          </span>
                          <span className="text-xs font-semibold">
                            ₹{order.total.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>

                      {/* Items Row */}
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 overflow-x-auto py-1">
                          {order.items.slice(0, 4).map((item) => (
                            <div
                              key={item.id}
                              className="relative h-14 w-14 rounded-lg bg-secondary/50 border border-border/80 overflow-hidden shrink-0"
                            >
                              {item.product.images[0] ? (
                                <Image
                                  src={item.product.images[0].url}
                                  alt={item.product.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-[10px] text-muted-foreground">
                                  No Img
                                </div>
                              )}
                              {item.quantity > 1 && (
                                <span className="absolute bottom-1 right-1 bg-background/90 backdrop-blur text-[10px] font-mono px-1 rounded border border-border leading-none py-0.5">
                                  x{item.quantity}
                                </span>
                              )}
                            </div>
                          ))}
                          {order.items.length > 4 && (
                            <div className="h-14 w-14 rounded-lg bg-secondary/40 border border-dashed border-border flex items-center justify-center text-xs font-medium text-muted-foreground shrink-0">
                              +{order.items.length - 4}
                            </div>
                          )}
                        </div>

                        <Button asChild variant="outline" size="sm" className="rounded-full text-xs shrink-0">
                          <Link href={`/orders/${order.id}`}>
                            Details <ChevronRight className="h-3 w-3 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right 1 Col: Default Shipping & Quick Info */}
            <div className="space-y-6">
              {/* Default Address Card */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-brand" /> Default Address
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab("addresses")}
                    className="text-xs text-brand hover:underline font-medium"
                  >
                    Change
                  </button>
                </div>

                {defaultAddress ? (
                  <div className="space-y-2 text-xs md:text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{defaultAddress.label || "Home"}</span>
                      {defaultAddress.isDefault && (
                        <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-medium bg-brand/10 text-brand rounded border border-brand/20">
                          Primary
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {defaultAddress.street}, {defaultAddress.city}, {defaultAddress.state} - {defaultAddress.pinCode}
                    </p>
                    <p className="text-muted-foreground flex items-center gap-1.5 pt-1">
                      <Phone className="h-3.5 w-3.5" /> {defaultAddress.phone}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground space-y-3">
                    <p className="text-xs">No address saved yet.</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setActiveTab("addresses");
                        setShowAddressForm(true);
                      }}
                      className="rounded-full text-xs"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" /> Add an Address
                    </Button>
                  </div>
                )}
              </div>

              {/* Membership & Perks Box */}
              <div className="rounded-xl border border-border/80 bg-gradient-to-br from-brand/5 via-secondary/30 to-card p-6">
                <div className="flex items-center gap-2.5 mb-3 text-brand">
                  <Sparkles className="h-5 w-5" />
                  <h3 className="text-sm font-semibold tracking-wide uppercase">Shopora Privilege</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Enjoy complimentary express delivery on orders over ₹9,999, curated early-access drops, and personalized support.
                </p>
                <div className="space-y-2 text-xs text-foreground/80">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-brand" />
                    <span>Free doorstep returns within 7 days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-brand" />
                    <span>Verified secure payment encryption</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PERSONAL DETAILS */}
        {activeTab === "details" && (
          <div className="max-w-2xl bg-card border border-border rounded-xl p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-light tracking-tight">Personal Information</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Update your identity details, contact information, and public profile picture.
              </p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-medium text-foreground/80">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand/40"
                  placeholder="e.g. Eleanor Vance"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-wider font-medium text-foreground/80">
                    Email Address
                  </label>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Verified
                  </span>
                </div>
                <input
                  type="email"
                  disabled
                  value={user.email || ""}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border bg-muted/50 text-muted-foreground cursor-not-allowed"
                />
                <p className="text-[11px] text-muted-foreground">
                  Your primary login email cannot be edited directly for security purposes.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-medium text-foreground/80">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand/40"
                  placeholder="e.g. +91 98765 43210"
                />
                <p className="text-[11px] text-muted-foreground">
                  Used for order delivery alerts and driver coordination.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-medium text-foreground/80">
                  Avatar Image URL
                </label>
                <input
                  type="url"
                  value={profileImage}
                  onChange={(e) => setProfileImage(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand/40"
                  placeholder="https://images.unsplash.com/..."
                />
                {profileImage && (
                  <div className="flex items-center gap-3 pt-2">
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarImage src={profileImage} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">Previewing avatar image</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-border flex items-center gap-3">
                <Button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="rounded-full px-6 text-xs uppercase tracking-widest font-medium"
                >
                  {isUpdatingProfile ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setProfileName(user.name || "");
                    setProfilePhone(user.phone || "");
                    setProfileImage(user.image || "");
                  }}
                  className="rounded-full px-5 text-xs uppercase tracking-widest"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: ADDRESSES */}
        {activeTab === "addresses" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-light tracking-tight">Saved Addresses</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Manage your delivery destinations for quick checkout.
                </p>
              </div>
              {!showAddressForm && (
                <Button
                  onClick={() => {
                    resetAddressForm();
                    setShowAddressForm(true);
                  }}
                  className="rounded-full text-xs uppercase tracking-widest font-medium gap-1.5 self-start sm:self-auto"
                >
                  <Plus className="h-3.5 w-3.5" /> Add New Address
                </Button>
              )}
            </div>

            {/* Address Form Card */}
            {showAddressForm && (
              <div className="rounded-xl border border-brand/30 bg-card p-6 shadow-sm">
                <h3 className="text-base font-medium mb-4 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-brand" />
                  {editingAddressId ? "Edit Address" : "Add New Delivery Address"}
                </h3>

                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  {/* Label Switcher */}
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-wider font-medium text-foreground/80">
                      Address Type
                    </label>
                    <div className="flex gap-2">
                      {["Home", "Office", "Other"].map((lbl) => (
                        <button
                          key={lbl}
                          type="button"
                          onClick={() => setAddressLabel(lbl)}
                          className={cn(
                            "px-3.5 py-1.5 text-xs rounded-full border transition-colors flex items-center gap-1.5",
                            addressLabel === lbl
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border hover:bg-secondary text-muted-foreground"
                          )}
                        >
                          {lbl === "Home" && <Home className="h-3 w-3" />}
                          {lbl === "Office" && <Briefcase className="h-3 w-3" />}
                          {lbl === "Other" && <MapPin className="h-3 w-3" />}
                          {lbl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-wider font-medium text-foreground/80">
                      Street Address / Flat / Building
                    </label>
                    <input
                      type="text"
                      required
                      value={addressStreet}
                      onChange={(e) => setAddressStreet(e.target.value)}
                      placeholder="e.g. 104 Willow Woods, MG Road"
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand/40"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs uppercase tracking-wider font-medium text-foreground/80">
                        City
                      </label>
                      <input
                        type="text"
                        required
                        value={addressCity}
                        onChange={(e) => setAddressCity(e.target.value)}
                        placeholder="e.g. Mumbai"
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand/40"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs uppercase tracking-wider font-medium text-foreground/80">
                        State
                      </label>
                      <input
                        type="text"
                        required
                        value={addressState}
                        onChange={(e) => setAddressState(e.target.value)}
                        placeholder="e.g. Maharashtra"
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand/40"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs uppercase tracking-wider font-medium text-foreground/80">
                        PIN Code
                      </label>
                      <input
                        type="text"
                        required
                        value={addressPin}
                        onChange={(e) => setAddressPin(e.target.value)}
                        placeholder="e.g. 400001"
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand/40"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-wider font-medium text-foreground/80">
                      Contact Phone for Delivery
                    </label>
                    <input
                      type="tel"
                      required
                      value={addressPhone}
                      onChange={(e) => setAddressPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand/40"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="isDefaultCheckbox"
                      checked={addressIsDefault}
                      onChange={(e) => setAddressIsDefault(e.target.checked)}
                      className="rounded border-border text-brand focus:ring-brand"
                    />
                    <label htmlFor="isDefaultCheckbox" className="text-xs font-medium cursor-pointer">
                      Make this my primary / default delivery address
                    </label>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-border">
                    <Button
                      type="submit"
                      disabled={addressLoading}
                      className="rounded-full px-6 text-xs uppercase tracking-widest font-medium"
                    >
                      {addressLoading ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                          Saving...
                        </>
                      ) : editingAddressId ? (
                        "Update Address"
                      ) : (
                        "Save Address"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetAddressForm}
                      className="rounded-full px-5 text-xs uppercase tracking-widest"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Address Cards Grid */}
            {addresses.length === 0 && !showAddressForm ? (
              <div className="rounded-xl border border-border bg-card p-12 text-center flex flex-col items-center justify-center">
                <MapPin className="h-12 w-12 text-muted-foreground/40 mb-3" />
                <h3 className="text-base font-medium mb-1">No addresses saved yet</h3>
                <p className="text-xs text-muted-foreground mb-5 max-w-sm">
                  Add an address to expedite your orders and enjoy swift checkout.
                </p>
                <Button
                  onClick={() => setShowAddressForm(true)}
                  className="rounded-full px-6 text-xs uppercase tracking-widest font-medium"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Address
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={cn(
                      "rounded-xl border p-5 bg-card flex flex-col justify-between transition-all duration-200",
                      addr.isDefault
                        ? "border-brand shadow-sm bg-brand/5 dark:bg-brand/10"
                        : "border-border hover:border-brand/30"
                    )}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-md bg-secondary text-foreground">
                            {addr.label === "Office" ? (
                              <Briefcase className="h-3.5 w-3.5" />
                            ) : addr.label === "Home" ? (
                              <Home className="h-3.5 w-3.5" />
                            ) : (
                              <MapPin className="h-3.5 w-3.5" />
                            )}
                          </div>
                          <span className="font-semibold text-sm">{addr.label || "Address"}</span>
                        </div>

                        {addr.isDefault ? (
                          <span className="px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-brand text-brand-foreground rounded-full">
                            Default
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetDefault(addr.id)}
                            className="text-[11px] text-muted-foreground hover:text-brand transition-colors font-medium"
                          >
                            Set as default
                          </button>
                        )}
                      </div>

                      <div className="text-xs md:text-sm text-muted-foreground space-y-1 mb-4 leading-relaxed">
                        <p className="text-foreground font-medium">{addr.street}</p>
                        <p>{addr.city}, {addr.state} - {addr.pinCode}</p>
                        <p className="text-xs flex items-center gap-1.5 pt-1 text-muted-foreground">
                          <Phone className="h-3 w-3" /> {addr.phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/60">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditAddress(addr)}
                        className="rounded-full text-xs h-7 px-2.5"
                      >
                        <Edit2 className="h-3 w-3 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="rounded-full text-xs h-7 px-2.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3 w-3 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SECURITY & LOGIN */}
        {activeTab === "security" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Password update form */}
              <div className="rounded-xl border border-border bg-card p-6 md:p-8">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-2 rounded-lg bg-secondary text-brand">
                    <KeyRound className="h-4 w-4" />
                  </div>
                  <h2 className="text-xl font-light tracking-tight">Security Credentials</h2>
                </div>
                <p className="text-xs text-muted-foreground mb-6">
                  Ensure your account is protected with a resilient, unique password.
                </p>

                {user.hasPassword ? (
                  <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                    <div className="space-y-1.5">
                      <label className="text-xs uppercase tracking-wider font-medium text-foreground/80">
                        Current Password
                      </label>
                      <input
                        type="password"
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand/40"
                        placeholder="••••••••"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs uppercase tracking-wider font-medium text-foreground/80">
                        New Password
                      </label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand/40"
                        placeholder="At least 6 characters"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs uppercase tracking-wider font-medium text-foreground/80">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand/40"
                        placeholder="Re-enter new password"
                      />
                    </div>

                    <div className="pt-3">
                      <Button
                        type="submit"
                        disabled={isChangingPassword}
                        className="rounded-full px-6 text-xs uppercase tracking-widest font-medium"
                      >
                        {isChangingPassword ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                            Updating...
                          </>
                        ) : (
                          "Update Password"
                        )}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="rounded-lg bg-secondary/50 border border-border p-4 text-xs space-y-2">
                    <div className="flex items-center gap-2 text-brand font-medium">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Single Sign-On (Google OAuth) Active</span>
                    </div>
                    <p className="text-muted-foreground">
                      Your account was created via Google authentication. Your password and two-factor authentication are safely managed through your Google Account.
                    </p>
                  </div>
                )}
              </div>

              {/* Sessions & Logout */}
              <div className="rounded-xl border border-destructive/20 bg-card p-6 md:p-8">
                <h3 className="text-base font-medium text-destructive mb-1 flex items-center gap-2">
                  <LogOut className="h-4 w-4" /> Active Session
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Sign out of this device or end your current browsing session.
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: `${window.location.origin}/login` })}
                  className="rounded-full px-5 text-xs uppercase tracking-widest font-medium"
                >
                  Sign Out from Shopora
                </Button>
              </div>
            </div>

            {/* Right Info Col */}
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-2 text-brand font-semibold text-sm uppercase tracking-wider mb-3">
                  <ShieldCheck className="h-4 w-4" /> Account Safety
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Shopora uses industry-standard 256-bit encryption for all personal and financial transactions. We never sell your personal data.
                </p>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p>• Password encrypted with bcrypt</p>
                  <p>• SSL / TLS endpoint protection</p>
                  <p>• Payment card tokens handled via Razorpay</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
