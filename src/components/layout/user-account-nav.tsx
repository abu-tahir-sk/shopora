"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { 
  LogOut, 
  Settings, 
  User as UserIcon, 
  LayoutDashboard, 
  ShoppingBag, 
  Heart,
  ShieldCheck,
  Sparkles 
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAccountNavProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  };
}

export function UserAccountNav({ user }: UserAccountNavProps) {
  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  const isAdmin = user.role === "ADMIN";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center justify-center relative h-8 w-8 rounded-full bg-transparent hover:bg-muted outline-none ring-offset-background transition-all focus-visible:ring-2 focus-visible:ring-ring">
        <Avatar className="h-8 w-8 border border-border">
          <AvatarImage src={user.image || ""} alt={user.name || "User"} />
          <AvatarFallback className="text-xs font-semibold bg-brand/10 text-brand">{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60 p-1.5" align="end">
        {/* User Profile Card */}
        <div className="flex items-center gap-3 p-2.5 bg-secondary/30 rounded-md mb-1">
          <Avatar className="h-9 w-9 border border-border">
            <AvatarImage src={user.image || ""} alt={user.name || "User"} />
            <AvatarFallback className="text-xs font-semibold bg-brand/10 text-brand">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="font-semibold text-sm truncate text-foreground">{user.name || "Member"}</p>
            </div>
            {user.email && (
              <p className="truncate text-xs text-muted-foreground font-light">
                {user.email}
              </p>
            )}
            <div className="flex items-center gap-1 mt-1">
              {isAdmin ? (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                  <ShieldCheck className="h-3 w-3" />
                  Admin
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-brand/10 text-brand border border-brand/20">
                  <Sparkles className="h-2.5 w-2.5" />
                  Privilege Member
                </span>
              )}
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        {isAdmin && (
          <DropdownMenuItem render={<Link href="/admin" />}>
            <LayoutDashboard className="mr-2 h-4 w-4 text-indigo-500" />
            <span className="font-medium text-indigo-600 dark:text-indigo-400">Admin Dashboard</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem render={<Link href="/profile" />}>
          <UserIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>My Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem render={<Link href="/orders" />}>
          <ShoppingBag className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>My Orders</span>
        </DropdownMenuItem>

        <DropdownMenuItem render={<Link href="/wishlist" />}>
          <Heart className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>Saved Wishlist</span>
        </DropdownMenuItem>

        <DropdownMenuItem render={<Link href="/settings" />}>
          <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>Account Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30"
          onClick={(event) => {
            event.preventDefault();
            signOut({
              callbackUrl: `${window.location.origin}/login`,
            });
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
