"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Mail, Trash2, Copy, Check, Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { deleteSubscriber } from "./actions";

interface Subscriber {
  id: string;
  email: string;
  createdAt: Date;
}

export function SubscriberTable({ initialSubscribers }: { initialSubscribers: Subscriber[] }) {
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [searchTerm, setSearchTerm] = useState("");
  const [copied, setCopied] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to remove ${email} from subscribers?`)) return;

    setDeletingId(id);
    const res = await deleteSubscriber(id);
    setDeletingId(null);

    if (res.success) {
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
      toast.success("Subscriber removed successfully");
    } else {
      toast.error("Failed to delete subscriber");
    }
  };

  const copyAllEmails = () => {
    const emails = subscribers.map((s) => s.email).join(", ");
    navigator.clipboard.writeText(emails);
    setCopied(true);
    toast.success("All emails copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const exportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Email,Date Subscribed"].concat(
        subscribers.map((s) => `"${s.email}","${new Date(s.createdAt).toISOString()}"`)
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `shopora-subscribers-${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search subscriber email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-10"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={copyAllEmails}
            disabled={subscribers.length === 0}
            className="h-10 text-xs"
          >
            {copied ? <Check className="h-4 w-4 mr-1.5 text-emerald-500" /> : <Copy className="h-4 w-4 mr-1.5" />}
            Copy All Emails
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={exportCSV}
            disabled={subscribers.length === 0}
            className="h-10 text-xs"
          >
            <Download className="h-4 w-4 mr-1.5" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border text-xs uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Email Address</th>
                <th className="py-3.5 px-4">Subscribed Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-muted-foreground font-light">
                    {searchTerm ? "No subscribers match your search filter." : "No newsletter subscribers yet."}
                  </td>
                </tr>
              ) : (
                filtered.map((sub) => (
                  <tr key={sub.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-4 font-medium flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Mail className="h-4 w-4" />
                      </div>
                      <span className="truncate max-w-xs">{sub.email}</span>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground text-xs font-mono">
                      {format(new Date(sub.createdAt), "MMM d, yyyy · hh:mm a")}
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Active
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(sub.id, sub.email)}
                        disabled={deletingId === sub.id}
                        className="text-muted-foreground hover:text-destructive h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

