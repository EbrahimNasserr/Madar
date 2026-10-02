'use client'

import { useState } from 'react'
import { Receipt, Plus } from 'lucide-react'

import {
  useGetExpensesQuery,
  useGetExpenseSummaryQuery,
} from '@/src/lib/api/expensesApi'
import { getCurrentBillingPeriod } from '@/src/lib/date/billingPeriod'
import { formatMoney }             from '@/src/lib/formatters/money'
import { formatDate }              from '@/src/lib/formatters/date'
import { getExpenseCategoryLabel } from '@/src/constants/expenses'

import PageHeader    from '@/components/ui/PageHeader'
import PageSkeleton  from '@/components/ui/PageSkeleton'
import ErrorState    from '@/components/ui/ErrorState'
import { Modal }     from '@/components/ui/Modal'
import ExpenseForm from './ExpenseForm'

// ─── Payment method labels ────────────────────────────────────────────────────

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash:          'نقدي',
  bank_transfer: 'تحويل بنكي',
  instapay:      'InstaPay',
  other:         'أخرى',
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ExpensesPage() {
  const [period,      setPeriod]      = useState(getCurrentBillingPeriod())
  const [createOpen,  setCreateOpen]  = useState(false)

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

  const isLoading = summaryLoading || listLoading
  const isError   = summaryError   || listError

  if (isLoading) return <PageSkeleton cards={3} />

  if (isError) {
    return <ErrorState title="تعذر تحميل المصروفات" onRetry={refetch} />
  }

  const summary  = summaryData?.data
  const expenses = expensesData?.data.expenses ?? []

  return (
    <div className="space-y-6" dir="rtl">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <PageHeader
        eyebrow="المصروفات"
        title="إدارة المصروفات"
        description="سجل مصروفات شغلك واعرف إجمالي تكلفة التشغيل."
        actions={
          <div className="flex items-center gap-3">
            <input
              type="month"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#3157D5] focus:ring-4 focus:ring-[#3157D5]/10 transition"
            />
            <button
              onClick={() => setCreateOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#3157D5] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#243FA3] transition"
            >
              <Plus className="h-4 w-4" />
              مصروف جديد
            </button>
          </div>
        }
      />

      {/* ── Summary cards ─────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="إجمالي المصروفات" value={formatMoney(summary?.totalExpenses)} />
        <StatCard label="عدد العمليات"     value={summary?.count ?? 0} />
        <StatCard
          label="متوسط المصروف"
          value={
            summary?.count
              ? formatMoney(summary.totalExpenses / summary.count)
              : formatMoney(0)
          }
        />
      </div>

      {/* ── Category breakdown ────────────────────────────────────────────── */}
      {summary?.byCategory && summary.byCategory.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-bold text-slate-950">التوزيع حسب التصنيف</h2>
          </div>
          <div className="grid gap-px bg-slate-100 sm:grid-cols-2 lg:grid-cols-4">
            {summary.byCategory.map((cat) => (
              <div key={cat.category} className="bg-white px-5 py-4">
                <p className="text-sm text-slate-500">{getExpenseCategoryLabel(cat.category)}</p>
                <p className="mt-1 text-lg font-bold text-slate-950">{formatMoney(cat.amount)}</p>
                <p className="mt-0.5 text-xs text-slate-400">{cat.count} عملية</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Expenses table ────────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-bold text-slate-950">
            قائمة المصروفات
            {expenses.length > 0 && (
              <span className="mr-2 text-sm font-normal text-slate-400">({expenses.length})</span>
            )}
          </h2>
        </div>

        {expenses.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-14 text-center">
            <Receipt className="size-10 text-slate-300" />
            <p className="font-medium text-slate-900">لا توجد مصروفات خلال هذا الشهر</p>
            <p className="text-sm text-slate-400">اضغط "مصروف جديد" لتسجيل أول مصروف.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-right text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">المصروف</th>
                  <th className="px-5 py-3 font-medium">التصنيف</th>
                  <th className="px-5 py-3 font-medium">التاريخ</th>
                  <th className="px-5 py-3 font-medium">طريقة الدفع</th>
                  <th className="px-5 py-3 font-medium text-start">المبلغ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.map((expense) => (
                  <tr key={expense._id} className="transition hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900">{expense.title}</p>
                      {expense.notes && (
                        <p className="mt-0.5 text-xs text-slate-400">{expense.notes}</p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {getExpenseCategoryLabel(expense.category)}
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {formatDate(expense.expenseDate)}
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {PAYMENT_METHOD_LABELS[expense.paymentMethod]}
                    </td>
                    <td className="px-5 py-4 text-start font-semibold tabular-nums text-slate-950">
                      {formatMoney(expense.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Create modal ──────────────────────────────────────────────────── */}
      {createOpen && (
        <Modal
          title="تسجيل مصروف جديد"
          onClose={() => setCreateOpen(false)}
          size="md"
        >
          <ExpenseForm
            onSuccess={() => setCreateOpen(false)}
            onCancel={()  => setCreateOpen(false)}
          />
        </Modal>
      )}
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
    </div>
  )
}
