"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ExportOrdersButtonProps {
  orders: Array<{
    id: string;
    orderNumber: string;
    createdAt: Date | string;
    total: number;
    orderStatus: string;
    paymentStatus: string;
    user: {
      name: string | null;
      email: string | null;
    };
    itemsCount: number;
  }>;
}

export function ExportOrdersButton({ orders }: ExportOrdersButtonProps) {
  const handleExport = () => {
    if (!orders || orders.length === 0) {
      toast.error("No orders available to export");
      return;
    }

    try {
      const headers = [
        "Order ID",
        "Order Number",
        "Date",
        "Customer Name",
        "Customer Email",
        "Items Count",
        "Total (INR)",
        "Order Status",
        "Payment Status",
      ];

      const csvRows = orders.map((o) => [
        `"${o.id}"`,
        `"${o.orderNumber}"`,
        `"${new Date(o.createdAt).toLocaleDateString()}"`,
        `"${(o.user.name || "Guest").replace(/"/g, '""')}"`,
        `"${(o.user.email || "").replace(/"/g, '""')}"`,
        o.itemsCount,
        o.total,
        `"${o.orderStatus}"`,
        `"${o.paymentStatus}"`,
      ]);

      const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers.join(","), ...csvRows.map((e) => e.join(","))].join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Shopora_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Exported ${orders.length} orders to CSV`);
    } catch (err) {
      console.error("Export error", err);
      toast.error("Failed to export orders");
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      className="gap-2 text-xs h-9"
    >
      <Download className="h-3.5 w-3.5" />
      Export CSV
    </Button>
  );
}
