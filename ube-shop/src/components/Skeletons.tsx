export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-tile border border-line bg-panel">
      <div className="aspect-[5/4] w-full animate-pulse bg-ube-tint" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-2/5 animate-pulse rounded-full bg-ube-tint" />
        <div className="h-3.5 w-4/5 animate-pulse rounded-full bg-line-soft" />
        <div className="h-3.5 w-1/3 animate-pulse rounded-full bg-line-soft" />
      </div>
    </div>
  );
}

/** Szkieletem w kształcie wyniku, nie kołowrotkiem. */
export function PageSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8" aria-busy="true">
      <div className="h-10 w-40 animate-pulse rounded-full bg-ube-tint" />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: rows * 3 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
