interface PersonnelTabsProps {
  active: 'semua' | 'guru' | 'staf'
  onChange: (tab: 'semua' | 'guru' | 'staf') => void
  total: number
  guruCount: number
  stafCount: number
}

export default function PersonnelTabs({
  active,
  onChange,
  total,
  guruCount,
  stafCount,
}: PersonnelTabsProps) {
  const tabs: { key: 'semua' | 'guru' | 'staf'; label: string; count: number }[] = [
    { key: 'semua', label: 'Semua', count: total },
    { key: 'guru', label: 'Guru', count: guruCount },
    { key: 'staf', label: 'Staf', count: stafCount },
  ]

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-navy/10">
      <div className="flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`border-b-2 px-3 py-2.5 text-sm font-semibold transition-colors ${
              active === tab.key
                ? 'border-brand-orange text-brand-orange'
                : 'border-transparent text-brand-muted hover:text-brand-navy'
            }`}
          >
            {tab.label} <span className="text-xs">{tab.count}</span>
          </button>
        ))}
      </div>
      <p className="pb-2 font-mono text-[10px] uppercase tracking-widest text-brand-muted">
        Total Rekapitulasi: {total} Data
      </p>
    </div>
  )
}