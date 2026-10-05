import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Package, Users, ShoppingCart, IndianRupee, ArrowRightLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of your store's performance.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">From paid orders</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalOrders}</div>
            <p className="text-xs text-muted-foreground">Total orders placed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">In catalog</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Orders */}
        <Card className="col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                You made {recentOrders.length} sales recently.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/orders">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{order.user.name || "Guest"}</p>
                    <p className="text-sm text-muted-foreground">{order.user.email}</p>
                  </div>
                  <div className="ml-auto font-medium">
                    +{formatPrice(order.total)}
                  </div>
                </div>
              ))}
              {recentOrders.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No recent orders</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card className="col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Low Stock Alerts</CardTitle>
              <CardDescription>
                Products that need restocking.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/inventory">Manage Inventory</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center">
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium leading-none truncate max-w-[200px]" title={product.name}>
                      {product.name}
                    </p>
                    <p className="text-sm text-muted-foreground">{product.sku || "No SKU"}</p>
                  </div>
                  <Badge variant={product.stock === 0 ? "destructive" : "secondary"} className="ml-auto">
                    {product.stock} left
                  </Badge>
                </div>
              ))}
              {lowStockProducts.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Inventory looks good</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Inventory Changes</CardTitle>
              <CardDescription>
                Latest manual adjustments and restocks.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/inventory">View Inventory</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInventoryChanges.map((txn) => (
                <div key={txn.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium leading-none">
                        {txn.product.name} {txn.variant ? `(${txn.variant.color || ""} ${txn.variant.size || ""})` : ""}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {txn.reason} by {txn.user?.name || "System"} on {txn.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground line-through">{txn.previousStock}</div>
                    <Badge variant={txn.changedAmount > 0 ? "default" : "destructive"}>
                      {txn.changedAmount > 0 ? "+" : ""}{txn.changedAmount}
                    </Badge>
                    <div className="text-sm font-bold">{txn.newStock}</div>
                  </div>
                </div>
              ))}
              {recentInventoryChanges.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No recent inventory changes</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
