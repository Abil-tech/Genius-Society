import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const sizeClass: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

export default function Modal({
  title,
  onClose,
  children,
  footer,
  size = 'md',
}: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/40 px-4 backdrop-blur-[2px]">
      <div
        className={`flex max-h-[85vh] w-full flex-col rounded-2xl bg-white shadow-xl ${sizeClass[size]}`}
      >
        <div className="flex items-center justify-between border-b border-brand-navy/5 px-5 py-4">
          <h2 className="text-sm font-bold text-brand-navy">{title}</h2>
          <button
            onClick={onClose}
            className="text-brand-muted hover:text-brand-navy"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-brand-navy/5 px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}