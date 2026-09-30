import { RefreshCw } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import { ActivitySection } from '../../components/siswa/dashboard/ActivitySection'
import { DashboardSkeleton } from '../../components/siswa/dashboard/DashboardSkeleton'
import { SubjectsSection } from '../../components/siswa/dashboard/SubjectsSection'
import { SummaryCards } from '../../components/siswa/dashboard/SummaryCards'
import { TasksSection } from '../../components/siswa/dashboard/TasksSection'
import { Card } from '../../components/siswa/ui/Card'
import { StateMessage } from '../../components/siswa/ui/StateMessage'
import { useStudentDashboard } from '../../hooks/siswa/useStudentDashboard'
import type { StudentOutletContext } from '../../layouts/StudentLayout'

export default function DashboardPage() {
  const { student } = useOutletContext<StudentOutletContext>()
  const { status, data, error, reload } = useStudentDashboard()
  const firstName = student?.name.split(' ')[0]

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <header className="flex flex-col gap-2 border-b border-line pb-5">
        {data ? (
          <p className="font-mono text-xs text-ink-soft">
            TA {data.academicYear.label} · Semester {data.academicYear.semester}
          </p>
        ) : null}
        <h1 className="text-[clamp(1.75rem,1.2rem+2.4vw,2.75rem)] font-bold leading-tight">
          Dashboard
        </h1>
        <p className="text-ink-soft">
          {firstName ? `Halo, ${firstName}. ` : ''}Pantau kegiatan belajarmu hari ini.
        </p>
      </header>

      {status === 'loading' && <DashboardSkeleton />}

      {status === 'error' && (
        <Card>
          <StateMessage
            variant="error"
            title="Dashboard gagal dimuat"
            description={`${error} Periksa koneksi internetmu, lalu coba lagi.`}
            action={
              <button
                type="button"
                onClick={reload}
                className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-lg border border-line bg-white px-4 text-sm font-semibold hover:bg-cream-100"
              >
                <RefreshCw aria-hidden className="size-4" />
                Coba lagi
              </button>
            }
          />
        </Card>
      )}

      {status === 'success' && (
        // Urutan DOM = urutan mobile (Ringkasan, Tugas, Mapel, Aktivitas).
        // Dari md ke atas, `order` menyusun ulang secara visual mengikuti desain.
        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
          <div className="min-w-0 md:order-1 lg:col-span-3">
            <SummaryCards summary={data.summary} />
          </div>
          <TasksSection tasks={data.tasks} className="md:order-3 lg:col-span-2" />
          <SubjectsSection
            subjects={data.subjects}
            termLabel={`${data.academicYear.label} · ${data.academicYear.semester}`}
            className="md:order-2 lg:col-span-3"
          />
          <ActivitySection activities={data.activities} className="md:order-4 lg:col-span-1" />
        </div>
      )}
    </div>
  )
}
