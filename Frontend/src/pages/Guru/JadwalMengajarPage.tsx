import GuruLayout from '../../layouts/GuruLayout'
import WeekSummaryPanel from '../../components/Guru/jadwal/WeekSummaryPanel'
import DayScheduleGroup from '../../components/Guru/jadwal/DaysScheduleGroup'
import EmptyState from '../../components/admin/EmptyState'
import { weekSummary, weeklySchedule } from '../../utils/Guru/teachingScheduleContent'

export default function JadwalMengajarPage() {
  return (
    <GuruLayout>
      <div>
        <h1 className="text-xl font-extrabold text-brand-navy">
          Jadwal Mengajar Mingguan
        </h1>
        <p className="mt-1 flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-brand-orange">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
          Semester Genap 2026/2027
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <WeekSummaryPanel summary={weekSummary} />
        </div>

        <div className="space-y-6 lg:col-span-2">
          {weeklySchedule.length === 0 ? (
            <div className="rounded-2xl border border-brand-navy/5 bg-white p-5">
              <EmptyState
                title="Belum ada jadwal mengajar"
                description="Jadwal mengajar minggu ini belum tersedia."
              />
            </div>
          ) : (
            weeklySchedule.map((day) => (
              <DayScheduleGroup key={day.day} day={day} />
            ))
          )}
        </div>
      </div>
    </GuruLayout>
  )
}