import type { InputHTMLAttributes } from 'react'
import type { LucideIcon } from 'lucide-react'

interface LoginInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon: LucideIcon
}

export default function LoginInput({
  label,
  icon: Icon,
  id,
  ...rest
}: LoginInputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block font-mono text-[11px] font-semibold uppercase tracking-widest text-brand-muted"
      >
        {label}
      </label>
      <div className="relative mt-2">
        <Icon
          size={16}
          strokeWidth={2}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-orange"
        />
        <input
          id={id}
          className="w-full rounded-xl border border-brand-orange/20 bg-brand-orange-light/60 py-3 pl-11 pr-4 font-mono text-sm text-brand-navy placeholder:text-brand-navy/30 outline-none transition-colors focus:border-brand-orange focus:bg-brand-orange-light"
          {...rest}
        />
      </div>
    </div>
  )
}