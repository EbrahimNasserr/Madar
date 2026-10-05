'use client'

import { useState } from 'react'

import {
  useGetExpensesQuery,
  useGetExpenseSummaryQuery,
} from '@/src/lib/api/expensesApi'
import { getCurrentBillingPeriod } from '@/src/lib/date/billingPeriod'

import PageSkeleton from '@/components/ui/PageSkeleton'
import ErrorState   from '@/components/ui/ErrorState'
import { Modal }    from '@/components/ui/Modal'

import ExpenseForm                    from './ExpenseForm'
import { ExpensesHeader }             from './ExpensesHeader'
import { ExpensesKpiRow }             from './ExpensesKpiRow'
import { ExpensesCategoryBreakdown }  from './ExpensesCategoryBreakdown'
import { ExpensesTable }              from './ExpensesTable'

export function ExpensesPage() {
  const [period,     setPeriod]     = useState(getCurrentBillingPeriod())
  const [createOpen, setCreateOpen] = useState(false)

  const {
    data:      summaryData,
    isLoading: summaryLoading,
    isError:   summaryError,
  } = useGetExpenseSummaryQuery(period)

  const {
    data:      expensesData,
    isLoading: listLoading,
    isError:   listError,
    refetch,
  } = useGetExpensesQuery({ page: 1, limit: 50, period })

  if (summaryLoading || listLoading) return <PageSkeleton cards={3} />

  if (summaryError || listError) {
    return <ErrorState title="تعذر تحميل المصروفات" onRetry={refetch} />
  }

  const summary  = summaryData?.data
  const expenses = expensesData?.data.expenses ?? []

  return (
    <div className="space-y-6" dir="rtl">
      <ExpensesHeader
        period={period}
        onPeriodChange={setPeriod}
        onAdd={() => setCreateOpen(true)}
      />

      <ExpensesKpiRow
        totalExpenses={summary?.totalExpenses ?? 0}
        count={summary?.count ?? 0}
      />

      <ExpensesCategoryBreakdown
        byCategory={summary?.byCategory ?? []}
      />

      <ExpensesTable
        expenses={expenses}
        onAdd={() => setCreateOpen(true)}
      />

      {createOpen && (
        <Modal
          title="تسجيل مصروف جديد"
          onClose={() => setCreateOpen(false)}
          size="md"
        >
          <ExpenseForm
            onSuccess={() => setCreateOpen(false)}
            onCancel={() => setCreateOpen(false)}
          />
        </Modal>
      )}
    </div>
  )
}
