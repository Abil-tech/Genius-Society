import type { LucideIcon } from 'lucide-react'

export interface FeatureItem {
  icon: LucideIcon
  iconBg: string
  iconColor: string
  title: string
  description: string
}

export interface StatItem {
  icon: LucideIcon
  value: string
  label: string
}