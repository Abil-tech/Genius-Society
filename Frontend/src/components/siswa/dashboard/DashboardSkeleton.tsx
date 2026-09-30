const block = 'animate-pulse rounded-lg bg-cream-100'

export function DashboardSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite" className="grid grid-cols-1 gap-6">
      <span className="sr-only">Memuat dashboard…</span>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className={`${block} h-36`} />
        ))}
      </div>
      <div className={`${block} h-72`} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className={`${block} h-40`} />
        ))}
      </div>
    </div>
  )
}
