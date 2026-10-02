'use client'

import { useState } from 'react'

import { useGetOverviewReportQuery } from '@/src/lib/api/reportsApi'
import { getCurrentBillingPeriod }   from '@/src/lib/date/billingPeriod'
import { formatMoney }               from '@/src/lib/formatters/money'
import { formatPercentage }          from '@/src/lib/formatters/percentage'

import PageHeader   from '@/components/ui/PageHeader'
import PageSkeleton from '@/components/ui/PageSkeleton'
import ErrorState   from '@/components/ui/ErrorState'

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ReportsPage() {
  const [period, setPeriod] = useState(getCurrentBillingPeriod())

  const { data, isLoading, isFetching, isError, refetch } =
    useGetOverviewReportQuery(period)

  if (isLoading) return <PageSkeleton />

  if (isError || !data?.data) {
    return <ErrorState title="تعذر تحميل التقرير" onRetry={refetch} />
  }

  const report = data.data

  return (
    <div
      className={[
        'space-y-8 transition-opacity',
        isFetching ? 'opacity-70' : '',
      ].join(' ')}
      dir="rtl"
    >
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <PageHeader
        eyebrow="التقارير"
        title="تقارير الأداء"
        description="تابع الأداء المالي والحضور والحصص خلال الفترة المحددة."
        actions={
          <input
            type="month"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#3157D5] focus:ring-4 focus:ring-[#3157D5]/10 transition"
          />
        }
      />

      {/* ── Financial ─────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <SectionTitle title="التقرير المالي" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <ReportCard label="المستحق" value={formatMoney(report.financial.expectedAmount)} />
          <ReportCard label="المحصل"  value={formatMoney(report.financial.collectedAmount)} />
          <ReportCard label="المتبقي" value={formatMoney(report.financial.outstandingAmount)} />
          <ReportCard
            label="المصروفات"
            value={formatMoney(report.financial.totalExpenses)}
            highlight="danger"
          />
          <ReportCard
            label="صافي الدخل"
            value={formatMoney(report.financial.netIncome)}
            highlight={report.financial.netIncome >= 0 ? 'success' : 'danger'}
          />
          <ReportCard
            label="نسبة التحصيل"
            value={formatPercentage(report.financial.collectionRate)}
          />
        </div>
      </section>

      {/* ── Attendance ────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <SectionTitle title="الحضور" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <ReportCard label="حاضر"     value={report.attendance.present} />
          <ReportCard label="متأخر"    value={report.attendance.late}    />
          <ReportCard label="غائب"     value={report.attendance.absent}  />
          <ReportCard label="الإجمالي" value={report.attendance.total}   />
          <ReportCard
            label="نسبة الحضور"
            value={formatPercentage(report.attendance.attendanceRate)}
          />
        </div>
      </section>

      {/* ── Activity ──────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <SectionTitle title="النشاط" />
        <div className="grid gap-4 sm:grid-cols-2">
          <ReportCard label="عدد الحصص"        value={report.sessions.total} />
          <ReportCard label="المجموعات النشطة" value={report.groups.total}   />
        </div>
      </section>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionTitle({ title }: { title: string }) {
  return (
    <h2 className="border-b border-slate-100 pb-2 text-lg font-bold text-slate-950">
      {title}
    </h2>
  )
}

function ReportCard({
  label,
  value,
  highlight,
}: {
  label:      string
  value:      number | string
  highlight?: 'success' | 'danger'
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p
        className={[
          'mt-2 text-2xl font-bold tabular-nums',
          highlight === 'success'
            ? 'text-green-600'
            : highlight === 'danger'
            ? 'text-red-600'
            : 'text-slate-950',
        ].join(' ')}
      >
        {value}
      </p>
    </div>
  )
}
