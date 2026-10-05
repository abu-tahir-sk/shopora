import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { ProductForm } from "../../components/product-form";

export const metadata = {
  title: "Edit Product | Admin",
};

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, categories] = await Promise.all([
    db.product.findUnique({
      where: { id: params.id },
      include: { 
        images: true,
        variants: true,
      }
    }),
    db.category.findMany({
      orderBy: { name: "asc" }
    })
  ]);

  if (!product) {
    notFound();
  }

  const initialData: any = {
    id: product.id,
    name: product.name,
    description: product.description || "",
    price: product.price,
    comparePrice: product.comparePrice === null ? "" : Number(product.comparePrice),
    stock: product.stock,
    sku: product.sku || "",
    brand: product.brand || "",
    categoryId: product.categoryId,
    isFeatured: product.isFeatured,
    isActive: product.isActive,
    images: product.images.map(img => img.url),
    variants: product.variants.map(v => ({
      id: v.id,
      size: v.size || "",
      color: v.color || "",
      sku: v.sku || "",
      price: v.price === null ? "" : Number(v.price),
      stock: v.stock,
    })),
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/products">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
          <p className="text-muted-foreground mt-1">
            Update {product.name}
          </p>
        </div>
      </div>

      <ProductForm categories={categories} initialData={initialData} />
    </div>
  );
}
