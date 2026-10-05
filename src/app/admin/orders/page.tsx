import { db } from "@/lib/db";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export const metadata = {
  title: "Orders | Admin",
};

export default async function OrdersPage() {
  const orders = await db.order.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground mt-1">
          Manage and track all customer orders.
        </p>
      </div>

      <div className="border rounded-md bg-card overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b">
            <tr>
              <th className="px-6 py-4 font-medium">Order ID</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Total</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Payment</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 font-medium">#{order.id.slice(-6).toUpperCase()}</td>
                <td className="px-6 py-4 text-muted-foreground">
                  {format(new Date(order.createdAt), "MMM d, yyyy")}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium">{order.user.name || "Guest"}</div>
                  <div className="text-xs text-muted-foreground">{order.user.email}</div>
                </td>
                <td className="px-6 py-4 font-medium">₹{order.total.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                    ${order.orderStatus === "DELIVERED" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : 
                      order.orderStatus === "CANCELLED" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" : 
                      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"}`}>
                    {order.orderStatus.toLowerCase()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                    ${order.paymentStatus === "PAID" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : 
                      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"}`}>
                    {order.paymentStatus.toLowerCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/orders/${order.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
