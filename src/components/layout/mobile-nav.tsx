"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, 
  X, 
  ShoppingBag, 
  Sparkles, 
  Layers, 
  Tag, 
  Heart, 
  User, 
  Package, 
  LogIn, 
  LogOut,
  ChevronRight
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
    role?: string;
  } | null;
}

export function MobileNav({ user }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const handleLinkClick = () => {
    setOpen(false);
  };

  const navLinks = [
    { name: "All Products", href: "/products", icon: ShoppingBag },
    { name: "New Arrivals", href: "/products?sort=newest", icon: Sparkles },
    { name: "All Categories", href: "/categories", icon: Layers },
    { name: "Offers & Sales", href: "/products", icon: Tag },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="mr-2 md:hidden rounded-full">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        }
      />

      <SheetContent side="left" className="w-[85vw] max-w-xs p-0 flex flex-col justify-between bg-card text-card-foreground">
        <div>
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between">
            <Link href="/" onClick={handleLinkClick} className="font-bold text-xl tracking-tighter uppercase">
              Shopo<span className="text-brand">ora</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="py-4 px-3 space-y-1">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Browse Store
            </p>
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-secondary text-foreground font-semibold"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </Link>
              );
            })}
          </div>

          {/* User Links */}
          <div className="py-4 px-3 border-t border-border space-y-1">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
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
              <ChevronRight className="h-4 w-4 opacity-50" />
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
                  <ChevronRight className="h-4 w-4 opacity-50" />
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
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </Link>
                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    onClick={handleLinkClick}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-indigo-500 hover:bg-indigo-500/10 transition-colors"
                  >
                    <span>Admin Dashboard</span>
                    <ChevronRight className="h-4 w-4 opacity-50" />
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
                <ChevronRight className="h-4 w-4 opacity-50" />
              </Link>
            )}
          </div>
        </div>

        {/* Footer controls inside drawer */}
        <div className="p-4 border-t border-border bg-secondary/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Appearance:</span>
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
