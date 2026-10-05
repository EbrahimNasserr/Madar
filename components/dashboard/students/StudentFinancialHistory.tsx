'use client'

import { Loader2, Wallet, Banknote, AlertCircle } from 'lucide-react'
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

function SummaryCard({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon:       React.ElementType
  label:      string
  value:      number
  highlight?: 'green' | 'red'
}) {
  const iconCls =
    highlight === 'green' ? 'bg-emerald-100 text-emerald-600' :
    highlight === 'red'   ? 'bg-red-100 text-red-600'         :
                            'bg-slate-100 text-slate-500'
  const valCls =
    highlight === 'green' ? 'text-emerald-600' :
    highlight === 'red'   ? 'text-red-600'     : 'text-slate-900'

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconCls}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 truncate">{label}</p>
        <p className={`mt-0.5 text-lg font-bold tabular-nums ${valCls}`}>
          {value.toLocaleString('ar-EG')}
          <span className="ms-1 text-xs font-normal text-slate-400">ج.م</span>
        </p>
      </div>
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
      <div className="flex items-center justify-center gap-2 py-12 text-sm text-slate-400">
        <Loader2 className="h-4 w-4 animate-spin" />
        جارٍ تحميل السجل المالي…
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        <AlertCircle className="h-4 w-4 shrink-0" />
        تعذر تحميل المدفوعات. حاول تحديث الصفحة.
      </div>
    )
  }

  const summary  = data?.data.summary
  const payments = data?.data.payments ?? []

  return (
    <section className="space-y-5">
      {/* Section title */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
          <Wallet className="h-4 w-4 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">السجل المالي</h2>
          {payments.length > 0 && (
            <p className="text-xs text-slate-400">{payments.length} عملية مسجّلة</p>
          )}
        </div>
      </div>

      {/* Summary KPI row */}
      {summary && (
        <div className="grid gap-3 sm:grid-cols-3">
          <SummaryCard icon={Banknote}    label="الإجمالي المطلوب" value={summary.totalAmount} />
          <SummaryCard icon={Wallet}      label="المدفوع"           value={summary.totalPaid}        highlight="green" />
          <SummaryCard icon={AlertCircle} label="المتبقي"           value={summary.totalOutstanding} highlight={summary.totalOutstanding > 0 ? 'red' : undefined} />
        </div>
      )}

      {/* History list */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="font-bold text-slate-900">تفاصيل المدفوعات</h3>
          {payments.length > 0 && (
            <p className="mt-0.5 text-xs text-slate-400">{payments.length} عملية</p>
          )}
        </div>

        <div className="divide-y divide-slate-100">
          {payments.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <Wallet className="h-8 w-8 text-slate-300" />
              <p className="text-sm font-medium text-slate-500">لا توجد مدفوعات حتى الآن</p>
              <p className="text-xs text-slate-400">ستظهر المدفوعات هنا بعد تسجيل أول حصة أو اشتراك.</p>
            </div>
          ) : (
            payments.map((payment) => (
              <StudentPaymentRow key={payment._id} payment={payment} />
            ))
          )}
        </div>
      </div>
    </section>
  )
}
