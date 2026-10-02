'use client'

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { FinancialTrendItem } from '@/src/lib/api/dashboardApi'

type FinancialTrendChartProps = {
  data:      FinancialTrendItem[]
  loading?:  boolean
  fetching?: boolean
}

type TooltipPayloadEntry = {
  name:  string
  value: number
  color: string
}

type ChartTooltipProps = {
  active?:  boolean
  payload?: TooltipPayloadEntry[]
  label?:   string
}

const CustomTooltip = ({ active, payload, label }: ChartTooltipProps) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg text-xs space-y-1" dir="rtl">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-slate-500">{entry.name}:</span>
          <span className="font-semibold">{entry.value.toLocaleString('ar-EG')} ج.م</span>
        </div>
      ))}
    </div>
  )
}

export function FinancialTrendChart({
  data,
  loading,
  fetching,
}: FinancialTrendChartProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-5 transition-opacity ${
        fetching ? 'opacity-60' : ''
      }`}
    >
      <h2 className="font-bold text-slate-900">الأداء المالي</h2>
      <p className="mt-0.5 text-xs text-slate-400">المستحق مقابل المحصل خلال آخر 6 أشهر</p>

      <div className="mt-5 h-52">
        {loading ? (
          <div className="h-full animate-pulse rounded-xl bg-slate-100" />
        ) : data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            لا توجد بيانات كافية.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gradExpected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3157D5" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3157D5" stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="gradCollected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10B981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis
                dataKey="period"
                tick={{ fontSize: 10, fill: '#94A3B8' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#94A3B8' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="expectedAmount"
                name="المستحق"
                stroke="#3157D5"
                strokeWidth={2}
                fill="url(#gradExpected)"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="collectedAmount"
                name="المحصل"
                stroke="#10B981"
                strokeWidth={2}
                fill="url(#gradCollected)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
