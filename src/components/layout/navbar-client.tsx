"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { buttonVariants } from "@/components/ui/button";
import { UserAccountNav } from "@/components/layout/user-account-nav";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CartButton } from "@/components/cart/cart-button";
import { CartSidebar } from "@/components/cart/cart-sidebar";
import { SearchDialog } from "@/components/layout/search-dialog";
import { MobileNav } from "@/components/layout/mobile-nav";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { WishlistNavButton } from "@/components/layout/wishlist-nav-button";
import { MegaMenu } from "@/components/layout/mega-menu";
import { cn } from "@/lib/utils";

interface NavbarClientProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  } | null;
  wishlistCount?: number;
}

export function NavbarClient({ user, wishlistCount = 0 }: NavbarClientProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  const lastScrollY = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Smart Headroom Scroll Logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Blur & glassmorphism threshold
      setIsScrolled(currentScrollY > 20);

      // Headroom visibility: hide when scrolling down past 120px, show when scrolling up
      if (currentScrollY > 120) {
        if (currentScrollY > lastScrollY.current && !megaMenuOpen) {
          setIsVisible(false); // scrolling down
        } else {
          setIsVisible(true); // scrolling up
        }
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [megaMenuOpen]);

  // Smooth hover handlers for Mega Menu with small leave delay
  const handleMouseEnterNav = (name: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHoveredNav(name);
    if (name === "Shop" || name === "Categories") {
      setMegaMenuOpen(true);
    } else {
      setMegaMenuOpen(false);
    }
  };

  const handleMouseLeaveNav = () => {
    timeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false);
      setHoveredNav(null);
    }, 200);
  };

  const handleMegaMenuEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleMegaMenuLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false);
      setHoveredNav(null);
    }, 200);
  };

  const navItems = [
    { name: "Shop", href: "/products", hasMegaMenu: true },
    { name: "New Arrivals", href: "/products?sort=newest", hasMegaMenu: false, badge: null },
    { name: "Categories", href: "/categories", hasMegaMenu: true },
    { name: "Offers", href: "/products", hasMegaMenu: false, badge: "Sale" },
  ];

  return (
    <div
      className={cn(
        "sticky top-0 w-full z-50 transition-transform duration-300 ease-in-out",
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      {/* 1. Multi-Message Rotating Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Main Navigation Bar */}
      <header
        className={cn(
          "w-full transition-all duration-300 relative border-b",
          isScrolled
            ? "bg-background/90 backdrop-blur-md border-border/80 shadow-xs"
            : "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-border/40"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Mobile Drawer Trigger (Mobile Only) */}
          <div className="flex items-center md:hidden">
            <MobileNav user={user} wishlistCount={wishlistCount} />
          </div>

          {/* Brand Logo */}
          <div className="flex items-center justify-center md:justify-start">
            <Link href="/" className="group flex items-center gap-1.5 focus:outline-none">
              <span className="font-semibold text-2xl tracking-[0.18em] uppercase transition-colors">
                Shop<span className="text-brand font-light transition-opacity group-hover:opacity-80">ora</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav
            onMouseLeave={handleMouseLeaveNav}
            className="hidden md:flex items-center justify-center gap-1 lg:gap-2 text-xs font-semibold tracking-wider uppercase"
          >
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const isHovered = hoveredNav === item.name;

              return (
                <div
                  key={item.name}
                  onMouseEnter={() => handleMouseEnterNav(item.name)}
                  className="relative py-4"
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5",
                      isActive
                        ? "text-brand font-bold"
                        : "text-foreground/80 hover:text-foreground",
                      isHovered && "bg-secondary/60 text-foreground"
                    )}
                  >
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-full animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </Link>

                  {/* Active Link Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-pill"
                      className="absolute bottom-2 left-3 right-3 h-0.5 bg-brand rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Controls: Search, Wishlist, Account, Cart, Theme */}
          <div className="flex items-center justify-end gap-1 sm:gap-2 lg:gap-3">
            {/* Desktop Pill / Mobile Icon Search */}
            <SearchDialog showDesktopPill={true} />

            {/* Live Wishlist Counter */}
            <WishlistNavButton initialCount={wishlistCount} />

            {/* User Account / Sign In */}
            {user ? (
              <UserAccountNav user={user} />
            ) : (
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "rounded-full text-foreground hover:bg-secondary transition-all"
                )}
                title="Account / Sign In"
                aria-label="Account"
              >
                <User className="h-4 w-4" />
                <span className="sr-only">Account</span>
              </Link>
            )}

            {/* Animated Shopping Cart Button & Drawer */}
            <CartButton />
            <CartSidebar isLoggedIn={!!user} />

            {/* Dark / Light Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>

        {/* 3. Mega Menu Dropdown */}
        <div
          onMouseEnter={handleMegaMenuEnter}
          onMouseLeave={handleMegaMenuLeave}
        >
          <AnimatePresence>
            {megaMenuOpen && (
              <MegaMenu
                isOpen={megaMenuOpen}
                onClose={() => setMegaMenuOpen(false)}
              />
            )}
          </AnimatePresence>
        </div>
      </header>
    </div>
  );
}
