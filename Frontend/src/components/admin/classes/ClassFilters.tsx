import { Search } from 'lucide-react'

export interface ClassFilterValues {
  search: string
  grade: string
  major: string
  academicYear: string
  status: string
}

interface ClassFiltersProps {
  values: ClassFilterValues
  majorOptions: string[]
  academicYearOptions: string[]
  onChange: (values: ClassFilterValues) => void
}

export default function ClassFilters({
  values,
  majorOptions,
  academicYearOptions,
  onChange,
}: ClassFiltersProps) {
  function update<K extends keyof ClassFilterValues>(
    key: K,
    value: ClassFilterValues[K],
  ) {
    onChange({ ...values, [key]: value })
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative min-w-[200px] flex-1">
        <Search
          size={15}
          strokeWidth={2}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted"
        />
        <input
          type="text"
          value={values.search}
          onChange={(e) => update('search', e.target.value)}
          placeholder="Cari nama kelas..."
          className="w-full rounded-lg border border-brand-navy/10 bg-white py-2 pl-9 pr-3 text-sm text-brand-navy placeholder:text-brand-muted outline-none focus:border-brand-orange"
        />
      </div>

      <select
        value={values.grade}
        onChange={(e) => update('grade', e.target.value)}
        className="rounded-lg border border-brand-navy/10 bg-white px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-orange"
      >
        <option value="semua">Semua Tingkat</option>
        <option value="10">Tingkat 10</option>
        <option value="11">Tingkat 11</option>
        <option value="12">Tingkat 12</option>
      </select>

      <select
        value={values.major}
        onChange={(e) => update('major', e.target.value)}
        className="rounded-lg border border-brand-navy/10 bg-white px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-orange"
      >
        <option value="semua">Semua Jurusan</option>
        {majorOptions.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
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
        value={values.status}
        onChange={(e) => update('status', e.target.value)}
        className="rounded-lg border border-brand-navy/10 bg-white px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-orange"
      >
        <option value="semua">Semua Status</option>
        <option value="aktif">Aktif</option>
        <option value="nonaktif">Nonaktif</option>
      </select>

      <button
        onClick={() =>
          onChange({
            search: '',
            grade: 'semua',
            major: 'semua',
            academicYear: 'semua',
            status: 'semua',
          })
        }
        className="text-xs font-semibold text-brand-orange hover:underline"
      >
        Reset Filter
      </button>
    </div>
  )
}