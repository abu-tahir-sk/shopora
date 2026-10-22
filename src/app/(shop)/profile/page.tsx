import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { format } from "date-fns";
import { ProfileClient } from "./profile-client";

export const metadata: Metadata = {
  title: "My Profile | Shopora",
  description: "Manage your personal profile, addresses, and account settings.",
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/profile");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      phone: true,
      role: true,
      createdAt: true,
      password: true,
      addresses: {
        orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
      },
      orders: {
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  images: {
                    take: 1,
                    orderBy: { position: "asc" },
                    select: { url: true },
                  },
                },
              },
            },
          },
        },
      },
      _count: {
        select: {
          orders: true,
          wishlist: true,
          addresses: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  // Aggregate total spent across active orders
  const totalSpentAgg = await db.order.aggregate({
    where: {
      userId: session.user.id,
      orderStatus: { not: "CANCELLED" },
    },
    _sum: {
      total: true,
    },
  });

  const totalSpent = totalSpentAgg._sum.total || 0;

  // Format dates deterministically on the server
  const formattedOrders = user.orders.map((order) => ({
    ...order,
    formattedDate: format(new Date(order.createdAt), "dd MMM yyyy"),
  }));

  const memberSince = format(new Date(user.createdAt), "MMM yyyy");

  return (
    <ProfileClient
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
        memberSince,
        hasPassword: Boolean(user.password),
      }}
      addresses={user.addresses}
      recentOrders={formattedOrders}
      stats={{
        orderCount: user._count.orders,
        wishlistCount: user._count.wishlist,
        addressCount: user._count.addresses,
        totalSpent,
      }}
    />
  );
}
