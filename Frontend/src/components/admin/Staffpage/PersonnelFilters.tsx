import { Search } from 'lucide-react'

const filterFields = [
  { placeholder: 'Semua Tipe' },
  { placeholder: 'Semua Jabatan' },
  { placeholder: 'Semua Mapel' },
  { placeholder: 'Semua Status' },
]

interface PersonnelFiltersProps {
  searchValue: string
  onSearchChange: (value: string) => void
  onReset: () => void
}

export default function PersonnelFilters({
  searchValue,
  onSearchChange,
  onReset,
}: PersonnelFiltersProps) {
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
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nama lengkap, NIP, atau..."
          className="w-full rounded-lg border border-brand-navy/10 bg-white py-2 pl-9 pr-3 text-sm text-brand-navy placeholder:text-brand-muted outline-none focus:border-brand-orange"
        />
      </div>

      {filterFields.map((field) => (
        <select
          key={field.placeholder}
          defaultValue=""
          className="rounded-lg border border-brand-navy/10 bg-white px-3 py-2 text-sm text-brand-muted outline-none focus:border-brand-orange"
        >
          <option value="" disabled>
            {field.placeholder}
          </option>
        </select>
      ))}

      <button
        onClick={onReset}
        className="text-xs font-semibold text-brand-orange hover:underline"
      >
        Reset Filter
      </button>
    </div>
  )
}