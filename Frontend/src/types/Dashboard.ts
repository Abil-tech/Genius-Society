import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  icon: LucideIcon
  label: string
  href: string
}

export interface StatCard {
  code: string
  label: string
  value: string
  trend?: string
  trendTone?: 'positive' | 'neutral'
  badge?: string
  icon: LucideIcon
  highlighted?: boolean
}

export interface MiniStatCard {
  label: string
  value: string
  badge: string
  icon: LucideIcon
  highlighted?: boolean
}

export interface ActivityPoint {
  day: string
  value: number
}

export interface UserSummaryItem {
  label: string
  value: number
  percentage: number
  tone: 'orange' | 'navy' | 'muted'
}

export interface QuickAction {
  icon: LucideIcon
  label: string
}

export interface SystemNotification {
  title: string
  description: string
  time: string
  tone: 'navy' | 'orange' | 'muted'
}

export interface ActivityLogItem {
  actor: string
  action: string
  detail: string
  tag: string
  time: string
  tone: 'orange' | 'navy' | 'success' | 'muted'
}

export interface StatusRow {
  category: string
  count: number
  percentage: number
  label: string
  tone: 'success' | 'warning' | 'danger'
  action: string
}