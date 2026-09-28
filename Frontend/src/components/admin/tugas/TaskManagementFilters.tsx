import { Search } from 'lucide-react'
import {
  emptyTaskManagementFilters,
  type TaskManagementFilterValues,
} from '../../../types/taskManagementFilters'

interface TaskManagementFiltersProps {
  values: TaskManagementFilterValues
  teacherOptions: string[]
  subjectOptions: string[]
  classOptions: string[]
  academicYearOptions: string[]
  onChange: (values: TaskManagementFilterValues) => void
}

export default function TaskManagementFilters({
  values,
  teacherOptions,
  subjectOptions,
  classOptions,
  academicYearOptions,
  onChange,
}: TaskManagementFiltersProps) {
  function update<K extends keyof TaskManagementFilterValues>(
    key: K,
    value: TaskManagementFilterValues[K],
  ) {
    onChange({ ...values, [key]: value })
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search
            size={15}
            strokeWidth={2}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted"
          />
          <input
            type="text"
            value={values.search}
            onChange={(e) => update('search', e.target.value)}
            placeholder="Cari judul tugas, guru, atau mata pelajaran..."
            className="w-full rounded-lg border border-brand-navy/10 bg-white py-2 pl-9 pr-3 text-sm text-brand-navy placeholder:text-brand-muted outline-none focus:border-brand-orange"
          />
        </div>

        <select
          value={values.teacher}
          onChange={(e) => update('teacher', e.target.value)}
          className="rounded-lg border border-brand-navy/10 bg-white px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-orange"
        >
          <option value="semua">Semua Guru</option>
          {teacherOptions.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          value={values.subject}
          onChange={(e) => update('subject', e.target.value)}
          className="rounded-lg border border-brand-navy/10 bg-white px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-orange"
        >
          <option value="semua">Semua Mata Pelajaran</option>
          {subjectOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={values.className}
          onChange={(e) => update('className', e.target.value)}
          className="rounded-lg border border-brand-navy/10 bg-white px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-orange"
        >
          <option value="semua">Semua Kelas</option>
          {classOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={values.status}
          onChange={(e) => update('status', e.target.value)}
          className="rounded-lg border border-brand-navy/10 bg-white px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-orange"
        >
          <option value="semua">Semua Status</option>
          <option value="draft">Draft</option>
          <option value="aktif">Aktif</option>
          <option value="selesai">Selesai</option>
          <option value="terlambat">Terlambat</option>
          <option value="diarsipkan">Diarsipkan</option>
        </select>

        <select
          value={values.academicYear}
          onChange={(e) => update('academicYear', e.target.value)}
          className="rounded-lg border border-brand-navy/10 bg-white px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-orange"
        >
          <option value="semua">Semua Tahun Ajaran</option>
          {academicYearOptions.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <select
          value={values.dateRange}
          onChange={(e) =>
            update('dateRange', e.target.value as TaskManagementFilterValues['dateRange'])
          }
          className="rounded-lg border border-brand-navy/10 bg-white px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-orange"
        >
          <option value="semua">Semua Tanggal</option>
          <option value="hari_ini">Hari Ini</option>
          <option value="7_hari">7 Hari Terakhir</option>
          <option value="30_hari">30 Hari Terakhir</option>
          <option value="custom">Custom Range</option>
        </select>

        <button
          onClick={() => onChange(emptyTaskManagementFilters)}
          className="text-xs font-semibold text-brand-orange hover:underline"
        >
          Reset Filter
        </button>
      </div>

      {values.dateRange === 'custom' && (
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs text-brand-muted">
            Dari
            <input
              type="date"
              value={values.customFrom}
              onChange={(e) => update('customFrom', e.target.value)}
              className="ml-2 rounded-lg border border-brand-navy/10 px-2.5 py-1.5 text-sm text-brand-navy outline-none focus:border-brand-orange"
            />
          </label>
          <label className="text-xs text-brand-muted">
            Sampai
            <input
              type="date"
              value={values.customTo}
              onChange={(e) => update('customTo', e.target.value)}
              className="ml-2 rounded-lg border border-brand-navy/10 px-2.5 py-1.5 text-sm text-brand-navy outline-none focus:border-brand-orange"
            />
          </label>
        </div>
      )}
    </div>
  )
}