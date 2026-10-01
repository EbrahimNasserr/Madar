'use client'

import { Loader2 } from 'lucide-react'
import { useGetStudentPaymentsQuery, type Payment } from '@/src/lib/api/paymentsApi'
import { formatArabicDate } from '@/src/lib/date/formatDate'

// ─── Status config ─────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<Payment['status'], string> = {
  pending:   'لم يدفع',
  partial:   'جزئي',
  paid:      'مدفوع',
  cancelled: 'ملغي',
}

const STATUS_STYLES: Record<Payment['status'], string> = {
  pending:   'bg-slate-100 text-slate-600',
  partial:   'bg-amber-50 text-amber-700',
  paid:      'bg-emerald-50 text-emerald-700',
  cancelled: 'bg-red-50 text-red-600',
}

// ─── Single payment row ────────────────────────────────────────────────────────

function StudentPaymentRow({ payment }: { payment: Payment }) {
  const group     = typeof payment.groupId === 'string' ? null : payment.groupId
  const remaining = payment.amount - payment.paidAmount

  const typeLabel =
    payment.type === 'monthly'
      ? `اشتراك ${payment.billingPeriod ?? ''}`
      : payment.type === 'session'
      ? 'حصة'
      : 'يدوي'

  return (
    <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Left — group + type */}
      <div className="min-w-0">
        <p className="font-medium text-slate-900 truncate">
          {group?.name ?? 'مجموعة'}
        </p>
        <p className="mt-0.5 text-xs text-slate-400">{typeLabel}</p>
        {payment.paymentDate && (
          <p className="mt-0.5 text-xs text-slate-400">
            {formatArabicDate(payment.paymentDate)}
          </p>
        )}
      </div>

      {/* Right — amounts + status */}
      <div className="flex flex-wrap items-center gap-4 shrink-0">
        <div className="text-center">
          <p className="text-[10px] text-slate-400">المطلوب</p>
          <p className="text-sm font-semibold text-slate-700 tabular-nums">
            {payment.amount.toLocaleString('ar-EG')} ج.م
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-slate-400">المدفوع</p>
          <p className="text-sm font-semibold text-emerald-600 tabular-nums">
            {payment.paidAmount.toLocaleString('ar-EG')} ج.م
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-slate-400">المتبقي</p>
          <p className={`text-sm font-semibold tabular-nums ${remaining > 0 ? 'text-red-600' : 'text-slate-400'}`}>
            {remaining.toLocaleString('ar-EG')} ج.م
          </p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[payment.status]}`}>
          {STATUS_LABELS[payment.status]}
        </span>
      </div>
    </div>
  )
}

// ─── Summary card ──────────────────────────────────────────────────────────────

function SummaryCard({ label, value, highlight }: {
  label:      string
  value:      number
  highlight?: 'green' | 'red'
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`mt-1 text-xl font-bold tabular-nums ${
        highlight === 'green' ? 'text-emerald-600' :
        highlight === 'red'   ? 'text-red-600'     : 'text-slate-900'
      }`}>
        {value.toLocaleString('ar-EG')}
        <span className="mr-1 text-xs font-normal text-slate-400">ج.م</span>
      </p>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

type StudentFinancialHistoryProps = {
  studentId: string
}

export function StudentFinancialHistory({ studentId }: StudentFinancialHistoryProps) {
  const { data, isLoading, isError } = useGetStudentPaymentsQuery(studentId)

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-8 text-sm text-slate-400">
        <Loader2 className="h-4 w-4 animate-spin" />
        جارٍ تحميل المدفوعات...
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        تعذر تحميل المدفوعات.
      </div>
    )
  }

  const summary  = data?.data.summary
  const payments = data?.data.payments ?? []

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      {summary && (
        <div className="grid gap-3 sm:grid-cols-3">
          <SummaryCard label="الإجمالي المطلوب" value={summary.totalAmount} />
          <SummaryCard label="المدفوع"           value={summary.totalPaid}        highlight="green" />
          <SummaryCard label="المتبقي"           value={summary.totalOutstanding} highlight={summary.totalOutstanding > 0 ? 'red' : undefined} />
        </div>
      )}

      {/* History list */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="font-bold text-slate-900">سجل المدفوعات</h3>
          <p className="mt-0.5 text-xs text-slate-400">{payments.length} عملية</p>
        </div>

        <div className="divide-y divide-slate-100">
          {payments.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">
              لا توجد مدفوعات حتى الآن.
            </div>
          ) : (
            payments.map((payment) => (
              <StudentPaymentRow key={payment._id} payment={payment} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
