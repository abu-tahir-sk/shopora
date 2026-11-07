import { Metadata } from "next";
import { db } from "@/lib/db";
import { format } from "date-fns";
import { Users, ShoppingCart, IndianRupee, Mail, Phone, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { AdminPagination } from "@/components/ui/pagination";

export const metadata: Metadata = {
  title: "Customers | Admin",
  description: "View customer profiles, order history, and lifetime spending value.",
};

interface AdminCustomersPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminCustomersPage({ searchParams }: AdminCustomersPageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, Number(params?.page) || 1);
  const PAGE_SIZE = 10;

  // Aggregate metrics
  const [totalCustomersCount, spendingAgg, customers] = await Promise.all([
    db.user.count({ where: { role: "CUSTOMER" } }),
    db.order.aggregate({
      _sum: { total: true },
      where: { paymentStatus: "PAID" },
    }),
    db.user.findMany({
      where: {
        role: "CUSTOMER",
      },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
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
    }),
  ]);

  const totalPages = Math.ceil(totalCustomersCount / PAGE_SIZE);
  const totalCustomerSpending = spendingAgg._sum.total || 0;
  const avgOrderValue = totalCustomersCount > 0 ? totalCustomerSpending / totalCustomersCount : 0;

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
        <Card className="rounded-2xl border border-border shadow-2xs bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Total Customers</CardTitle>
            <div className="p-2.5 bg-blue-500/15 text-blue-600 dark:text-blue-400 rounded-xl">
              <Users className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalCustomersCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Registered customer accounts
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border shadow-2xs bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Total Customer Revenue</CardTitle>
            <div className="p-2.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <IndianRupee className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatPrice(totalCustomerSpending)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Combined value of all completed customer carts
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border shadow-2xs bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Avg. Spend Per Buyer</CardTitle>
            <div className="p-2.5 bg-brand/15 text-brand rounded-xl">
              <ShoppingCart className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatPrice(avgOrderValue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Average lifetime value per registered account
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Customers Table */}
      <div className="bg-card rounded-2xl border border-border shadow-2xs overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">All Customers ({totalCustomersCount})</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/40 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Contact</th>
                <th className="px-6 py-4 font-semibold">Location</th>
                <th className="px-6 py-4 font-semibold text-center">Orders</th>
                <th className="px-6 py-4 font-semibold">Total Spent</th>
                <th className="px-6 py-4 font-semibold">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {customers.map((c) => {
                const totalSpent = c.orders.reduce((sum, o) => sum + o.total, 0);
                const location = c.addresses[0]
                  ? `${c.addresses[0].city}, ${c.addresses[0].state}`
                  : "Not set";
                const phone = c.phone || c.addresses[0]?.phone || "N/A";

                return (
                  <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-border">
                          <AvatarImage src={c.image || ""} />
                          <AvatarFallback className="bg-brand/10 font-semibold text-brand">
                            {(c.name || "U").slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-foreground">{c.name || "Anonymous Buyer"}</p>
                          <p className="text-xs text-muted-foreground font-mono">ID: {c.id.slice(0, 10)}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-foreground/80">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{c.email}</span>
                        </div>
                        {phone !== "N/A" && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{phone}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs text-muted-foreground font-medium">
                      {location}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold bg-secondary text-foreground">
                        {c.orders.length}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-bold text-foreground">
                        {formatPrice(totalSpent)}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{format(new Date(c.createdAt), "MMM d, yyyy")}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-border px-4 bg-card">
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalCustomersCount}
            pageSize={PAGE_SIZE}
          />
        </div>
      </div>
    </div>
  );
}
