import type { LucideIcon } from 'lucide-react'
import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
}

export default function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-bg text-brand-muted">
        <Icon size={22} strokeWidth={1.5} />
      </span>
      <p className="text-sm font-semibold text-brand-navy">{title}</p>
      {description && (
        <p className="max-w-xs text-xs text-brand-muted">{description}</p>
      )}
    </div>
  )
}