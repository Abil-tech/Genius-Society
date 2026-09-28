import { useEffect, useState } from 'react'
import GuruLayout from '../../layouts/GuruLayout'
import ErrorState from '../../components/admin/ErrorState'
import { useAuth } from '../../hooks/useAuth'
import GuruSummaryCards from '../../components/Guru/GuruSummaryCard'
import TodayScheduleSection from '../../components/Guru/TodayScheduleSection'
import ActiveTasksSection from '../../components/Guru/ActiveTaskSection'
import PendingGradingSection from '../../components/Guru/PendingGrading'
import ActiveAssessmentsSection from '../../components/Guru/ActiveAssesmentSection'
import StudentActivitySection from '../../components/Guru/StudentActivitySection'
import AnnouncementsSection from '../../components/Guru/AnnouncementsSection'
import QuickActionsSection from '../../components/Guru/QuickActionSection'
import WalasWidget from '../../components/Guru/WalasWidget'
import { getGuruDashboard } from '../../services/guruService'
import type { GuruDashboardResponse } from '../../types/Guru/guruDashboardResponse'

export default function GuruDashboardPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [dashboardData, setDashboardData] = useState<GuruDashboardResponse | null>(null)

  async function loadData() {
    setIsLoading(true)
    setIsError(false)
    try {
      const data = await getGuruDashboard()
      setDashboardData(data)
    } catch {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const firstName = user?.name?.split(' ')[0] ?? 'Guru'

  return (
    <GuruLayout>
      <div>
        <h1 className="text-xl font-extrabold text-brand-navy">
          Dashboard Guru
        </h1>
        <p className="text-sm text-brand-navy/70">
          Selamat datang kembali, {firstName}
        </p>
        <p className="mt-1 text-sm text-brand-muted">
          Pantau kegiatan pembelajaran, tugas, dan perkembangan siswa Anda.
        </p>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-brand-orange">
          Tahun Ajaran 2026/2027
        </p>
      </div>

      {isError ? (
        <div className="rounded-2xl border border-brand-navy/5 bg-white p-5">
          <ErrorState
            title="Gagal memuat data dashboard."
            description="Terjadi masalah saat mengambil data dashboard. Silakan coba lagi."
            onRetry={loadData}
          />
        </div>
      ) : isLoading || !dashboardData ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl border border-brand-navy/5 bg-brand-bg"
            />
          ))}
        </div>
      ) : (
        <>
          <GuruSummaryCards summary={dashboardData.summary} />

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <div className="space-y-5 xl:col-span-2">
              <TodayScheduleSection schedules={dashboardData.todaySchedules} />
              <ActiveTasksSection tasks={dashboardData.activeTasks} />
              <ActiveAssessmentsSection assessments={dashboardData.activeAssessments} />
              <StudentActivitySection activities={dashboardData.studentActivities} />
            </div>

            <div className="space-y-5">
              {dashboardData.homeroomClass && (
                <WalasWidget homeroom={dashboardData.homeroomClass} />
              )}
              <QuickActionsSection />
              <PendingGradingSection submissions={dashboardData.pendingSubmissions} />
              <AnnouncementsSection announcements={dashboardData.announcements} />
            </div>
          </div>
        </>
      )}
    </GuruLayout>
  )
}