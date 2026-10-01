'use client'

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { AttendanceTrendItem } from '@/src/lib/api/dashboardApi'
import { formatArabicDateShort } from '@/src/lib/date/formatDate'

type AttendanceTrendChartProps = {
  data:     AttendanceTrendItem[]
  loading?: boolean
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg text-xs" dir="rtl">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      <p className="text-[#3157D5] font-semibold">{payload[0]?.value}% حضور</p>
    </div>
  )
}

export function AttendanceTrendChart({ data, loading }: AttendanceTrendChartProps) {
  // Format dates for display
  const formatted = data.map((item) => ({
    ...item,
    label: (() => {
      try { return formatArabicDateShort(item.date) } catch { return item.date }
    })(),
  }))

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="font-bold text-slate-900">اتجاه الحضور</h2>
      <p className="mt-0.5 text-xs text-slate-400">نسبة الحضور خلال آخر 7 أيام</p>

      <div className="mt-5 h-52">
        {loading ? (
          <div className="h-full animate-pulse rounded-xl bg-slate-100" />
        ) : data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            لا توجد بيانات حضور.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formatted} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 9, fill: '#94A3B8' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: '#94A3B8' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="attendanceRate"
                name="الحضور"
                stroke="#3157D5"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#3157D5', strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
