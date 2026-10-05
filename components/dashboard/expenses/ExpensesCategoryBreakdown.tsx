'use client'

import {
  BarChart, Bar, Cell,
  PieChart, Pie,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import { formatMoney } from '@/src/lib/formatters/money'
import { getExpenseCategoryLabel } from '@/src/constants/expenses'
import type { ExpenseCategory } from '@/src/lib/api/expensesApi'

// Distinct colours per category slot
const CATEGORY_COLOURS = [
  '#3157D5', '#10B981', '#F59E0B', '#EF4444',
  '#8B5CF6', '#06B6D4', '#EC4899', '#64748B',
]

// ─── Tooltip ──────────────────────────────────────────────────────────────────

type TooltipProps = {
  active?:  boolean
  payload?: { value: number; payload: { name: string; count: number } }[]
}

function CategoryTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null
  const { value, payload: inner } = payload[0]
  return (
    <div
      className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-lg text-xs space-y-1"
      dir="rtl"
    >
      <p className="font-semibold text-slate-700">{inner.name}</p>
      <p className="text-slate-600">{formatMoney(value)}</p>
      <p className="text-slate-400">{inner.count} عملية</p>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

type CategoryItem = {
  category: ExpenseCategory
  amount:   number
  count:    number
}

type Props = { byCategory: CategoryItem[] }

export function ExpensesCategoryBreakdown({ byCategory }: Props) {
  if (!byCategory || byCategory.length === 0) return null

  const chartData = byCategory.map((cat, i) => ({
    name:   getExpenseCategoryLabel(cat.category),
    value:  cat.amount,
    count:  cat.count,
    fill:   CATEGORY_COLOURS[i % CATEGORY_COLOURS.length],
  }))

  const total = byCategory.reduce((sum, c) => sum + c.amount, 0)

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {/* Section header */}
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="font-bold text-slate-950">التوزيع حسب التصنيف</h2>
        <p className="mt-0.5 text-xs text-slate-400">توزيع المصروفات على الفئات المختلفة</p>
      </div>

      <div className="grid gap-0 lg:grid-cols-2">
        {/* Bar chart */}
        <div className="p-5 border-b border-slate-100 lg:border-b-0 lg:border-e border-slate-100">
          <p className="mb-4 text-xs font-semibold text-slate-500">المبالغ حسب الفئة</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={chartData}
              margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
              barCategoryGap="30%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 9, fill: '#94A3B8' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 9, fill: '#94A3B8' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) =>
                  v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
                }
                width={32}
              />
              <Tooltip content={<CategoryTooltip />} cursor={{ fill: '#F8FAFC' }} />
              <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Donut + legend */}
        <div className="flex flex-col items-center justify-center gap-4 p-5">
          <p className="self-start text-xs font-semibold text-slate-500">النسب المئوية</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={74}
                paddingAngle={3}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CategoryTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend pills */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            {chartData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-slate-600">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ background: d.fill }}
                />
                <span>{d.name}</span>
                <span className="font-semibold text-slate-800">
                  {total > 0 ? Math.round((d.value / total) * 100) : 0}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
