import { useEffect } from 'react'
import { CheckCircle2, X } from 'lucide-react'

interface ToastProps {
  message: string
  onClose: () => void
  duration?: number
}

export default function Toast({ message, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex items-center gap-2.5 rounded-xl bg-brand-navy px-4 py-3 text-sm text-white shadow-xl">
      <CheckCircle2 size={17} strokeWidth={2} className="text-status-success" />
      {message}
      <button onClick={onClose} className="text-white/60 hover:text-white">
        <X size={15} strokeWidth={2} />
      </button>
    </div>
  )
}