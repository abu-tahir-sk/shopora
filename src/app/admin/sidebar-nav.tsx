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
  ClipboardList,
  Mail,
  Inbox
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Inventory", href: "/admin/inventory", icon: ClipboardList },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Inquiries", href: "/admin/messages", icon: Inbox },
  { name: "Subscribers", href: "/admin/subscribers", icon: Mail },
  { name: "System Users", href: "/admin/users", icon: Users },
  { name: "Categories", href: "/admin/categories", icon: Tags },
  { name: "Coupons", href: "/admin/coupons", icon: Ticket },
  { name: "Reviews", href: "/admin/reviews", icon: MessageSquare },
];

interface SidebarNavProps {
  onItemClick?: () => void;
}

export function SidebarNav({ onItemClick }: SidebarNavProps = {}) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1 px-3">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
        
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={cn(
              "group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden",
              isActive 
                ? "text-brand font-semibold bg-brand/10 dark:bg-brand/15 border border-brand/25 shadow-2xs" 
                : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
            )}
          >
            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand rounded-r-full" />
            )}
            <item.icon className={cn(
              "h-4 w-4 shrink-0 transition-colors duration-200",
              isActive ? "text-brand" : "text-muted-foreground group-hover:text-foreground"
            )} />
            <span className="truncate">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
