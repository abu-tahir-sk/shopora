"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, 
  ShoppingBag, 
  Sparkles, 
  Layers, 
  Tag, 
  Heart, 
  User, 
  Package, 
  LogIn, 
  LogOut,
  ChevronRight,
  ShieldCheck,
  Compass
} from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { signOut } from "next-auth/react";

interface MobileNavProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  } | null;
  wishlistCount?: number;
}

export function MobileNav({ user, wishlistCount = 0 }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const handleLinkClick = () => {
    setOpen(false);
  };

  const navLinks = [
    { name: "All Collections", href: "/products", icon: ShoppingBag, badge: null },
    { name: "New Arrivals", href: "/products?sort=newest", icon: Sparkles, badge: "New" },
    { name: "Categories", href: "/categories", icon: Layers, badge: null },
    { name: "Curated Offers", href: "/products", icon: Tag, badge: "Sale" },
  ];

  const popularCategories = [
    { name: "Seating", href: "/products?category=seating" },
    { name: "Tables", href: "/products?category=tables" },
    { name: "Lighting", href: "/products?category=lighting" },
    { name: "Decor", href: "/products?category=decor" },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="mr-2 md:hidden rounded-full text-foreground hover:bg-secondary">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        }
      />

      <SheetContent side="left" className="w-[85vw] max-w-xs p-0 flex flex-col justify-between bg-card text-card-foreground">
        <div>
          {/* Header */}
          <SheetHeader className="p-5 border-b border-border flex flex-row items-center justify-between text-left">
            <SheetTitle className="sr-only">Shopora Navigation</SheetTitle>
            <Link href="/" onClick={handleLinkClick} className="font-semibold text-xl tracking-[0.18em] uppercase">
              Shop<span className="text-brand font-light">ora</span>
            </Link>
          </SheetHeader>

          {/* Navigation Links */}
          <div className="py-4 px-3 space-y-1">
            <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
              <Compass className="h-3 w-3 text-brand" />
              <span>Explore Store</span>
            </p>
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-secondary text-foreground font-semibold"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-foreground/80" />
                    <span>{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        item.badge === "Sale"
                          ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                          : "bg-brand/10 text-brand border border-brand/20"
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="h-3.5 w-3.5 opacity-40" />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Quick Category Pills */}
          <div className="px-4 py-2">
            <div className="grid grid-cols-2 gap-1.5">
              {popularCategories.map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  onClick={handleLinkClick}
                  className="px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground rounded-md bg-secondary/40 hover:bg-secondary transition-colors text-center truncate border border-border/40"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* User Links */}
          <div className="py-4 px-3 border-t border-border space-y-1">
            <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              Account & Activity
            </p>
            <Link
              href="/wishlist"
              onClick={handleLinkClick}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-colors"
            >
              <div className="flex items-center gap-3">
                <Heart className="h-4 w-4" />
                <span>My Wishlist</span>
              </div>
              <div className="flex items-center gap-1.5">
                {wishlistCount > 0 && (
                  <span className="flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-brand text-[10px] text-brand-foreground font-bold">
                    {wishlistCount}
                  </span>
                )}
                <ChevronRight className="h-3.5 w-3.5 opacity-40" />
              </div>
            </Link>

            {user ? (
              <>
                <Link
                  href="/orders"
                  onClick={handleLinkClick}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Package className="h-4 w-4" />
                    <span>My Orders</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 opacity-40" />
                </Link>
                <Link
                  href="/profile"
                  onClick={handleLinkClick}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4" />
                    <span>Account Profile</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 opacity-40" />
                </Link>
                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    onClick={handleLinkClick}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-indigo-500 hover:bg-indigo-500/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 opacity-40" />
                  </Link>
                )}
              </>
            ) : (
              <Link
                href="/login"
                onClick={handleLinkClick}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-colors"
              >
                <div className="flex items-center gap-3">
                  <LogIn className="h-4 w-4" />
                  <span>Sign In / Register</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 opacity-40" />
              </Link>
            )}
          </div>
        </div>

        {/* Footer controls inside drawer */}
        <div className="p-4 border-t border-border bg-secondary/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Theme:</span>
            <ThemeToggle />
          </div>
          {user && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="text-xs text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-3.5 w-3.5 mr-1.5" />
              Sign Out
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
