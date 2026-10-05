'use client'

import {
  BarChart, Bar, Cell,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
  RadialBarChart, RadialBar,
} from 'recharts'
import { formatMoney }      from '@/src/lib/formatters/money'
import { formatPercentage } from '@/src/lib/formatters/percentage'
import type { ReportOverview } from '@/src/lib/api/reportsApi'
import { CHART_COLORS as C } from './constants'
import { TooltipShell, ReportSection, ChartCard } from './ReportShared'

// ─── Tooltip ──────────────────────────────────────────────────────────────────

type FinTooltipProps = {
  active?:  boolean
  payload?: { value: number; name: string; color: string }[]
}

function FinancialTooltip({ active, payload }: FinTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <TooltipShell>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-500">{p.name}:</span>
          <span className="font-semibold">{formatMoney(p.value)}</span>
        </div>
      ))}
    </TooltipShell>
  )
}

// ─── Bar chart ────────────────────────────────────────────────────────────────

type BarChartProps = Pick<
  ReportOverview['financial'],
  'expectedAmount' | 'collectedAmount' | 'outstandingAmount' | 'totalExpenses' | 'netIncome'
>

function FinancialBarChart({
  expectedAmount,
  collectedAmount,
  outstandingAmount,
  totalExpenses,
  netIncome,
}: BarChartProps) {
  const bars = [
    { name: 'المستحق',    value: expectedAmount,                       fill: C.blue  },
    { name: 'المحصل',     value: collectedAmount,                      fill: C.green },
    { name: 'المتبقي',    value: outstandingAmount,                    fill: C.amber },
    { name: 'المصروفات',  value: totalExpenses,                        fill: C.red   },
    { name: 'صافي الدخل', value: Math.max(0, netIncome),               fill: netIncome >= 0 ? C.green : C.red },
  ]

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={bars} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barCategoryGap="35%">
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 10, fill: '#94A3B8' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: '#94A3B8' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
          width={36}
        />
        <Tooltip content={<FinancialTooltip />} cursor={{ fill: '#F8FAFC' }} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {bars.map((entry, i) => (
            <Cell key={i} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

// ─── Collection-rate gauge ────────────────────────────────────────────────────

function CollectionGauge({ rate }: { rate: number }) {
  const pct   = Math.min(100, Math.max(0, rate))
  const color = pct >= 80 ? C.green : pct >= 50 ? C.amber : C.red

  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={160}>
        <RadialBarChart
          cx="50%"
          cy="55%"
          innerRadius="65%"
          outerRadius="100%"
          startAngle={180}
          endAngle={0}
          data={[{ name: 'التحصيل', value: pct, fill: color }]}
          barSize={16}
        >
          <RadialBar dataKey="value" cornerRadius={8} background={{ fill: '#F1F5F9' }} />
        </RadialBarChart>
      </ResponsiveContainer>

      <div className="-mt-6 text-center">
        <p className="text-3xl font-bold tabular-nums" style={{ color }}>
          {formatPercentage(rate)}
        </p>
        <p className="mt-0.5 text-xs text-slate-400">نسبة التحصيل</p>
      </div>
    </div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

type Props = { financial: ReportOverview['financial'] }

export function FinancialSection({ financial }: Props) {
  return (
    <ReportSection
      title="التقرير المالي"
      subtitle="مقارنة المستحق والمحصل والمصروفات وصافي الدخل"
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Bar chart — 2 cols */}
        <ChartCard
          title="مقارنة البنود المالية"
          subtitle="بالجنيه المصري"
          className="lg:col-span-2"
        >
          <FinancialBarChart
            expectedAmount={financial.expectedAmount}
            collectedAmount={financial.collectedAmount}
            outstandingAmount={financial.outstandingAmount}
            totalExpenses={financial.totalExpenses}
            netIncome={financial.netIncome}
          />
        </ChartCard>

        {/* Collection gauge */}
        <ChartCard title="نسبة التحصيل" subtitle="المحصّل من المستحق">
          <CollectionGauge rate={financial.collectionRate} />

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-slate-50 p-3 text-center">
              <p className="text-[10px] text-slate-400">المتبقي</p>
              <p className="mt-0.5 text-sm font-bold text-red-600 tabular-nums">
                {formatMoney(financial.outstandingAmount)}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 text-center">
              <p className="text-[10px] text-slate-400">المصروفات</p>
              <p className="mt-0.5 text-sm font-bold text-amber-600 tabular-nums">
                {formatMoney(financial.totalExpenses)}
              </p>
            </div>
          </div>
        </ChartCard>
      </div>
    </ReportSection>
  )
}
