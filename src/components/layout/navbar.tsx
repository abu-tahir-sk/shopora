import Link from "next/link";
import { ShoppingCart, Search, Menu, Heart, User } from "lucide-react";
import { auth } from "@/lib/auth";

import { Button, buttonVariants } from "@/components/ui/button";
import { UserAccountNav } from "@/components/layout/user-account-nav";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CartButton } from "@/components/cart/cart-button";
import { CartSidebar } from "@/components/cart/cart-sidebar";
import { cn } from "@/lib/utils";

export async function Navbar() {
  const session = await auth();

  return (
    <div className="flex flex-col w-full sticky top-0 z-50">
      {/* Announcement Bar */}
      <div className="bg-brand text-brand-foreground text-xs font-medium tracking-wide py-2 text-center flex justify-center items-center">
        Free shipping on orders over ₹999
      </div>
      
      {/* Main Header */}
      <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 transition-colors duration-300">
        <div className="px-4 md:px-8 h-16 flex items-center justify-between">
          
          {/* Mobile Left */}
          <div className="flex items-center md:hidden">
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>

          {/* Logo */}
          <div className="flex items-center justify-center md:justify-start flex-1 md:flex-none">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-bold text-2xl tracking-tighter uppercase">Shopora</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-1 items-center justify-center gap-8 text-sm font-medium tracking-wide uppercase">
            <Link href="/products" className="transition-colors hover:text-brand text-foreground">
              Shop
            </Link>
            <Link href="/products?sort=newest" className="transition-colors hover:text-brand text-foreground/70">
              New Arrivals
            </Link>
            <Link href="/products" className="transition-colors hover:text-brand text-foreground/70">
              Collections
            </Link>
            <Link href="/products" className="transition-colors hover:text-brand text-foreground/70">
              Offers
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center justify-end gap-1 md:gap-4 flex-1 md:flex-none">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
            
            <Button variant="ghost" size="icon" className="hidden md:inline-flex rounded-full">
              <Heart className="h-4 w-4" />
              <span className="sr-only">Wishlist</span>
            </Button>

            {session?.user ? (
              <UserAccountNav user={session.user} />
            ) : (
              <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "hidden md:inline-flex rounded-full")}>
                <User className="h-4 w-4" />
                <span className="sr-only">Account</span>
              </Link>
            )}

            <CartButton />
            <CartSidebar isLoggedIn={!!session?.user} />
            
            <ThemeToggle />
          </div>
        </div>
      </header>
    </div>
  );
}
