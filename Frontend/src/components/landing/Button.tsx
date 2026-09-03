import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'outline'
  size?: 'md' | 'sm'
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...rest
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-full font-semibold transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange'

  const sizes = {
    md: 'px-7 py-3 text-sm',
    sm: 'px-5 py-2.5 text-sm',
  }

  const variants = {
    primary: 'bg-brand-orange text-white hover:bg-brand-orange-dark',
    outline:
      'border border-white/40 text-white hover:bg-white/10',
  }

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}