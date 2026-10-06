import { db } from "@/lib/db";
import { format } from "date-fns";
import { 
  ShieldAlert, 
  ShieldCheck, 
  User as UserIcon,
  ShoppingBag
} from "lucide-react";
import { UserActions } from "./user-actions";

export const metadata = {
  title: "Users | Admin",
};

export default async function UsersPage() {
  const users = await db.user.findMany({
    include: {
      _count: {
        select: {
          orders: true,
          reviews: true,
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground mt-1">
          Manage customers and admin accounts.
        </p>
      </div>

      <div className="border rounded-md bg-card overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b">
            <tr>
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium text-center">Orders</th>
              <th className="px-6 py-4 font-medium text-center">Reviews</th>
              <th className="px-6 py-4 font-medium">Joined</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium">{user.name || "Unknown"}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${user.role === "ADMIN" ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300" : 
                      user.role === "SELLER" ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300" :
                      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"}`}>
                    {user.role === "ADMIN" ? <ShieldCheck className="h-3.5 w-3.5" /> : 
                     user.role === "SELLER" ? <ShieldAlert className="h-3.5 w-3.5" /> : 
                     <UserIcon className="h-3.5 w-3.5" />}
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground">
                    <ShoppingBag className="h-4 w-4" />
                    <span>{user._count.orders}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center text-muted-foreground">
                  {user._count.reviews}
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {format(new Date(user.createdAt), "MMM d, yyyy")}
                </td>
                <td className="px-6 py-4 text-right">
                  <UserActions user={{ id: user.id, role: user.role, name: user.name }} />
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
