import { Metadata } from "next";
import { db } from "@/lib/db";
import { MessageSquare, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessagesTable } from "./messages-table";

export const metadata: Metadata = {
  title: "Customer Inquiries | Admin",
  description: "Manage customer questions, support requests and feedback.",
};

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await db.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  const total = messages.length;
  const unread = messages.filter((m) => m.status === "UNREAD").length;
  const resolved = total - unread;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customer Inquiries</h1>
          <p className="text-sm text-muted-foreground">
            Messages and support inquiries submitted through the Contact Concierge form.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs uppercase font-semibold tracking-wider text-muted-foreground">
              Total Inquiries
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{total}</div>
            <p className="text-xs text-muted-foreground mt-1">All time customer queries</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs uppercase font-semibold tracking-wider text-muted-foreground">
              Awaiting Action
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{unread}</div>
            <p className="text-xs text-muted-foreground mt-1">Unread / pending messages</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs uppercase font-semibold tracking-wider text-muted-foreground">
              Resolved
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{resolved}</div>
            <p className="text-xs text-muted-foreground mt-1">Processed inquiries</p>
          </CardContent>
        </Card>
      </div>

      <MessagesTable initialMessages={messages} />
    </div>
  );
}

