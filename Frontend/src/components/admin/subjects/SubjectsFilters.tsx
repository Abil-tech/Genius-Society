import { Search } from 'lucide-react'

export interface SubjectFilterValues {
  search: string
  group: string
  grade: string
  status: string
}

interface SubjectFiltersProps {
  values: SubjectFilterValues
  onChange: (values: SubjectFilterValues) => void
}

export default function SubjectFilters({ values, onChange }: SubjectFiltersProps) {
  function update<K extends keyof SubjectFilterValues>(
    key: K,
    value: SubjectFilterValues[K],
  ) {
    onChange({ ...values, [key]: value })
  }

  return (
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
          placeholder="Cari kode atau nama mata pelajaran..."
          className="w-full rounded-lg border border-brand-navy/10 bg-white py-2 pl-9 pr-3 text-sm text-brand-navy placeholder:text-brand-muted outline-none focus:border-brand-orange"
        />
      </div>

      <select
        value={values.group}
        onChange={(e) => update('group', e.target.value)}
        className="rounded-lg border border-brand-navy/10 bg-white px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-orange"
      >
        <option value="semua">Semua Kelompok</option>
        <option value="umum">Umum</option>
        <option value="kejuruan">Kejuruan</option>
        <option value="muatan_lokal">Muatan Lokal</option>
      </select>

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
          onChange({ search: '', group: 'semua', grade: 'semua', status: 'semua' })
        }
        className="text-xs font-semibold text-brand-orange hover:underline"
      >
        Reset Filter
      </button>
    </div>
  )
}