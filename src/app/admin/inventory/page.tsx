import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, AlertTriangle, XCircle, ArrowRightLeft } from "lucide-react";
import { InventoryTable } from "./components/inventory-table";

export const metadata = {
  title: "Inventory Management | Admin",
};

export default async function InventoryPage() {
  const products = await db.product.findMany({
    include: {
      variants: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const inventoryItems: any[] = products.flatMap((product): any[] => {
    if (product.variants.length > 0) {
      return product.variants.map((variant) => ({
        type: "variant" as const,
        id: variant.id,
        productId: product.id,
        name: `${product.name} - ${variant.color || ""} ${variant.size || ""}`.trim(),
        sku: variant.sku || "N/A",
        stock: variant.stock,
        threshold: variant.lowStockThreshold,
        updatedAt: product.updatedAt,
      }));
    }
    return [
      {
        type: "product" as const,
        id: product.id,
        productId: product.id,
        name: product.name,
        sku: product.sku || "N/A",
        stock: product.stock,
        threshold: product.lowStockThreshold,
        updatedAt: product.updatedAt,
      },
    ];
  });

  const totalItems = inventoryItems.length;
  const lowStockItems = inventoryItems.filter(
    (item) => item.stock > 0 && item.stock <= item.threshold
  ).length;
  const outOfStockItems = inventoryItems.filter((item) => item.stock === 0).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
        <p className="text-muted-foreground mt-1">
          Manage your product stock levels and thresholds.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tracked Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{outOfStockItems}</div>
          </CardContent>
        </Card>
      </div>

      <InventoryTable initialData={inventoryItems} />
    </div>
  );
}
