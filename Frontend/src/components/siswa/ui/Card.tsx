import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`min-w-0 rounded-lg border border-line bg-white ${className}`}>{children}</div>
  )
}
