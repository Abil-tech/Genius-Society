import { initials } from '../../utils/format'

interface Props {
  name: string
  className?: string
}

export function Avatar({ name, className = 'size-10' }: Props) {
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-ink font-mono text-sm font-bold text-cream-50 ${className}`}
    >
      {initials(name)}
    </span>
  )
}
