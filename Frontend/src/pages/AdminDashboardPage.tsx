import { useEffect, useState } from 'react'
import { Loader2, AlertCircle } from 'lucide-react'
import AdminLayout from '../layouts/Adminlayout'
import StatCard from '../components/admin/StatCard'
import MiniStatCard from '../components/admin/MiniStatCard'
import ActivityChartCard from '../components/admin/ActivityChartCard'
import UserSummaryCard from '../components/admin/UserSummaryCard'
import QuickActionsPanel from '../components/admin/QuickActionsPanel'
import NotificationsPanel from '../components/admin/NotificationsPanel'
import ActivityLogCard from '../components/admin/ActivityLogCard'
import StatusTable from '../components/admin/StatusTable'
import AdminFooter from '../components/admin/AdminFooter'
import { getDashboard } from '../services/dashboardService'
import type { AdminDashboardPage as DashboardData } from '../utils/dashboardTransform'
import { mainStats as fallbackMainStats, miniStats as fallbackMiniStats } from '../utils/dashboardContent'

export default function AdminDashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const today = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  useEffect(() => {
    let isMounted = true

    async function loadDashboard() {
      setIsLoading(true)
      setErrorMessage(null)
      try {
        const data = await getDashboard()
        if (isMounted) setDashboardData(data)
      } catch (err) {
        if (isMounted) {
          setErrorMessage('Gagal memuat data dashboard API. Menampilkan data standar.')
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadDashboard()
    return () => {
      isMounted = false
    }
  }, [])

  const mainStats = dashboardData?.mainStats || fallbackMainStats
  const miniStats = dashboardData?.miniStats || fallbackMiniStats

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="text-xl font-extrabold text-brand-navy">
            Dashboard
          </h1>
          <p className="font-mono text-[11px] uppercase tracking-widest text-brand-muted">
            Status: Active
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-brand-orange">
            Tahun Ajaran 2026/2027
          </p>
          <p className="font-mono text-[10px] uppercase tracking-wide text-brand-muted">
            Logged In: Aktif // {today}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-brand-navy/5 bg-white p-6 text-sm text-brand-navy/60">
          <Loader2 size={18} className="animate-spin text-brand-orange" />
          Memuat data dashboard API...
        </div>
      ) : errorMessage ? (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
          <AlertCircle size={16} />
          {errorMessage}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {mainStats.map((stat) => (
          <StatCard key={stat.code} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {miniStats.map((stat) => (
          <MiniStatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ActivityChartCard data={dashboardData?.activityChart} />
        </div>
        <div className="space-y-5">
          <UserSummaryCard data={dashboardData?.userSummary} />
          <QuickActionsPanel />
          <NotificationsPanel data={dashboardData?.systemNotifications} />
        </div>
      </div>

      <ActivityLogCard data={dashboardData?.activityLog} />
      <StatusTable data={dashboardData?.statusRows} />
      <AdminFooter />
    </AdminLayout>
  )
}