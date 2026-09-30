import type { ReactNode } from 'react'
import { AlertTriangle, Inbox } from 'lucide-react'

interface Props {
  variant: 'empty' | 'error'
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function StateMessage({ variant, title, description, action, className = '' }: Props) {
  const Icon = variant === 'error' ? AlertTriangle : Inbox
  return (
    <div
      role={variant === 'error' ? 'alert' : undefined}
      className={`flex flex-col items-center gap-2 px-4 py-8 text-center ${className}`}
    >
      <Icon aria-hidden className="size-6 text-ink-soft" />
      <p className="font-semibold">{title}</p>
      {description ? <p className="max-w-prose text-sm text-ink-soft">{description}</p> : null}
      {action}
    </div>
  )
}
