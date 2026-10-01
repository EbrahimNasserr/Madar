'use client'

import { useState } from 'react'
import { Users, Layers, CalendarDays, TrendingUp, Wallet, RefreshCw } from 'lucide-react'
import {
  useGetDashboardOverviewQuery,
  useGetFinancialTrendQuery,
  useGetAttendanceTrendQuery,
  useGetGroupsPerformanceQuery,
} from '@/src/lib/api/dashboardApi'
import { getCurrentBillingPeriod, formatBillingPeriod } from '@/src/lib/date/billingPeriod'
import { DashboardStatCard }          from './DashboardStatCard'
import { DashboardAttendanceSummary } from './DashboardAttendanceSummary'
import { TodaySessions }              from './TodaySessions'
import { RecentPayments }             from './RecentPayments'
import { FinancialTrendChart }        from './FinancialTrendChart'
import { AttendanceTrendChart }       from './AttendanceTrendChart'
import { GroupsPerformance }          from './GroupsPerformance'

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-64 rounded-xl bg-slate-200" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="h-28 rounded-2xl bg-slate-200" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-64 rounded-2xl bg-slate-200" />
        <div className="h-64 rounded-2xl bg-slate-200" />
      </div>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

export function DashboardPage() {
  const [period, setPeriod] = useState(getCurrentBillingPeriod)

  const {
    data:      overviewData,
    isLoading: overviewLoading,
    isError:   overviewError,
    refetch,
  } = useGetDashboardOverviewQuery(period)

  const { data: financialData,  isLoading: financialLoading  } = useGetFinancialTrendQuery(6)
  const { data: attendanceData, isLoading: attendanceLoading } = useGetAttendanceTrendQuery(7)
  const { data: groupsData,     isLoading: groupsLoading     } = useGetGroupsPerformanceQuery(period)

  const overview = overviewData?.data

  // ── Loading ────────────────────────────────────────────────────────────────
  if (overviewLoading) return <DashboardSkeleton />

  // ── Error ──────────────────────────────────────────────────────────────────
  if (overviewError || !overview) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center" dir="rtl">
        <p className="font-semibold text-slate-900">تعذر تحميل بيانات لوحة التحكم</p>
        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
        >
          <RefreshCw className="h-4 w-4" />
          إعادة المحاولة
        </button>
      </div>
    )
  }

  const financialTrend  = financialData?.data.trend  ?? []
  const attendanceTrend = attendanceData?.data.trend ?? []
  const groups          = groupsData?.data.groups    ?? []

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 p-6 lg:p-8" dir="rtl">

      {/* ── Page header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#3157D5]">
            مَدار
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
            لوحة التحكم
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            نظرة عامة على شغلك — {formatBillingPeriod(period)}
          </p>
        </div>

        {/* Period picker */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500">الفترة المالية</label>
          <input
            type="month"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#3157D5] focus:ring-4 focus:ring-[#3157D5]/10 transition"
          />
        </div>
      </div>

      {/* ── Top stats: students, groups, sessions, attendance ── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          title="الطلاب النشطون"
          value={overview.activeStudents}
          description={`${overview.activeGroups} مجموعات نشطة`}
          icon={<Users className="h-4 w-4" />}
          highlight="blue"
        />
        <DashboardStatCard
          title="حصص اليوم"
          value={overview.todaySessions.total}
          description={`${overview.todaySessions.scheduled} مجدولة · ${overview.todaySessions.completed} مكتملة`}
          icon={<CalendarDays className="h-4 w-4" />}
          highlight="blue"
        />
        <DashboardStatCard
          title="نسبة الحضور"
          value={`${overview.todayAttendance.attendanceRate.toFixed(0)}%`}
          description={`${overview.todayAttendance.present} حاضر · ${overview.todayAttendance.absent} غائب`}
          icon={<TrendingUp className="h-4 w-4" />}
          highlight="green"
        />
        <DashboardStatCard
          title="نسبة التحصيل"
          value={`${overview.financial.collectionRate.toFixed(0)}%`}
          description={`متبقي ${overview.financial.outstandingAmount.toLocaleString('ar-EG')} ج.م`}
          icon={<Wallet className="h-4 w-4" />}
          highlight={overview.financial.outstandingAmount > 0 ? 'amber' : 'green'}
        />
      </div>

      {/* ── Financial summary row ── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <DashboardStatCard
          title="المستحق هذا الشهر"
          value={`${overview.financial.expectedAmount.toLocaleString('ar-EG')} ج.م`}
        />
        <DashboardStatCard
          title="المحصّل"
          value={`${overview.financial.collectedAmount.toLocaleString('ar-EG')} ج.م`}
          highlight="green"
        />
        <DashboardStatCard
          title="المتبقي"
          value={`${overview.financial.outstandingAmount.toLocaleString('ar-EG')} ج.م`}
          highlight={overview.financial.outstandingAmount > 0 ? 'red' : undefined}
        />
      </div>

      {/* ── Today: sessions + attendance ── */}
      <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
        <TodaySessions sessions={overview.sessions} />
        <div className="lg:w-72">
          <DashboardAttendanceSummary attendance={overview.todayAttendance} />
        </div>
      </div>

      {/* ── Charts ── */}
      <div className="grid gap-4 lg:grid-cols-2">
        <FinancialTrendChart  data={financialTrend}  loading={financialLoading}  />
        <AttendanceTrendChart data={attendanceTrend} loading={attendanceLoading} />
      </div>

      {/* ── Groups + payments ── */}
      <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
        <GroupsPerformance groups={groups} loading={groupsLoading} />
        <div className="lg:w-80">
          <RecentPayments payments={overview.recentPayments} />
        </div>
      </div>

    </div>
  )
}
