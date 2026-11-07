"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  Store,
  ExternalLink,
  ChevronLeft,
  LayoutDashboard
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UserAccountNav } from "@/components/layout/user-account-nav";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { SidebarNav } from "@/app/admin/sidebar-nav";

interface AdminNavbarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  };
}

export function AdminNavbar({ user }: AdminNavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="h-16 shrink-0 w-full border-b border-border bg-card/95 backdrop-blur px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 transition-colors duration-300">
      {/* Left: Mobile Drawer Trigger + Dashboard Branding */}
      <div className="flex items-center gap-3">
        {/* Mobile Navigation Drawer Trigger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-lg text-foreground hover:bg-secondary h-9 w-9"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            }
          />
          <SheetContent
            side="left"
            className="w-72 p-0 flex flex-col justify-between bg-card text-card-foreground border-r border-border"
          >
            <div>
              {/* Sheet Header */}
              <SheetHeader className="h-16 flex flex-row items-center justify-between px-6 border-b border-border text-left">
                <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="font-bold text-lg tracking-tight text-foreground flex items-center gap-2"
                >
                  <Image
                    src="/images/icon-light.png"
                    alt="Shopora"
                    width={28}
                    height={28}
                    className="h-7 w-7 rounded-md object-contain dark:hidden"
                  />
                  <Image
                    src="/images/icon-dark.png"
                    alt="Shopora"
                    width={28}
                    height={28}
                    className="h-7 w-7 rounded-md object-contain hidden dark:block"
                  />
                  <span>
                    Shopora
                    <span className="text-brand font-light text-xs lowercase ml-1">
                      .admin
                    </span>
                  </span>
                </Link>
              </SheetHeader>

              {/* Sidebar Links for Mobile */}
              <div className="py-6 overflow-y-auto max-h-[calc(100vh-140px)]">
                <div className="px-6 mb-3 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                  Main Menu
                </div>
                <SidebarNav onItemClick={() => setMobileOpen(false)} />
              </div>
            </div>

            {/* Back to store in mobile drawer */}
            <div className="p-4 border-t border-border bg-card">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-medium bg-secondary hover:bg-secondary/80 text-foreground transition-all border border-border shadow-2xs"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Store
              </Link>
            </div>
          </SheetContent>
        </Sheet>

        {/* Dashboard Logo: Desktop Full Logo & Mobile Icon Logo */}
        <div className="flex items-center gap-3">
          <Link href="/admin" className="group flex items-center gap-2.5 focus:outline-none">
            {/* Desktop Brand Logo */}
            <div className="hidden sm:flex items-center">
              <Image
                src="/images/logo-light.png"
                alt="Shopora"
                width={130}
                height={32}
                priority
                className="h-7 lg:h-8 w-auto object-contain dark:hidden transition-opacity group-hover:opacity-85"
              />
              <Image
                src="/images/logo-dark.png"
                alt="Shopora"
                width={130}
                height={32}
                priority
                className="h-7 lg:h-8 w-auto object-contain hidden dark:block transition-opacity group-hover:opacity-85"
              />
            </div>

            {/* Mobile Icon Logo */}
            <div className="flex sm:hidden items-center gap-1.5">
              <Image
                src="/images/icon-light.png"
                alt="Shopora"
                width={30}
                height={30}
                priority
                className="h-7 w-7 rounded-md object-contain dark:hidden"
              />
              <Image
                src="/images/icon-dark.png"
                alt="Shopora"
                width={30}
                height={30}
                priority
                className="h-7 w-7 rounded-md object-contain hidden dark:block"
              />
              <span className="font-bold text-sm tracking-wider uppercase">Shopora</span>
            </div>
          </Link>

          {/* Admin Tag */}
          <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand/15 text-brand border border-brand/30">
            Admin
          </span>
        </div>
      </div>

      {/* Right: Live Store Link, Theme Toggle, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick link to live store */}
        <Link
          href="/"
          target="_blank"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-secondary/70 hover:bg-secondary text-foreground border border-border transition-colors shadow-2xs"
          title="Open live storefront"
        >
          <Store className="h-3.5 w-3.5 text-brand" />
          <span>Live Store</span>
          <ExternalLink className="h-3 w-3 text-muted-foreground" />
        </Link>

        {/* Theme Toggle Button */}
        <ThemeToggle />

        {/* User Account Info & Dropdown */}
        <div className="flex items-center gap-2 pl-1 border-l border-border">
          <div className="hidden sm:flex flex-col text-right leading-tight">
            <span className="text-xs font-semibold text-foreground truncate max-w-[130px]">
              {user.name || "Administrator"}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              {user.role || "Admin"}
            </span>
          </div>
          <UserAccountNav user={user} />
        </div>
      </div>
    </header>
  );
}

