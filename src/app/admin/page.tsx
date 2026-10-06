import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Package, Users, ShoppingCart, IndianRupee, ArrowRightLeft, TrendingUp, AlertCircle, Clock, ClipboardList } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const metadata = {
  title: "Admin Dashboard | Shopora",
};

export default async function AdminDashboardPage() {
  // Aggregate statistics
  const [
    totalProducts,
    totalCustomers,
    totalOrders,
    revenueData
  ] = await Promise.all([
    db.product.count(),
    db.user.count({ where: { role: "CUSTOMER" } }),
    db.order.count(),
    db.order.aggregate({
      _sum: { total: true },
      where: { paymentStatus: "PAID" }
    })
  ]);

  const totalRevenue = revenueData._sum.total || 0;

  // Recent Orders
  const recentOrders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { user: true },
  });

  // Low stock products
  const lowStockProducts = await db.product.findMany({
    where: { stock: { lte: 5 } },
    orderBy: { stock: "asc" },
    take: 5,
  });

  // Recent inventory changes
  const recentInventoryChanges = await db.inventoryTransaction.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { product: true, variant: true, user: true },
  });

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">
            Monitor your store's daily performance and activities.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
          <Clock className="w-4 h-4 text-indigo-500" />
          <span>Last updated: Just now</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-none shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-slate-600">Total Revenue</CardTitle>
            <div className="bg-indigo-100 p-2 rounded-lg">
              <IndianRupee className="h-4 w-4 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-slate-900 mt-2">{formatPrice(totalRevenue)}</div>
            <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-600">
              <TrendingUp className="w-3 h-3" />
              <span>+12.5% from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl border-none shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-slate-600">Total Orders</CardTitle>
            <div className="bg-sky-100 p-2 rounded-lg">
              <ShoppingCart className="h-4 w-4 text-sky-600" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-slate-900 mt-2">{totalOrders}</div>
            <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-600">
              <TrendingUp className="w-3 h-3" />
              <span>+8.2% from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl border-none shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-slate-600">Customers</CardTitle>
            <div className="bg-amber-100 p-2 rounded-lg">
              <Users className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-slate-900 mt-2">{totalCustomers}</div>
            <div className="flex items-center gap-1 mt-2 text-xs font-medium text-slate-500">
              <span>Total registered users</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl border-none shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-slate-600">Products</CardTitle>
            <div className="bg-emerald-100 p-2 rounded-lg">
              <Package className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-slate-900 mt-2">{totalProducts}</div>
            <div className="flex items-center gap-1 mt-2 text-xs font-medium text-slate-500">
              <span>Active in catalog</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Orders */}
        <Card className="col-span-4 rounded-2xl border-none shadow-sm bg-white overflow-hidden flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/50 py-5">
            <div>
              <CardTitle className="text-lg font-bold text-slate-800">Recent Orders</CardTitle>
              <CardDescription className="mt-1">
                Latest {recentOrders.length} transactions in your store.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild className="rounded-lg h-9 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200">
              <Link href="/admin/orders">View All Orders</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <div className="divide-y divide-slate-100">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center p-5 hover:bg-slate-50 transition-colors">
                  <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                    <AvatarImage src={order.user.image || ""} alt={order.user.name || "Guest"} />
                    <AvatarFallback className="bg-indigo-100 text-indigo-700 font-semibold">
                      {(order.user.name || "G").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1 flex-1">
                    <p className="text-sm font-bold leading-none text-slate-900">
                      {order.user.name || "Guest User"}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">{order.user.email}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">
                      {formatPrice(order.total)}
                    </div>
                    <Badge variant="outline" className="mt-1 bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] uppercase font-bold tracking-wider">
                      Paid
                    </Badge>
                  </div>
                </div>
              ))}
              {recentOrders.length === 0 && (
                <div className="p-8 text-center flex flex-col items-center justify-center">
                  <div className="bg-slate-100 p-4 rounded-full mb-3">
                    <ShoppingCart className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-500">No recent orders yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card className="col-span-3 rounded-2xl border-none shadow-sm bg-white overflow-hidden flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/50 py-5">
            <div>
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                Inventory Alerts
                {lowStockProducts.length > 0 && (
                  <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                )}
              </CardTitle>
              <CardDescription className="mt-1">
                Products nearing out of stock.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild className="rounded-lg h-9 hover:bg-slate-100">
              <Link href="/admin/inventory">Manage</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <div className="divide-y divide-slate-100">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center p-5 hover:bg-slate-50 transition-colors">
                  <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-100">
                    <AlertCircle className="h-5 w-5 text-rose-500" />
                  </div>
                  <div className="ml-4 space-y-1.5 flex-1 min-w-0">
                    <p className="text-sm font-bold leading-none text-slate-900 truncate" title={product.name}>
                      {product.name}
                    </p>
                    <p className="text-xs font-medium text-slate-500">{product.sku || "No SKU provided"}</p>
                  </div>
                  <div className="ml-4 text-right flex-shrink-0">
                    <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-bold text-red-700 ring-1 ring-inset ring-red-600/10">
                      {product.stock} left
                    </span>
                  </div>
                </div>
              ))}
              {lowStockProducts.length === 0 && (
                <div className="p-8 text-center flex flex-col items-center justify-center">
                  <div className="bg-emerald-50 p-4 rounded-full mb-3">
                    <Package className="h-6 w-6 text-emerald-500" />
                  </div>
                  <p className="text-sm font-medium text-slate-500">All products are well stocked</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        <Card className="rounded-2xl border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/50 py-5">
            <div>
              <CardTitle className="text-lg font-bold text-slate-800">Recent Inventory Changes</CardTitle>
              <CardDescription className="mt-1">
                Latest manual adjustments and restocks by staff.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild className="rounded-lg h-9 hover:bg-slate-100">
              <Link href="/admin/inventory">View History</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {recentInventoryChanges.map((txn) => (
                <div key={txn.id} className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-100">
                      <ArrowRightLeft className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {txn.product.name} {txn.variant ? <span className="text-slate-500 font-medium">({txn.variant.color || ""} {txn.variant.size || ""})</span> : ""}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          {txn.reason}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          by {txn.user?.name || "System"} • {txn.createdAt.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-slate-400 font-medium line-through">{txn.previousStock}</div>
                    <div className={`flex items-center justify-center min-w-10 px-2 py-1 rounded-md text-xs font-bold ${
                      txn.changedAmount > 0 
                        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20' 
                        : 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20'
                    }`}>
                      {txn.changedAmount > 0 ? "+" : ""}{txn.changedAmount}
                    </div>
                    <div className="text-sm font-bold text-slate-900 w-8 text-right">{txn.newStock}</div>
                  </div>
                </div>
              ))}
              {recentInventoryChanges.length === 0 && (
                <div className="p-8 text-center flex flex-col items-center justify-center">
                  <div className="bg-slate-100 p-4 rounded-full mb-3">
                    <ClipboardList className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-500">No recent inventory changes recorded</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
