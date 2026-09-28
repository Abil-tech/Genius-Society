interface Props {
  ungradedCount: number
  efficiencyRate: number
}

export default function AssignmentSummaryCard({ ungradedCount, efficiencyRate }: Props) {
  return (
    <div className="rounded-sm bg-[#3A2E24] p-6 font-mono text-white">
      <p className="text-[10px] uppercase tracking-wider text-white/70">Summary_Metrics</p>
      <p className="mt-4 text-xl text-[#FF9500]">{ungradedCount}</p>
      <p className="text-[10px] uppercase leading-tight text-white/80">
        Belum
        <br />
        Dinilai
      </p>
      <div className="my-5 border-t border-white/20" />
      <div className="flex items-center justify-between text-[10px] uppercase">
        <span>Efficiency_Rate</span>
        <span className="text-[#FF9500]">{efficiencyRate}%</span>
      </div>
      <div className="mt-2 h-1 rounded-full bg-white/20">
        <div
          className="h-1 rounded-full bg-[#FF9500]"
          style={{ width: `${Math.min(100, Math.max(0, efficiencyRate))}%` }}
        />
      </div>
    </div>
  )
}