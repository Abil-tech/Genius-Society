import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
}

export default function ErrorState({
  title = 'Gagal memuat data',
  description = 'Terjadi kesalahan saat mengambil data dari server. Coba lagi.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-status-danger-bg text-status-danger">
        <AlertTriangle size={22} strokeWidth={1.5} />
      </span>
      <p className="text-sm font-semibold text-brand-navy">{title}</p>
      <p className="max-w-xs text-xs text-brand-muted">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 flex items-center gap-1.5 rounded-lg bg-brand-orange px-3.5 py-2 text-xs font-semibold text-white hover:bg-brand-orange-dark"
        >
          <RefreshCw size={13} strokeWidth={2} />
          Coba Lagi
        </button>
      )}
    </div>
  )
}