"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Loader2, X, ArrowRight, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";

interface SearchProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  brand: string | null;
  category: {
    name: string;
    slug: string;
  };
  images: Array<{ url: string }>;
}

export function SearchDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Keyboard shortcut Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.products || []);
        }
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectProduct = (slug: string) => {
    setOpen(false);
    setQuery("");
    router.push(`/product/${slug}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    router.push(`/products?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="rounded-full text-foreground hover:bg-secondary"
        title="Search products (Ctrl+K)"
      >
        <Search className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden bg-card border-border shadow-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>Search Shopora</DialogTitle>
          </DialogHeader>

          {/* Search Header Input */}
          <form onSubmit={handleSearchSubmit} className="flex items-center border-b border-border px-4 py-3">
            <Search className="h-5 w-5 text-muted-foreground mr-3 shrink-0" />
            <input
              type="text"
              placeholder="Search furniture, decor, lighting..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground text-foreground"
              autoFocus
            />
            {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground ml-2 shrink-0" />}
            {query && !isLoading && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </form>

          {/* Results Container */}
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
            {/* Search Results */}
            {query.trim().length >= 2 ? (
              results.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium text-muted-foreground px-2">
                    <span>Products ({results.length})</span>
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="text-brand hover:underline flex items-center gap-1"
                    >
                      View all results <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="divide-y divide-border/50">
                    {results.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleSelectProduct(product.slug)}
                        className="flex items-center gap-4 p-2.5 rounded-lg hover:bg-secondary/60 cursor-pointer transition-colors group"
                      >
                        <div className="relative h-14 w-14 shrink-0 rounded-md overflow-hidden bg-secondary">
                          {product.images[0]?.url ? (
                            <Image
                              src={product.images[0].url}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                              No pic
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                            {product.category.name}
                          </p>
                          <h4 className="text-sm font-medium text-foreground truncate group-hover:text-brand transition-colors">
                            {product.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-sm font-semibold">{formatPrice(product.price)}</span>
                            {product.comparePrice && (
                              <span className="text-xs text-muted-foreground line-through">
                                {formatPrice(product.comparePrice)}
                              </span>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : !isLoading ? (
                <div className="py-12 text-center text-muted-foreground">
                  <p className="text-sm">No products found for &ldquo;{query}&rdquo;</p>
                  <p className="text-xs mt-1 text-muted-foreground/80">
                    Try searching for &quot;chair&quot;, &quot;table&quot;, &quot;sofa&quot;, or &quot;lamp&quot;.
                  </p>
                </div>
              ) : null
            ) : (
              /* Quick Suggestions When Empty */
              <div className="space-y-4 py-2">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-2">
                    <Sparkles className="h-3.5 w-3.5 text-brand" />
                    <span>Popular Searches</span>
                  </div>
                  <div className="flex flex-wrap gap-2 px-2">
                    {["Lounge Sofa", "Dining Table", "Ceramic Lamp", "Wool Rug", "Accent Chair"].map(
                      (item) => (
                        <button
                          key={item}
                          onClick={() => setQuery(item)}
                          className="px-3 py-1.5 text-xs rounded-full bg-secondary hover:bg-secondary/80 text-foreground transition-colors border border-border"
                        >
                          {item}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-border/50 px-2">
                  <p className="text-xs text-muted-foreground flex items-center justify-between">
                    <span>Press <kbd className="px-1.5 py-0.5 text-[10px] bg-secondary rounded border">Enter</kbd> to search all</span>
                    <span><kbd className="px-1.5 py-0.5 text-[10px] bg-secondary rounded border">ESC</kbd> to close</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
