"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SlidersHorizontal, Search } from "lucide-react";

export function ProductFilters({ categories }: { categories: { id: string, name: string, slug: string }[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentCategory = searchParams.get("category") || "";
  const currentSort = searchParams.get("sort") || "";
  const currentQ = searchParams.get("q") || "";

  const [q, setQ] = useState(currentQ);
  const [category, setCategory] = useState(currentCategory);
  const [sort, setSort] = useState(currentSort);
  const [isOpen, setIsOpen] = useState(false);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    if (sort) params.set("sort", sort);
    
    router.push(`/products?${params.toString()}`);
    setIsOpen(false);
  };

  const clearFilters = () => {
    setQ("");
    setCategory("");
    setSort("");
    router.push(`/products`);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger render={
        <button className="flex items-center gap-2 text-sm font-medium tracking-wide uppercase border border-border px-4 py-2 hover:bg-secondary transition-colors">
          <SlidersHorizontal className="h-4 w-4" />
          Filter & Search
        </button>
      } />
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="font-light tracking-widest uppercase">Filters</SheetTitle>
        </SheetHeader>
        
        <div className="py-6 flex flex-col gap-8">
          {/* Search */}
          <div className="space-y-3">
            <Label>Search Products</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search..." 
                className="pl-9"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              />
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <Label>Category</Label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input 
                  type="radio" 
                  name="category" 
                  checked={category === ""} 
                  onChange={() => setCategory("")} 
                  className="accent-brand"
                />
                All Categories
              </label>
              {categories.map((cat) => (
                <label key={cat.id} className="flex items-center gap-2 text-sm">
                  <input 
                    type="radio" 
                    name="category" 
                    checked={category === cat.slug} 
                    onChange={() => setCategory(cat.slug)}
                    className="accent-brand"
                  />
                  {cat.name}
                </label>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="space-y-3">
            <Label>Sort By</Label>
            <select 
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full border border-border bg-background p-2 text-sm rounded-none focus:outline-none focus:border-foreground"
            >
              <option value="">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-8">
          <Button onClick={applyFilters} className="w-full uppercase tracking-widest font-medium rounded-none">
            Apply Filters
          </Button>
          <Button onClick={clearFilters} variant="outline" className="w-full uppercase tracking-widest font-medium rounded-none">
            Clear All
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
