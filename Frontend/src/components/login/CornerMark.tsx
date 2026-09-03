interface CornerMarkProps {
  label: string
  className?: string
}

export default function CornerMark({ label, className = '' }: CornerMarkProps) {
  return (
    <span
      className={`hidden select-none font-mono text-[10px] tracking-widest text-brand-navy/25 sm:block ${className}`}
    >
      {label}
    </span>
  )
}