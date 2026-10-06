import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { 
  LayoutDashboard, 
  ChevronLeft
} from "lucide-react";
import { SidebarNav } from "./sidebar-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
      {/* Admin Sidebar */}
      <aside className="w-72 flex-col hidden md:flex bg-[#0f172a] text-slate-300 border-r border-slate-800 shadow-xl z-20">
        <div className="h-20 flex items-center px-8 border-b border-slate-800/60 bg-[#0f172a]/95 backdrop-blur">
          <Link href="/admin" className="font-bold text-2xl tracking-tight text-white flex items-center gap-2.5 group">
            <div className="bg-indigo-500 p-2 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            SHOPORA<span className="text-indigo-400 font-light text-xl -ml-1">.admin</span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto py-8 custom-scrollbar">
          <div className="px-8 mb-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
            Main Menu
          </div>
          <SidebarNav />
        </div>
        <div className="p-6 border-t border-slate-800/60 bg-slate-900/50">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium bg-slate-800/80 hover:bg-slate-700 text-white transition-all shadow-sm hover:shadow border border-slate-700 hover:border-slate-600"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-[#f4f7f9]">
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-slate-200/60 to-transparent pointer-events-none" />
        <div className="container mx-auto p-8 max-w-7xl relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
