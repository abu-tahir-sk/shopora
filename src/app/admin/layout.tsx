import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Tags,
  Ticket,
  MessageSquare,
  LogOut,
  ChevronLeft,
  ClipboardList
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

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

  return (
    <div className="flex h-screen overflow-hidden bg-muted/20">
      {/* Admin Sidebar */}
      <aside className="w-64 flex-col hidden md:flex border-r bg-background">
        <div className="h-16 flex items-center px-6 border-b">
          <Link href="/admin" className="font-bold text-xl tracking-tight">
            SHOPORA<span className="text-muted-foreground font-normal">.admin</span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6 max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}
