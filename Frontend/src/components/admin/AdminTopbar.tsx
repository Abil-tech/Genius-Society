import { Search, Bell, ChevronDown, ShieldCheck } from 'lucide-react'

export default function AdminTopbar() {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-brand-navy/5 bg-white px-6 py-3.5">
      <div className="hidden font-mono text-[11px] font-semibold uppercase tracking-widest text-brand-muted sm:block">
        Genius_Society
      </div>

      <div className="relative flex-1 sm:max-w-md">
        <Search
          size={16}
          strokeWidth={2}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted"
        />
        <input
          type="text"
          placeholder="Cari data siswa, guru, kelas atau log..."
          className="w-full rounded-lg border border-brand-navy/10 bg-brand-bg py-2 pl-10 pr-16 text-sm text-brand-navy placeholder:text-brand-muted outline-none focus:border-brand-orange"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-brand-muted">
          TA 2026/2027
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative text-brand-navy/70 hover:text-brand-navy">
          <Bell size={19} strokeWidth={2} />
          <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-orange text-[9px] font-bold text-white">
            3
          </span>
        </button>

        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-navy font-mono text-xs font-bold text-white">
            A
          </span>
          <div className="hidden text-left sm:block">
            <p className="flex items-center gap-1 text-xs font-bold text-brand-navy">
              Administrator
              <ShieldCheck size={11} className="text-brand-orange" />
            </p>
          </div>
          <ChevronDown size={14} className="text-brand-muted" />
        </div>
      </div>
    </header>
  )
}