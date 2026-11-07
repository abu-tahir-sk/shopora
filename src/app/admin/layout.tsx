import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { SidebarNav } from "./sidebar-nav";
import { AdminNavbar } from "@/components/admin/admin-navbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login?callbackUrl=/admin");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
      {/* Desktop Admin Sidebar (Full Theme Support: Light & Dark) */}
      <aside className="w-68 lg:w-72 flex-col hidden md:flex bg-card text-card-foreground border-r border-border transition-colors duration-300 z-20 shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-border bg-card/95 backdrop-blur">
          <Link href="/admin" className="font-bold text-xl tracking-tight text-foreground flex items-center gap-2.5 group">
            <div className="relative h-8 w-8 shrink-0">
              <Image
                src="/images/icon-light.png"
                alt="Shopora Icon"
                width={32}
                height={32}
                className="h-8 w-8 rounded-lg object-contain dark:hidden group-hover:scale-105 transition-transform"
              />
              <Image
                src="/images/icon-dark.png"
                alt="Shopora Icon"
                width={32}
                height={32}
                className="h-8 w-8 rounded-lg object-contain hidden dark:block group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="flex items-center">
              <span className="font-bold text-lg tracking-[0.14em] uppercase">Shopora</span>
              <span className="text-brand font-light text-xs lowercase ml-1 px-1.5 py-0.5 rounded bg-brand/10 text-brand border border-brand/20">
                admin
              </span>
            </div>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 custom-scrollbar">
          <div className="px-6 mb-3 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
            Main Menu
          </div>
          <SidebarNav />
        </div>

        <div className="p-4 border-t border-border bg-card">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-medium bg-secondary hover:bg-secondary/80 text-foreground transition-all border border-border shadow-2xs"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Dedicated Admin Dashboard Top Navbar */}
        <AdminNavbar user={session.user} />

        {/* Scrollable Dashboard Body */}
        <main className="flex-1 overflow-y-auto bg-muted/20 relative">
          <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
