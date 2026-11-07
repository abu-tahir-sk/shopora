"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Helper to generate page numbers with ellipsis
function generatePaginationRange(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Always show first, last, and window around current
  const delta = 1;
  const range: (number | "ellipsis")[] = [];
  const rangeWithDots: (number | "ellipsis")[] = [];

  for (
    let i = Math.max(2, currentPage - delta);
    i <= Math.min(totalPages - 1, currentPage + delta);
    i++
  ) {
    range.push(i);
  }

  if (currentPage - delta > 2) {
    rangeWithDots.push(1, "ellipsis");
  } else {
    rangeWithDots.push(1);
  }

  rangeWithDots.push(...range);

  if (currentPage + delta < totalPages - 1) {
    rangeWithDots.push("ellipsis", totalPages);
  } else if (totalPages > 1) {
    rangeWithDots.push(totalPages);
  }

  return rangeWithDots;
}

// -------------------------------------------------------------
// 1. Server-Driven URL Pagination Component (for Server Components)
// -------------------------------------------------------------
interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  className?: string;
}

export function AdminPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  className,
}: AdminPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1 && totalItems <= pageSize) {
    return null;
  }

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  const pages = generatePaginationRange(currentPage, totalPages);

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 text-sm",
        className
      )}
    >
      {/* Information Counter */}
      <div className="text-xs text-muted-foreground order-2 sm:order-1">
        Showing <span className="font-semibold text-foreground">{startItem}</span> to{" "}
        <span className="font-semibold text-foreground">{endItem}</span> of{" "}
        <span className="font-semibold text-foreground">{totalItems}</span> results
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5 order-1 sm:order-2">
        {/* Previous Button */}
        {currentPage > 1 ? (
          <Button
            variant="outline"
            size="sm"
            asChild
            className="h-8 px-2.5 rounded-lg border-border hover:bg-secondary text-foreground text-xs font-medium"
          >
            <Link href={createPageUrl(currentPage - 1)}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              <span>Prev</span>
            </Link>
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            disabled
            className="h-8 px-2.5 rounded-lg border-border/50 text-muted-foreground/50 text-xs font-medium cursor-not-allowed opacity-50"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span>Prev</span>
          </Button>
        )}

        {/* Page Number Buttons */}
        <div className="hidden sm:flex items-center gap-1">
          {pages.map((p, idx) => {
            if (p === "ellipsis") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-8 h-8 flex items-center justify-center text-muted-foreground"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              );
            }

            const isCurrent = p === currentPage;
            return (
              <Button
                key={p}
                variant={isCurrent ? "default" : "outline"}
                size="sm"
                asChild={!isCurrent}
                className={cn(
                  "w-8 h-8 p-0 rounded-lg text-xs font-medium transition-all",
                  isCurrent
                    ? "bg-brand text-brand-foreground hover:bg-brand font-bold shadow-2xs cursor-default"
                    : "border-border hover:bg-secondary text-foreground"
                )}
              >
                {isCurrent ? (
                  <span>{p}</span>
                ) : (
                  <Link href={createPageUrl(p)}>{p}</Link>
                )}
              </Button>
            );
          })}
        </div>

        {/* Mobile Page Indicator */}
        <span className="sm:hidden text-xs font-medium px-2 text-foreground">
          {currentPage} / {totalPages}
        </span>

        {/* Next Button */}
        {currentPage < totalPages ? (
          <Button
            variant="outline"
            size="sm"
            asChild
            className="h-8 px-2.5 rounded-lg border-border hover:bg-secondary text-foreground text-xs font-medium"
          >
            <Link href={createPageUrl(currentPage + 1)}>
              <span>Next</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            disabled
            className="h-8 px-2.5 rounded-lg border-border/50 text-muted-foreground/50 text-xs font-medium cursor-not-allowed opacity-50"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 2. Client-Driven Pagination Component (for State-based Client Tables)
// -------------------------------------------------------------
interface ClientPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function ClientPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  className,
}: ClientPaginationProps) {
  if (totalPages <= 1 && totalItems <= pageSize) {
    return null;
  }

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  const pages = generatePaginationRange(currentPage, totalPages);

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 text-sm",
        className
      )}
    >
      {/* Information Counter */}
      <div className="text-xs text-muted-foreground order-2 sm:order-1">
        Showing <span className="font-semibold text-foreground">{startItem}</span> to{" "}
        <span className="font-semibold text-foreground">{endItem}</span> of{" "}
        <span className="font-semibold text-foreground">{totalItems}</span> results
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5 order-1 sm:order-2">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="h-8 px-2.5 rounded-lg border-border hover:bg-secondary text-foreground text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span>Prev</span>
        </Button>

        {/* Page Number Buttons */}
        <div className="hidden sm:flex items-center gap-1">
          {pages.map((p, idx) => {
            if (p === "ellipsis") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-8 h-8 flex items-center justify-center text-muted-foreground"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              );
            }

            const isCurrent = p === currentPage;
            return (
              <Button
                key={p}
                variant={isCurrent ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(p)}
                className={cn(
                  "w-8 h-8 p-0 rounded-lg text-xs font-medium transition-all",
                  isCurrent
                    ? "bg-brand text-brand-foreground hover:bg-brand font-bold shadow-2xs"
                    : "border-border hover:bg-secondary text-foreground"
                )}
              >
                {p}
              </Button>
            );
          })}
        </div>

        {/* Mobile Page Indicator */}
        <span className="sm:hidden text-xs font-medium px-2 text-foreground">
          {currentPage} / {totalPages}
        </span>

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="h-8 px-2.5 rounded-lg border-border hover:bg-secondary text-foreground text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

