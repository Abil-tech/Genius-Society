import { Search } from 'lucide-react'

export interface StudentFilterValues {
  search: string
  className: string
  grade: string
  major: string
  academicYear: string
  status: string
  gender: string
}

interface StudentFiltersProps {
  values: StudentFilterValues
  classOptions: string[]
  majorOptions: string[]
  academicYearOptions: string[]
  onChange: (values: StudentFilterValues) => void
}

export default function StudentFilters({
  values,
  classOptions,
  majorOptions,
  academicYearOptions,
  onChange,
}: StudentFiltersProps) {
  function update<K extends keyof StudentFilterValues>(
    key: K,
    value: StudentFilterValues[K],
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
          placeholder="Cari nama, NIS, atau NISN..."
          className="w-full rounded-lg border border-brand-navy/10 bg-white py-2 pl-9 pr-3 text-sm text-brand-navy placeholder:text-brand-muted outline-none focus:border-brand-orange"
        />
      </div>

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
        value={values.grade}
        onChange={(e) => update('grade', e.target.value)}
        className="rounded-lg border border-brand-navy/10 bg-white px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-orange"
      >
        <option value="semua">Semua Tingkat</option>
        <option value="10">10</option>
        <option value="11">11</option>
        <option value="12">12</option>
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

      <select
        value={values.gender}
        onChange={(e) => update('gender', e.target.value)}
        className="rounded-lg border border-brand-navy/10 bg-white px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-orange"
      >
        <option value="semua">Semua Jenis Kelamin</option>
        <option value="L">Laki-laki</option>
        <option value="P">Perempuan</option>
      </select>

      <button
        onClick={() =>
          onChange({
            search: '',
            className: 'semua',
            grade: 'semua',
            major: 'semua',
            academicYear: 'semua',
            status: 'semua',
            gender: 'semua',
          })
        }
        className="text-xs font-semibold text-brand-orange hover:underline"
      >
        Reset Filter
      </button>
    </div>
  )
}