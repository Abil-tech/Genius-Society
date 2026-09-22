import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { activityChart } from '../../utils/dashboardContent'

export default function ActivityChartCard() {
  return (
    <div className="rounded-2xl border border-brand-navy/5 bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-brand-navy">
            Aktivitas Siswa
          </h3>
          <p className="text-xs text-brand-muted">
            Ringkasan aktivitas pembelajaran 7 hari terakhir
          </p>
        </div>
        <span className="rounded-full bg-brand-bg px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide text-brand-muted">
          7 Hari Terakhir
        </span>
      </div>

      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-brand-muted">
        <span className="h-2 w-2 rounded-full bg-brand-orange" />
        Aktivitas Terverifikasi
      </div>

      <div className="mt-3 h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={activityChart} margin={{ left: -20, right: 8 }}>
            <defs>
              <linearGradient id="activityFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F7941D" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#F7941D" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#0F254512" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 10,
                border: '1px solid #0F254514',
                fontSize: 12,
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#F7941D"
              strokeWidth={2.5}
              fill="url(#activityFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1.5 border-t border-brand-navy/5 pt-3">
        {activityChart.map((point) => (
          <div
            key={point.day}
            className="rounded-lg bg-brand-bg py-1.5 text-center"
          >
            <p className="text-[10px] font-semibold text-brand-navy">
              {point.value.toLocaleString('id-ID')}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}