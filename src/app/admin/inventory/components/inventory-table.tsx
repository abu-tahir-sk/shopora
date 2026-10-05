"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { adjustInventory, updateThreshold } from "../actions";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

type InventoryItem = {
  type: "product" | "variant";
  id: string;
  productId: string;
  name: string;
  sku: string;
  stock: number;
  threshold: number;
  updatedAt: Date;
};

export function InventoryTable({ initialData }: { initialData: InventoryItem[] }) {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState(initialData);

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or SKU..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-right">Threshold</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No inventory items found.
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>
                    {item.stock === 0 ? (
                      <Badge variant="destructive">Out of Stock</Badge>
                    ) : item.stock <= item.threshold ? (
                      <Badge className="bg-yellow-500 hover:bg-yellow-600">Low Stock</Badge>
                    ) : (
                      <Badge variant="outline" className="text-green-600 border-green-600">In Stock</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-bold">{item.stock}</TableCell>
                  <TableCell className="text-right">
                    <ThresholdUpdater item={item} />
                  </TableCell>
                  <TableCell className="text-right">
                    <AdjustStockDialog item={item} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function ThresholdUpdater({ item }: { item: InventoryItem }) {
  const [val, setVal] = useState(item.threshold.toString());
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    const num = parseInt(val);
    if (isNaN(num) || num < 0) return;
    setIsUpdating(true);
    try {
      await updateThreshold(item.type, item.id, num);
      toast.success("Threshold updated");
    } catch (e: any) {
      toast.error(e.message || "Failed to update threshold");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Input
        type="number"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        className="w-20 text-right h-8"
        min={0}
      />
      <Button variant="outline" size="sm" onClick={handleUpdate} disabled={isUpdating}>
        Save
      </Button>
    </div>
  );
}

function AdjustStockDialog({ item }: { item: InventoryItem }) {
  const [open, setOpen] = useState(false);
  const [adjustment, setAdjustment] = useState("");
  const [reason, setReason] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const adj = parseInt(adjustment);
    if (isNaN(adj) || adj === 0) {
      toast.error("Please enter a valid adjustment amount (e.g. +10 or -5)");
      return;
    }
    if (!reason) {
      toast.error("Please select or enter a reason");
      return;
    }

    setIsUpdating(true);
    try {
      await adjustInventory(item.type, item.id, adj, reason);
      toast.success("Stock adjusted successfully");
      setOpen(false);
      setAdjustment("");
      setReason("");
    } catch (error: any) {
      toast.error(error.message || "Failed to adjust stock");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Adjust</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust Stock for {item.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid gap-2">
            <Label>Current Stock</Label>
            <div className="text-xl font-bold">{item.stock}</div>
          </div>
          <div className="grid gap-2">
            <Label>Adjustment (+/-)</Label>
            <Input
              type="number"
              placeholder="+10 or -5"
              value={adjustment}
              onChange={(e) => setAdjustment(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label>Reason</Label>
            <Select onValueChange={setReason} value={reason} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Supplier restock">Supplier restock</SelectItem>
                <SelectItem value="Damaged item">Damaged item</SelectItem>
                <SelectItem value="Inventory correction">Inventory correction</SelectItem>
                <SelectItem value="Customer return">Customer return</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating}>
              Confirm Adjustment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
