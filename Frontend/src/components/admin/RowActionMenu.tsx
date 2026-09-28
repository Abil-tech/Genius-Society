import { useEffect, useRef, useState } from 'react'
import { MoreVertical } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface RowAction {
  label: string
  icon: LucideIcon
  onClick: () => void
  tone?: 'default' | 'danger'
}

interface RowActionMenuProps {
  actions: RowAction[]
}

export default function RowActionMenu({ actions }: RowActionMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg p-1.5 text-brand-muted hover:bg-brand-bg hover:text-brand-navy"
      >
        <MoreVertical size={16} strokeWidth={2} />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-1 w-48 rounded-xl border border-brand-navy/10 bg-white py-1.5 shadow-lg">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={() => {
                setOpen(false)
                action.onClick()
              }}
              className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm hover:bg-brand-bg ${
                action.tone === 'danger' ? 'text-status-danger' : 'text-brand-navy'
              }`}
            >
              <action.icon size={15} strokeWidth={2} />
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}