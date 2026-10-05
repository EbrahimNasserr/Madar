'use client'

import { useState } from 'react'

import { useGetOverviewReportQuery } from '@/src/lib/api/reportsApi'
import { getCurrentBillingPeriod }   from '@/src/lib/date/billingPeriod'

import PageSkeleton from '@/components/ui/PageSkeleton'
import ErrorState   from '@/components/ui/ErrorState'

import { ReportsHeader }   from './ReportsHeader'
import { ReportsKpiRow }   from './ReportsKpiRow'
import { FinancialSection } from './FinancialSection'
import { AttendanceSection } from './AttendanceSection'
import { ActivitySection }  from './ActivitySection'

export function ReportsPage() {
  const [period, setPeriod] = useState(getCurrentBillingPeriod())

  const { data, isLoading, isFetching, isError, refetch } =
    useGetOverviewReportQuery(period)

  if (isLoading) return <PageSkeleton />

  if (isError || !data?.data) {
    return <ErrorState title="تعذر تحميل التقرير" onRetry={refetch} />
  }

  const { financial, attendance, sessions, groups } = data.data

  return (
    <div
      className={[
        'space-y-8 pb-8 transition-opacity',
        isFetching ? 'opacity-60 pointer-events-none' : '',
      ].join(' ')}
      dir="rtl"
    >
      <ReportsHeader period={period} onChange={setPeriod} />

      <ReportsKpiRow
        financial={financial}
        attendance={attendance}
        sessions={sessions}
        groups={groups}
      />

      <FinancialSection financial={financial} />

      <AttendanceSection attendance={attendance} />

      <ActivitySection sessions={sessions} groups={groups} />
    </div>
  )
}
