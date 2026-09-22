import type { ReactNode } from 'react'

interface AdminPageHeaderProps {
  title: string
  moduleBadge: string
  actions?: ReactNode
}

export default function AdminPageHeader({
  title,
  moduleBadge,
  actions,
}: AdminPageHeaderProps) {
  const now = new Date().toLocaleTimeString('id-ID', { hour12: false })

  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-extrabold text-brand-navy">{title}</h1>
          <span className="rounded-full bg-brand-orange-light px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-brand-orange">
            {moduleBadge}
          </span>
        </div>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-brand-muted">
          Logged_In: {now} // Status: Active
        </p>
      </div>

      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}