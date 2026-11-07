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
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-2 text-sm font-medium">
            Monitor your store's daily performance and activities.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card px-4 py-2 rounded-xl shadow-2xs border border-border">
          <Clock className="w-4 h-4 text-brand" />
          <span>Last updated: Just now</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border border-border shadow-2xs hover:shadow-xs transition-shadow bg-card overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Total Revenue</CardTitle>
            <div className="bg-brand/15 p-2 rounded-lg text-brand">
              <IndianRupee className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-foreground mt-2">{formatPrice(totalRevenue)}</div>
            <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-3 h-3" />
              <span>+12.5% from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl border border-border shadow-2xs hover:shadow-xs transition-shadow bg-card overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Total Orders</CardTitle>
            <div className="bg-sky-500/15 p-2 rounded-lg text-sky-600 dark:text-sky-400">
              <ShoppingCart className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-foreground mt-2">{totalOrders}</div>
            <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-3 h-3" />
              <span>+8.2% from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl border border-border shadow-2xs hover:shadow-xs transition-shadow bg-card overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Customers</CardTitle>
            <div className="bg-amber-500/15 p-2 rounded-lg text-amber-600 dark:text-amber-400">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-foreground mt-2">{totalCustomers}</div>
            <div className="flex items-center gap-1 mt-2 text-xs font-medium text-muted-foreground">
              <span>Total registered users</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl border border-border shadow-2xs hover:shadow-xs transition-shadow bg-card overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Products</CardTitle>
            <div className="bg-emerald-500/15 p-2 rounded-lg text-emerald-600 dark:text-emerald-400">
              <Package className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-foreground mt-2">{totalProducts}</div>
            <div className="flex items-center gap-1 mt-2 text-xs font-medium text-muted-foreground">
              <span>Active in catalog</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Orders */}
        <Card className="col-span-4 rounded-2xl border border-border shadow-2xs bg-card overflow-hidden flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-muted/30 py-5">
            <div>
              <CardTitle className="text-lg font-bold text-foreground">Recent Orders</CardTitle>
              <CardDescription className="mt-1">
                Latest {recentOrders.length} transactions in your store.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild className="rounded-lg h-9 hover:bg-secondary">
              <Link href="/admin/orders">View All Orders</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <div className="divide-y divide-border">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center p-5 hover:bg-muted/40 transition-colors">
                  <Avatar className="h-10 w-10 border border-border shadow-2xs">
                    <AvatarImage src={order.user?.image || ""} alt={order.user?.name || "Guest"} />
                    <AvatarFallback className="bg-brand/10 text-brand font-semibold">
                      {(order.user?.name || "G").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1 flex-1">
                    <p className="text-sm font-bold leading-none text-foreground">
                      {order.user?.name || "Guest User"}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium">{order.user?.email || "No email"}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-foreground">
                      {formatPrice(order.total)}
                    </div>
                    <Badge variant="outline" className="mt-1 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] uppercase font-bold tracking-wider">
                      Paid
                    </Badge>
                  </div>
                </div>
              ))}
              {recentOrders.length === 0 && (
                <div className="p-8 text-center flex flex-col items-center justify-center">
                  <div className="bg-muted p-4 rounded-full mb-3">
                    <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">No recent orders yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card className="col-span-3 rounded-2xl border border-border shadow-2xs bg-card overflow-hidden flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-muted/30 py-5">
            <div>
              <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                Inventory Alerts
                {lowStockProducts.length > 0 && (
                  <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                )}
              </CardTitle>
              <CardDescription className="mt-1">
                Products nearing out of stock.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild className="rounded-lg h-9 hover:bg-secondary">
              <Link href="/admin/inventory">Manage</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <div className="divide-y divide-border">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center p-5 hover:bg-muted/40 transition-colors">
                  <div className="bg-rose-500/15 p-2.5 rounded-xl border border-rose-500/30 text-rose-600 dark:text-rose-400">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div className="ml-4 space-y-1.5 flex-1 min-w-0">
                    <p className="text-sm font-bold leading-none text-foreground truncate" title={product.name}>
                      {product.name}
                    </p>
                    <p className="text-xs font-medium text-muted-foreground">{product.sku || "No SKU provided"}</p>
                  </div>
                  <div className="ml-4 text-right flex-shrink-0">
                    <span className="inline-flex items-center rounded-md bg-rose-500/15 px-2 py-1 text-xs font-bold text-rose-600 dark:text-rose-400 border border-rose-500/30">
                      {product.stock} left
                    </span>
                  </div>
                </div>
              ))}
              {lowStockProducts.length === 0 && (
                <div className="p-8 text-center flex flex-col items-center justify-center">
                  <div className="bg-emerald-500/15 p-4 rounded-full mb-3 text-emerald-600 dark:text-emerald-400">
                    <Package className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">All products are well stocked</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        <Card className="rounded-2xl border border-border shadow-2xs bg-card overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-muted/30 py-5">
            <div>
              <CardTitle className="text-lg font-bold text-foreground">Recent Inventory Changes</CardTitle>
              <CardDescription className="mt-1">
                Latest manual adjustments and restocks by staff.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild className="rounded-lg h-9 hover:bg-secondary">
              <Link href="/admin/inventory">View History</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {recentInventoryChanges.map((txn) => (
                <div key={txn.id} className="flex items-center justify-between p-5 hover:bg-muted/40 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-500/15 p-2.5 rounded-xl border border-blue-500/30 text-blue-600 dark:text-blue-400">
                      <ArrowRightLeft className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        {txn.product?.name || "Product"} {txn.variant ? <span className="text-muted-foreground font-medium">({txn.variant.color || ""} {txn.variant.size || ""})</span> : ""}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-semibold text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">
                          {txn.reason}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">
                          by {txn.user?.name || "System"} • {txn.createdAt.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground font-medium line-through">{txn.previousStock}</div>
                    <div className={`flex items-center justify-center min-w-10 px-2 py-1 rounded-md text-xs font-bold ${
                      txn.changedAmount > 0 
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' 
                        : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                    }`}>
                      {txn.changedAmount > 0 ? "+" : ""}{txn.changedAmount}
                    </div>
                    <div className="text-sm font-bold text-foreground w-8 text-right">{txn.newStock}</div>
                  </div>
                </div>
              ))}
              {recentInventoryChanges.length === 0 && (
                <div className="p-8 text-center flex flex-col items-center justify-center">
                  <div className="bg-muted p-4 rounded-full mb-3">
                    <ClipboardList className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">No recent inventory changes recorded</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
