import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCategory } from "./actions";
import { AdminPagination } from "@/components/ui/pagination";
import { DeleteCategoryButton } from "./components/delete-category-button";

export const metadata = {
  title: "Categories | Admin",
};

interface CategoriesPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CategoriesPage({ searchParams }: CategoriesPageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, Number(params?.page) || 1);
  const PAGE_SIZE = 10;

  const [totalCategories, categories] = await Promise.all([
    db.category.count(),
    db.category.findMany({
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const totalPages = Math.ceil(totalCategories / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <p className="text-muted-foreground mt-1">
          Manage product categories for your store.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 border rounded-md p-6 bg-card h-fit">
          <h2 className="text-lg font-semibold mb-4">Add New Category</h2>
          <form action={createCategory} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <Input id="name" name="name" required placeholder="E.g. Living Room" />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <textarea 
                id="description" 
                name="description" 
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Optional description"
              />
            </div>
            <Button type="submit" className="w-full">Create Category</Button>
          </form>
        </div>

        <div className="md:col-span-2 border rounded-md bg-card overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Slug</th>
                <th className="px-6 py-4 font-medium text-center">Products</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium">{cat.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{cat.slug}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center bg-muted px-2 py-1 rounded-full text-xs font-medium">
                      {cat._count.products}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DeleteCategoryButton
                      id={cat.id}
                      name={cat.name}
                      hasProducts={cat._count.products > 0}
                    />
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    No categories found. Create your first category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="border-t border-border px-4 bg-card">
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalCategories}
              pageSize={PAGE_SIZE}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
