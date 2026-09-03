import { useLocation, Link } from 'react-router-dom'
import { ShieldCheck, Database, Settings, HelpCircle } from 'lucide-react'
import { sidebarNav } from '../../utils/dashboardContent'

export default function AdminSidebar() {
  const location = useLocation()

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-brand-navy/5 bg-brand-cream px-4 py-5 lg:flex">
      <div className="flex items-center gap-2 px-2">
        <img src="/logo.png" alt="Genius Society" className="h-7 w-7" />
        <div>
          <p className="text-sm font-extrabold leading-none text-brand-navy">
            Genius Society
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-brand-muted">
            Admin Portal
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-xl border border-brand-navy/10 bg-white px-3 py-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-navy font-mono text-sm font-bold text-white">
          A
        </span>
        <div>
          <p className="text-sm font-bold text-brand-navy">Administrator</p>
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-orange-light px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-brand-orange">
            <ShieldCheck size={10} strokeWidth={2.5} />
            Super Admin
          </span>
        </div>
      </div>

      <nav className="mt-6 flex flex-1 flex-col gap-1">
        {sidebarNav.map((item) => {
          const active = location.pathname === item.href
          return (
            <Link
              key={item.label}
              to={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-brand-orange text-white shadow-sm'
                  : 'text-brand-navy/70 hover:bg-white hover:text-brand-navy'
              }`}
            >
              <item.icon size={17} strokeWidth={2} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="space-y-3 border-t border-brand-navy/10 pt-4">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-brand-muted">
          Status Sistem
          <span className="inline-flex items-center gap-1 rounded-full bg-status-success-bg px-2 py-0.5 text-status-success">
            <span className="h-1.5 w-1.5 rounded-full bg-status-success" />
            Normal
          </span>
        </div>

        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-orange py-2.5 text-xs font-bold text-white hover:bg-brand-orange-dark">
          <Database size={14} strokeWidth={2} />
          Cadangkan Data
        </button>

        <div className="flex flex-col gap-1 pt-1">
          <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-brand-navy/70 hover:bg-white hover:text-brand-navy">
            <Settings size={16} strokeWidth={2} />
            Pengaturan
          </button>
          <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-brand-navy/70 hover:bg-white hover:text-brand-navy">
            <HelpCircle size={16} strokeWidth={2} />
            Bantuan
          </button>
        </div>
      </div>
    </aside>
  )
}