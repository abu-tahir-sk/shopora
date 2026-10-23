"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-background">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="h-14 w-14 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="h-7 w-7" />
        </div>

        <h1 className="text-3xl font-light tracking-tight text-foreground">
          Something went wrong
        </h1>

        <p className="text-sm text-muted-foreground font-light leading-relaxed">
          We experienced an unexpected glitch while loading this page. Our technical team has been notified.
        </p>

        {process.env.NODE_ENV === "development" && error?.message && (
          <div className="p-3 bg-secondary/80 rounded-xl text-xs font-mono text-left text-destructive overflow-x-auto max-h-32">
            {error.message}
          </div>
        )}

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() => reset()}
            size="lg"
            className="rounded-none tracking-widest uppercase text-xs h-12 px-6 w-full sm:w-auto"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Try Again
          </Button>

          <Button asChild variant="outline" size="lg" className="rounded-none tracking-widest uppercase text-xs h-12 px-6 w-full sm:w-auto">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
