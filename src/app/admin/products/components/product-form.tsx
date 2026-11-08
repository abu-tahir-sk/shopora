// @ts-nocheck
"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { productSchema, ProductFormValues } from "@/lib/validations/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CloudinaryUpload } from "@/components/cloudinary-upload";
import { createProduct, updateProduct } from "../actions";
import { toast } from "sonner";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Plus, Trash2, Table, Eye, EyeOff } from "lucide-react";
import { ProductDescription } from "@/components/product/product-description";

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  categories: Category[];
  initialData?: ProductFormValues & { id?: string };
}

export function ProductForm({ categories, initialData }: ProductFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [notifySubscribers, setNotifySubscribers] = useState(!initialData?.id);
  const [showDescPreview, setShowDescPreview] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      price: 0,
      comparePrice: "",
      stock: 1,
      sku: "",
      brand: "",
      categoryId: "",
      isFeatured: false,
      isActive: true,
      images: [],
      variants: [],
    },
  });

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const onSubmit = async (data: ProductFormValues) => {
    setIsPending(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "images") {
          (value as string[]).forEach((url) => formData.append("images", url));
        } else if (key === "variants") {
          formData.append("variants", JSON.stringify(value));
        } else if (value !== undefined && value !== null && value !== "") {
          formData.append(key, value === true ? "on" : value.toString());
        }
      });

      if (!initialData?.id && notifySubscribers) {
        formData.append("notifySubscribers", "on");
      }

      if (initialData?.id) {
        await updateProduct(initialData.id, formData);
        toast.success("Product updated successfully");
      } else {
        await createProduct(formData);
        toast.success("Product created successfully");
      }
      
      router.push("/admin/products");
      router.refresh();
    } catch (error: any) {
      if (error?.message === "NEXT_REDIRECT") return;
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Info */}
          <div className="space-y-4 md:col-span-2">
            <h2 className="text-xl font-semibold">Basic Information</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g. Minimalist Sofa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g. Skanvi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <FormLabel className="text-sm font-medium">Description & Specifications Table</FormLabel>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const current = field.value || "";
                            const template = `| Item Code | SH-RK-IRENE-WN |
| Color | Wenge |
| Size (cm) | 45 H x 85 W x 40 D |
| Primary Material | High Durability Engineered Board |
| Hardware | Hettich / Hafele / Ozone |
| Board | Century / Merino / Action Tessa |
| Warranty | 1 year |
| Delivery | 12-15 days (Delhi NCR- 5-7 days) |

---

- Space-Saving Design: This stylish storage bench features open shelves to neatly organize and display up to 12 pairs of shoes.
- Premium Construction: Crafted from high-quality engineered wood with a rich walnut finish for long-lasting durability.
- Convenient Seating: The padded bench top provides comfortable seating while putting on or taking off shoes.
- Elevate your entryway or living space with this stylish and functional furniture piece.`;
                            field.onChange(current ? `${current}\n\n${template}` : template);
                            setShowDescPreview(true);
                            toast.success("Specifications table template added!");
                          }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium transition-colors border"
                        >
                          <Table className="h-3.5 w-3.5 text-primary" />
                          Insert Spec Table
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const current = field.value || "";
                            field.onChange(current ? `${current}\n| Specification Name | Value Details |` : `| Specification Name | Value Details |`);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium transition-colors border"
                        >
                          <Plus className="h-3 w-3" />
                          Add Row
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowDescPreview(!showDescPreview)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md bg-muted hover:bg-muted/80 text-foreground font-medium transition-colors border"
                        >
                          {showDescPreview ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          {showDescPreview ? "Hide Preview" : "Live Preview"}
                        </button>
                      </div>
                    </div>

                    <FormControl>
                      <textarea
                        rows={7}
                        className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm font-mono shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter product description, or click 'Insert Spec Table' above to automatically add a formatted specifications table..."
                        {...field}
                      />
                    </FormControl>
                    <p className="text-[12px] text-muted-foreground">
                      Tip: Use <code className="bg-muted px-1 py-0.5 rounded text-foreground font-mono">| Key | Value |</code> format to generate table rows, <code className="bg-muted px-1 py-0.5 rounded text-foreground font-mono">---</code> for horizontal divider, and <code className="bg-muted px-1 py-0.5 rounded text-foreground font-mono">- Bullet</code> for feature highlights.
                    </p>

                    {showDescPreview && (
                      <div className="mt-4 p-4 rounded-lg border border-border bg-card shadow-sm">
                        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                          <Eye className="h-3.5 w-3.5" />
                          Live Customer View Preview
                        </div>
                        <ProductDescription content={field.value} />
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Pricing & Inventory (Base)</h2>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (₹) *</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="comparePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compare at Price (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00 (Optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Quantity *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU (Stock Keeping Unit)</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g. FUR-SOFA-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Organization & Media */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Organization & Media</h2>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="" disabled>Select a category</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                    {categories.length === 0 && (
                      <p className="text-xs text-destructive mt-1">Please create a category first.</p>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem className="pt-2">
                    <FormLabel>Product Images *</FormLabel>
                    <FormControl>
                      <CloudinaryUpload
                        defaultImages={field.value}
                        onUpload={(urls) => field.onChange(urls)}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload high-quality images for your product.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4 pt-4 border-t">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Active (Visible to customers)</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Featured Product</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                {!initialData?.id && (
                  <div className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-primary/5 border-primary/20 md:col-span-2">
                    <input
                      type="checkbox"
                      id="notifySubscribers"
                      checked={notifySubscribers}
                      onChange={(e) => setNotifySubscribers(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 mt-0.5"
                    />
                    <div className="space-y-1 leading-none">
                      <label htmlFor="notifySubscribers" className="text-sm font-medium cursor-pointer">
                        Email Launch Announcement to Subscribers
                      </label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Automatically notify all verified newsletter subscribers about this new product with photo and pricing.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Variants */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Product Variants</h2>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => appendVariant({ size: "", color: "", sku: "", price: "", stock: 0 })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Variant
              </Button>
            </div>
            
            {variantFields.length === 0 ? (
              <div className="text-center p-6 border rounded-md border-dashed text-muted-foreground">
                No variants added. The base product details will be used.
              </div>
            ) : (
              <div className="border rounded-md divide-y">
                {variantFields.map((field, index) => (
                  <div key={field.id} className="p-4 grid gap-4 grid-cols-1 md:grid-cols-6 items-start relative">
                    <FormField
                      control={form.control as any}
                      name={`variants.${index}.size`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Size</FormLabel>
                          <FormControl>
                            <Input placeholder="M, L, XL..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control as any}
                      name={`variants.${index}.color`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Color</FormLabel>
                          <FormControl>
                            <Input placeholder="Red, Blue..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control as any}
                      name={`variants.${index}.sku`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">SKU</FormLabel>
                          <FormControl>
                            <Input placeholder="SKU-123" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control as any}
                      name={`variants.${index}.price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Override Price</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="Base" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control as any}
                      name={`variants.${index}.stock`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Stock *</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end md:mt-7">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive"
                        onClick={() => removeVariant(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-6 border-t">
          <Button type="button" variant="outline" asChild disabled={isPending}>
            <Link href="/admin/products">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData?.id ? "Save Changes" : "Create Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
