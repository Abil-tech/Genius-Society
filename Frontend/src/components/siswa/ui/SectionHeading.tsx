import type { ReactNode } from 'react'

interface Props {
  id: string
  title: string
  aside?: ReactNode
}

export function SectionHeading({ id, title, aside }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
      <h2 id={id} className="flex min-w-0 items-center gap-2 text-lg font-semibold sm:text-xl">
        <span aria-hidden className="size-2.5 shrink-0 bg-brand" />
        <span className="min-w-0 [overflow-wrap:anywhere]">{title}</span>
      </h2>
      {aside ? <span className="font-mono text-xs text-ink-soft">{aside}</span> : null}
    </div>
  )
}
