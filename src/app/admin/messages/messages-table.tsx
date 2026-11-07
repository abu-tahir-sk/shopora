"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Mail, Trash2, CheckCircle, Search, MessageSquare, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { updateMessageStatus, deleteMessage } from "./actions";
import { ClientPagination } from "@/components/ui/pagination";

interface Message {
  id: string;
  name: string;
  email: string;
  orderNumber: string | null;
  subject: string | null;
  message: string;
  status: string;
  createdAt: Date;
}

export function MessagesTable({ initialMessages }: { initialMessages: Message[] }) {
  const [messages, setMessages] = useState(messagesWithDates(initialMessages));
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  function messagesWithDates(msgs: Message[]) {
    return msgs.map((m) => ({ ...m, createdAt: new Date(m.createdAt) }));
  }

  const filtered = messages.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.subject && m.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
    m.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paginatedMessages = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setPage(1);
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "UNREAD" ? "RESOLVED" : "UNREAD";
    const res = await updateMessageStatus(id, nextStatus);
    if (res.success) {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: nextStatus } : m))
      );
      if (selectedMessage?.id === id) {
        setSelectedMessage((prev) => (prev ? { ...prev, status: nextStatus } : null));
      }
      toast.success(`Message marked as ${nextStatus.toLowerCase()}`);
    } else {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this inquiry?")) return;

    const res = await deleteMessage(id);
    if (res.success) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
      toast.success("Message deleted successfully");
    } else {
      toast.error("Failed to delete message");
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search inquiries by customer or topic..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9 h-10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={`border border-border rounded-xl overflow-hidden bg-card shadow-sm ${selectedMessage ? "lg:col-span-7" : "lg:col-span-12"}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Subject</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-muted-foreground font-light">
                      {searchTerm ? "No inquiries match your query." : "No customer inquiries yet."}
                    </td>
                  </tr>
                ) : (
                  paginatedMessages.map((msg) => (
                    <tr
                      key={msg.id}
                      onClick={() => setSelectedMessage(msg)}
                      className={`hover:bg-muted/40 cursor-pointer transition-colors ${selectedMessage?.id === msg.id ? "bg-muted/50" : ""}`}
                    >
                      <td className="py-4 px-4 font-medium">
                        <div className="flex flex-col">
                          <span className="text-foreground">{msg.name}</span>
                          <span className="text-xs text-muted-foreground font-mono">{msg.email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 max-w-xs truncate">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground truncate">{msg.subject || "(No subject)"}</span>
                          <span className="text-xs text-muted-foreground truncate">{msg.message}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-xs text-muted-foreground font-mono whitespace-nowrap">
                        {format(new Date(msg.createdAt), "MMM d, yyyy")}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${msg.status === "UNREAD"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            }`}
                        >
                          {msg.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            title={msg.status === "UNREAD" ? "Mark resolved" : "Mark unread"}
                            onClick={() => handleStatusToggle(msg.id, msg.status)}
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete inquiry"
                            onClick={() => handleDelete(msg.id)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="border-t border-border px-4 bg-card">
              <ClientPagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={filtered.length}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
              />
            </div>
          </div>
        </div>

        {selectedMessage && (
          <div className="lg:col-span-5 border border-border rounded-xl p-6 bg-card shadow-sm space-y-5 animate-in fade-in duration-200">
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div>
                <h3 className="font-semibold text-lg">{selectedMessage.subject || "Customer Inquiry"}</h3>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                  Received on {format(new Date(selectedMessage.createdAt), "MMMM d, yyyy · hh:mm a")}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedMessage(null)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Close
              </Button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2 text-xs bg-muted/40 p-3 rounded-lg border border-border/50">
                <div>
                  <span className="text-muted-foreground block">Customer Name</span>
                  <span className="font-medium text-foreground">{selectedMessage.name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Email Address</span>
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || "Shopora Inquiry")}`}
                    className="font-medium text-primary underline underline-offset-2"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
                {selectedMessage.orderNumber && (
                  <div className="col-span-2 pt-1 border-t border-border/40">
                    <span className="text-muted-foreground block">Order Reference</span>
                    <span className="font-mono font-medium text-foreground">#{selectedMessage.orderNumber}</span>
                  </div>
                )}
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                  Message Content
                </span>
                <div className="p-4 rounded-lg bg-background border border-border text-foreground leading-relaxed whitespace-pre-wrap font-light text-sm">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusToggle(selectedMessage.id, selectedMessage.status)}
                className="text-xs"
              >
                {selectedMessage.status === "UNREAD" ? "Mark as Resolved" : "Mark as Unread"}
              </Button>

              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || "Shopora Inquiry")}`}
                className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
              >
                <Mail className="h-3.5 w-3.5 mr-1.5" />
                Reply via Email
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

