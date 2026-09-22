import { AlertTriangle } from 'lucide-react'

interface ConfirmDeleteModalProps {
  title: string
  description: string
  onCancel: () => void
  onConfirm: () => void
  isDeleting?: boolean
}

export default function ConfirmDeleteModal({
  title,
  description,
  onCancel,
  onConfirm,
  isDeleting = false,
}: ConfirmDeleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/40 px-4 backdrop-blur-[2px]">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-status-danger-bg text-status-danger">
          <AlertTriangle size={22} strokeWidth={1.5} />
        </span>
        <h2 className="mt-3 text-sm font-bold text-brand-navy">{title}</h2>
        <p className="mt-1.5 text-xs leading-relaxed text-brand-muted">
          {description}
        </p>

        <div className="mt-5 flex items-center justify-center gap-2">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-brand-navy/10 px-4 py-2 text-xs font-semibold text-brand-navy hover:bg-brand-bg"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 rounded-lg bg-status-danger px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {isDeleting ? 'Menghapus...' : 'Hapus'}
          </button>
        </div>
      </div>
    </div>
  )
}