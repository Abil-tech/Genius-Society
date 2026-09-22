import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  pageSize: number
  totalItems: number
  rangeStart: number
  rangeEnd: number
  onPageChange: (page: number) => void
}

export default function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  rangeStart,
  rangeEnd,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const visiblePages =
    totalPages <= 5
      ? pages
      : [1, 2, 3, '...', totalPages].filter(
          (p, i, arr) => arr.indexOf(p) === i,
        )

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-brand-navy/5 pt-4 text-xs text-brand-muted">
      <p>
        Menampilkan {rangeStart}-{rangeEnd} dari {totalItems} data
      </p>

      <div className="flex items-center gap-3">
        <select
          defaultValue={pageSize}
          className="rounded-lg border border-brand-navy/10 bg-white px-2 py-1.5 text-xs text-brand-navy outline-none focus:border-brand-orange"
        >
          <option value={pageSize}>{pageSize} / halaman</option>
        </select>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-brand-navy/10 text-brand-navy disabled:opacity-30"
          >
            <ChevronLeft size={14} />
          </button>

          {visiblePages.map((page, idx) =>
            page === '...' ? (
              <span key={`ellipsis-${idx}`} className="px-1">
                …
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page as number)}
                className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-semibold ${
                  currentPage === page
                    ? 'bg-brand-orange text-white'
                    : 'border border-brand-navy/10 text-brand-navy hover:bg-brand-bg'
                }`}
              >
                {page}
              </button>
            ),
          )}

          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-brand-navy/10 text-brand-navy disabled:opacity-30"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}