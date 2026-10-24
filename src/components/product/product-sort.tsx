"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronDown, Check, ArrowDownUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Newest Arrivals", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Top Rated", value: "rating" },
];

interface ProductSortProps {
  currentSort?: string;
  category?: string;
}

export function ProductSort({ currentSort = "newest" }: ProductSortProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Determine active option
  const activeSort = sortOptions.find((opt) => opt.value === currentSort) || {
    label: "Sort By",
    value: currentSort,
  };

  const handleSelect = (sortValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sortValue === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", sortValue);
    }
    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  };

  return (
    <div className="relative shrink-0">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-3.5 gap-2 text-xs font-medium uppercase tracking-wider rounded-full border-border/80 bg-background hover:bg-secondary transition-all"
            >
              <ArrowDownUp className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground font-normal">Sort:</span>
              <span className="font-semibold text-foreground">{activeSort.label}</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform duration-200" />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-52 p-1.5 shadow-xl bg-card border-border">
          {sortOptions.map((option) => {
            const isSelected =
              option.value === currentSort ||
              (!currentSort && option.value === "newest");

            return (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`flex items-center justify-between px-3 py-2 text-xs rounded-md cursor-pointer transition-colors ${
                  isSelected
                    ? "font-semibold bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                }`}
              >
                <span>{option.label}</span>
                {isSelected && <Check className="h-3.5 w-3.5 text-brand" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
