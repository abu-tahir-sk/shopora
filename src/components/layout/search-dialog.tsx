"use client";

import { useState, useEffect } from "react";
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

interface SearchDialogProps {
  showDesktopPill?: boolean;
}

export function SearchDialog({ showDesktopPill = true }: SearchDialogProps) {
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

  // Debounced search without synchronous setState in effect body
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
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

  const activeResults = query.trim().length >= 2 ? results : [];

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
      {/* Desktop Search Pill Trigger */}
      {showDesktopPill && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="hidden xl:flex items-center gap-3 px-3.5 py-1.5 rounded-full border border-border/80 bg-secondary/40 hover:bg-secondary/80 text-muted-foreground hover:text-foreground text-xs transition-all duration-200 w-52 2xl:w-64 justify-between group shadow-2xs"
          title="Search products (Ctrl+K)"
        >
          <span className="flex items-center gap-2 truncate">
            <Search className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:scale-110" />
            <span className="truncate font-light text-[11px] sm:text-xs">Search luxury pieces...</span>
          </span>
          <kbd className="pointer-events-none inline-flex h-4.5 select-none items-center gap-0.5 rounded border border-border/80 bg-background px-1.5 font-mono text-[9px] font-medium text-muted-foreground group-hover:border-foreground/30">
            <span className="text-[10px]">⌘</span>K
          </kbd>
        </button>
      )}

      {/* Compact Icon Trigger (Always on mobile/tablet, fallback on desktop if pill hidden) */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className={`rounded-full text-foreground hover:bg-secondary transition-all ${
          showDesktopPill ? "xl:hidden" : ""
        }`}
        title="Search products (Ctrl+K)"
        aria-label="Search products"
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
                aria-label="Clear query"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </form>

          {/* Results Container */}
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
            {/* Search Results */}
            {query.trim().length >= 2 ? (
              activeResults.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium text-muted-foreground px-2">
                    <span>Products ({activeResults.length})</span>
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="text-brand hover:underline flex items-center gap-1"
                    >
                      View all results <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="divide-y divide-border/50">
                    {activeResults.map((product) => (
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
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                !isLoading && (
                  <div className="py-12 text-center text-muted-foreground">
                    <p className="text-sm">No products found for &ldquo;{query}&rdquo;</p>
                    <p className="text-xs mt-1">Try searching for &quot;Sofa&quot;, &quot;Table&quot;, or &quot;Lamp&quot;</p>
                  </div>
                )
              )
            ) : (
              /* Popular / Suggested Searches */
              <div className="space-y-4 py-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                  <Sparkles className="h-3.5 w-3.5 text-brand" />
                  <span>Popular Suggestions</span>
                </div>
                <div className="flex flex-wrap gap-2 px-2">
                  {["Lounge Sofa", "Dining Table", "Ceramic Lamp", "Armchair", "Linen Rug", "Vases"].map((item) => (
                    <button
                      key={item}
                      onClick={() => setQuery(item)}
                      className="px-3 py-1.5 rounded-full text-xs bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
