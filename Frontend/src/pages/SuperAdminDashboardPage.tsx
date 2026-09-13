import AdminSidebar from '../components/admin/AdminSidebar'
import AdminTopbar from '../components/admin/AdminTopbar'
import StatCard from '../components/admin/StatCard'
import MiniStatCard from '../components/admin/MiniStatCard'
import ActivityChartCard from '../components/admin/ActivityStatCard'
import UserSummaryCard from '../components/admin/UserSummaryCard'
import QuickActionsPanel from '../components/admin/QuickActionPanel'
import NotificationsPanel from '../components/admin/NotificationPanel'
import ActivityLogCard from '../components/admin/ActivityLogCard'
import StatusTable from '../components/admin/StatusTable'
import AdminFooter from '../components/admin/AdminFooter'
import { mainStats, miniStats } from '../utils/dashboardContent'

export default function SuperAdminDashboardPage() {
  const today = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="flex min-h-screen bg-brand-bg">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar />

        <main className="flex-1 space-y-5 px-6 py-6">
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
              <ActivityChartCard />
            </div>
            <div className="space-y-5">
              <UserSummaryCard />
              <QuickActionsPanel />
              <NotificationsPanel />
            </div>
          </div>

          <ActivityLogCard />
          <StatusTable />
          <AdminFooter />
        </main>
      </div>
    </div>
  )
}