import { getIcon } from './iconMapper'
import { formatTimeRelative } from './timeFormatter'
import type {
  StatCard,
  MiniStatCard,
  ActivityPoint,
  UserSummaryItem,
  SystemNotification,
  ActivityLogItem,
  StatusRow,
} from '../types/Dashboard'

// DTO types dari backend — mirror dari internal/dto/dashboard_dto.go
interface BackendStatCard {
  code: string
  label: string
  value: string
  trend?: string
  trendTone?: string
  badge?: string
  icon: string // String key, bukan component
  highlighted?: boolean
}

interface BackendMiniStatCard {
  label: string
  value: string
  badge?: string
  icon: string // String key
  highlighted?: boolean
}

interface BackendSystemNotification {
  title: string
  description: string
  createdAt: string // ISO timestamp
  tone: string
}

interface BackendActivityLogItem {
  actor: string
  action: string
  detail: string
  tag: string
  createdAt: string // ISO timestamp
  tone: string
}

// Transform main stats: convert icon strings → components, tetapkan
// trendTone (yang mungkin undefined) ke nilai valid 'neutral' sebagai
// fallback.
export function transformStatCard(dto: BackendStatCard): StatCard {
  return {
    code: dto.code,
    label: dto.label,
    value: dto.value,
    trend: dto.trend,
    trendTone: (dto.trendTone as 'positive' | 'neutral') || 'neutral',
    badge: dto.badge,
    icon: getIcon(dto.icon),
    highlighted: dto.highlighted,
  }
}

// Transform mini stats
export function transformMiniStatCard(dto: BackendMiniStatCard): MiniStatCard {
  return {
    label: dto.label,
    value: dto.value,
    badge: dto.badge || 'Info',
    icon: getIcon(dto.icon),
    highlighted: dto.highlighted,
  }
}

// Transform activity chart — tidak ada transformation kompleks, cukup
// cast tipe.
export function transformActivityPoint(dto: ActivityPoint): ActivityPoint {
  return dto
}

// Transform user summary — tone sudah match backend enum, cukup pass-through.
export function transformUserSummaryItem(
  dto: UserSummaryItem
): UserSummaryItem {
  return dto
}

// Transform system notifications: format createdAt dari timestamp →
// "X menit lalu" string.
export function transformSystemNotification(
  dto: BackendSystemNotification
): SystemNotification {
  return {
    title: dto.title,
    description: dto.description,
    time: formatTimeRelative(dto.createdAt),
    tone: (dto.tone as 'navy' | 'orange' | 'muted') || 'muted',
  }
}

// Transform activity log: format createdAt timestamp → "X menit lalu".
export function transformActivityLogItem(
  dto: BackendActivityLogItem
): ActivityLogItem {
  return {
    actor: dto.actor,
    action: dto.action,
    detail: dto.detail,
    tag: dto.tag,
    time: formatTimeRelative(dto.createdAt),
    tone: (dto.tone as 'orange' | 'navy' | 'success' | 'muted') || 'muted',
  }
}

// Transform status rows — tone enum sudah match, pass-through.
export function transformStatusRow(dto: StatusRow): StatusRow {
  return dto
}

// Batch transform untuk seluruh dashboard response
export interface BackendAdminDashboardResponse {
  mainStats: BackendStatCard[]
  miniStats: BackendMiniStatCard[]
  activityChart: ActivityPoint[]
  userSummary: UserSummaryItem[]
  systemNotifications: BackendSystemNotification[]
  activityLog: BackendActivityLogItem[]
  statusRows: StatusRow[]
}

export interface AdminDashboardPage {
  mainStats: StatCard[]
  miniStats: MiniStatCard[]
  activityChart: ActivityPoint[]
  userSummary: UserSummaryItem[]
  systemNotifications: SystemNotification[]
  activityLog: ActivityLogItem[]
  statusRows: StatusRow[]
}

export function transformAdminDashboard(
  dto: BackendAdminDashboardResponse
): AdminDashboardPage {
  return {
    mainStats: dto.mainStats.map(transformStatCard),
    miniStats: dto.miniStats.map(transformMiniStatCard),
    activityChart: dto.activityChart.map(transformActivityPoint),
    userSummary: dto.userSummary.map(transformUserSummaryItem),
    systemNotifications: dto.systemNotifications.map(
      transformSystemNotification
    ),
    activityLog: dto.activityLog.map(transformActivityLogItem),
    statusRows: dto.statusRows.map(transformStatusRow),
  }
}