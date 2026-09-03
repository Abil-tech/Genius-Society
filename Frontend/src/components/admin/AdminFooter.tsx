export default function AdminFooter() {
  return (
    <div className="flex flex-col items-center justify-between gap-2 border-t border-brand-navy/5 px-1 py-4 font-mono text-[10px] text-brand-muted sm:flex-row">
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <span>GENIUS_CORE_v2.4.0</span>
        <span className="text-brand-navy/20">•</span>
        <span>NODE: ID_247_CLUSTER_03</span>
        <span className="text-brand-navy/20">•</span>
        <span className="flex items-center gap-1 text-status-success">
          <span className="h-1.5 w-1.5 rounded-full bg-status-success" />
          All Services Operational
        </span>
      </div>
      <p>© {new Date().getFullYear()} Genius Society Academic Management</p>
    </div>
  )
}