import { Metadata } from "next";
import { db } from "@/lib/db";
import { Mail, Users, TrendingUp, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriberTable } from "./subscriber-table";
import { CampaignDialog } from "./campaign-dialog";

export const metadata: Metadata = {
  title: "Newsletter Subscribers | Admin",
  description: "View and manage email newsletter subscribers.",
};

export const dynamic = "force-dynamic";

export default async function AdminSubscribersPage() {
  const subscribers = await db.newsletterSubscriber.findMany({
    orderBy: { createdAt: "desc" },
  });

  const total = subscribers.length;
  const recentWeek = subscribers.filter((s) => {
    const diffDays = (Date.now() - new Date(s.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Newsletter Subscribers</h1>
          <p className="text-sm text-muted-foreground">
            Audience who subscribed to news, product drops and promotional campaigns from the storefront.
          </p>
        </div>
        <CampaignDialog subscriberCount={total} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs uppercase font-semibold tracking-wider text-muted-foreground">
              Total Subscribers
            </CardTitle>
            <Mail className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{total}</div>
            <p className="text-xs text-muted-foreground mt-1">Verified audience members</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs uppercase font-semibold tracking-wider text-muted-foreground">
              Past 7 Days
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">+{recentWeek}</div>
            <p className="text-xs text-muted-foreground mt-1">New sign-ups this week</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs uppercase font-semibold tracking-wider text-muted-foreground">
              Latest Activity
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium truncate">
              {subscribers[0] ? subscribers[0].email : "No subscribers yet"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {subscribers[0] ? new Date(subscribers[0].createdAt).toLocaleDateString() : "Awaiting first subscriber"}
            </p>
          </CardContent>
        </Card>
      </div>

      <SubscriberTable initialSubscribers={subscribers} />
    </div>
  );
}

