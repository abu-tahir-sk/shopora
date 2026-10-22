import { Metadata } from "next";
import { db } from "@/lib/db";
import { format } from "date-fns";
import { Users, ShoppingCart, IndianRupee, Mail, Phone, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Customers | Admin",
  description: "View customer profiles, order history, and lifetime spending value.",
};

export default async function AdminCustomersPage() {
  const customers = await db.user.findMany({
    where: {
      role: "CUSTOMER",
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      orders: {
        select: {
          id: true,
          total: true,
          createdAt: true,
          paymentStatus: true,
        },
      },
      addresses: {
        take: 1,
        select: {
          city: true,
          state: true,
          phone: true,
        },
      },
    },
  });

  // Calculate statistics
  const totalCustomers = customers.length;
  const customersWithOrders = customers.filter((c) => c.orders.length > 0);
  const totalCustomerSpending = customers.reduce((sum, c) => {
    const customerTotal = c.orders.reduce((oSum, o) => oSum + o.total, 0);
    return sum + customerTotal;
  }, 0);
  const avgOrderValue = customersWithOrders.length > 0 ? totalCustomerSpending / customersWithOrders.length : 0;

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Customer Management
        </h1>
        <p className="text-slate-500 mt-2 text-sm font-medium">
          Detailed metrics, order histories, and lifetime value for all registered store buyers.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="rounded-2xl border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600">Total Customers</CardTitle>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalCustomers}</div>
            <p className="text-xs text-slate-500 mt-1">
              {customersWithOrders.length} active with placed orders
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600">Total Customer Revenue</CardTitle>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <IndianRupee className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{formatPrice(totalCustomerSpending)}</div>
            <p className="text-xs text-slate-500 mt-1">
              Combined value of all completed customer carts
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600">Avg. Spend Per Buyer</CardTitle>
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <ShoppingCart className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{formatPrice(avgOrderValue)}</div>
            <p className="text-xs text-slate-500 mt-1">
              Average lifetime value per purchasing account
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">All Customers ({totalCustomers})</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Contact</th>
                <th className="px-6 py-4 font-semibold">Location</th>
                <th className="px-6 py-4 font-semibold text-center">Orders</th>
                <th className="px-6 py-4 font-semibold">Total Spent</th>
                <th className="px-6 py-4 font-semibold">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((c) => {
                const totalSpent = c.orders.reduce((sum, o) => sum + o.total, 0);
                const location = c.addresses[0]
                  ? `${c.addresses[0].city}, ${c.addresses[0].state}`
                  : "Not set";
                const phone = c.phone || c.addresses[0]?.phone || "N/A";

                return (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-slate-200">
                          <AvatarImage src={c.image || ""} />
                          <AvatarFallback className="bg-slate-100 font-semibold text-slate-700">
                            {(c.name || "U").slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-slate-900">{c.name || "Anonymous Buyer"}</p>
                          <p className="text-xs text-slate-500 font-mono">ID: {c.id.slice(0, 10)}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-slate-700">
                          <Mail className="h-3.5 w-3.5 text-slate-400" />
                          <span>{c.email}</span>
                        </div>
                        {phone !== "N/A" && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Phone className="h-3.5 w-3.5 text-slate-400" />
                            <span>{phone}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-600 font-medium">
                      {location}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">
                        {c.orders.length}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900">
                        {formatPrice(totalSpent)}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>{format(new Date(c.createdAt), "MMM d, yyyy")}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
