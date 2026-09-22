interface ClassKurikulumTabsProps {
  active: 'kelas' | 'kurikulum'
  onChange: (tab: 'kelas' | 'kurikulum') => void
}

export default function ClassKurikulumTabs({
  active,
  onChange,
}: ClassKurikulumTabsProps) {
  const tabs: { key: 'kelas' | 'kurikulum'; label: string }[] = [
    { key: 'kelas', label: 'Kelas' },
    { key: 'kurikulum', label: 'Kurikulum' },
  ]

  return (
    <div className="flex gap-1 border-b border-brand-navy/10">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
            active === tab.key
              ? 'border-brand-orange text-brand-orange'
              : 'border-transparent text-brand-muted hover:text-brand-navy'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}