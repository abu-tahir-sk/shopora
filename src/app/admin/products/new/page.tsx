import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ProductForm } from "../components/product-form";

export const metadata = {
  title: "Add Product | Admin",
};

export default async function NewProductPage() {
  const categories = await db.category.findMany({
    orderBy: { name: "asc" }
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/products">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Product</h1>
          <p className="text-muted-foreground mt-1">
            Create a new product for your store.
          </p>
        </div>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
