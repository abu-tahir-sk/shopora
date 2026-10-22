import Link from "next/link";
import { ArrowLeft, Compass, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-background">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-xs uppercase tracking-widest text-muted-foreground">
          <Compass className="h-3.5 w-3.5 text-brand" />
          <span>Error 404</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-light tracking-tight text-foreground">
          Page Not Found
        </h1>

        <p className="text-sm text-muted-foreground font-light leading-relaxed">
          The space or piece you are searching for might have been retired, renamed, or is temporarily out of reach.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild size="lg" className="rounded-none tracking-widest uppercase text-xs h-12 px-6 w-full sm:w-auto">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return Home
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="rounded-none tracking-widest uppercase text-xs h-12 px-6 w-full sm:w-auto">
            <Link href="/products">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Explore Shop
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
