"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Tags,
  Ticket,
  MessageSquare,
  ClipboardList
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Inventory", href: "/admin/inventory", icon: ClipboardList },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Categories", href: "/admin/categories", icon: Tags },
  { name: "Coupons", href: "/admin/coupons", icon: Ticket },
  { name: "Reviews", href: "/admin/reviews", icon: MessageSquare },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1.5 px-3">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden",
              isActive 
                ? "text-white bg-slate-800/90 shadow-md shadow-black/10" 
                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100"
            )}
          >
            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full" />
            )}
            <item.icon className={cn(
              "h-5 w-5 transition-colors duration-300",
              isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
            )} />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
