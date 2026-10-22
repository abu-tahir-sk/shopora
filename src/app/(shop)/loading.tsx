export default function ShopLoading() {
  return (
    <div className="container mx-auto px-4 md:px-8 max-w-7xl py-12 animate-pulse space-y-8">
      {/* Banner Skeleton */}
      <div className="h-40 bg-secondary/50 rounded-2xl w-full" />

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="aspect-[4/5] bg-secondary/60 rounded-xl w-full" />
            <div className="h-4 bg-secondary/80 rounded w-3/4" />
            <div className="h-3 bg-secondary/60 rounded w-1/2" />
            <div className="h-4 bg-secondary/80 rounded w-1/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
