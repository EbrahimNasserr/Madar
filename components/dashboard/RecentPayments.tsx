import type { DashboardOverview } from '@/src/lib/api/dashboardApi'

type Payment = DashboardOverview['recentPayments'][number]

const STATUS_STYLES: Record<Payment['status'], string> = {
  paid:      'bg-emerald-50 text-emerald-700',
  partial:   'bg-amber-50 text-amber-700',
  pending:   'bg-slate-100 text-slate-600',
  cancelled: 'bg-red-50 text-red-600',
}

const STATUS_LABELS: Record<Payment['status'], string> = {
  paid:      'مدفوع',
  partial:   'جزئي',
  pending:   'معلق',
  cancelled: 'ملغي',
}

type RecentPaymentsProps = {
  payments: Payment[] | null | undefined
}

export function RecentPayments({ payments: paymentsProp }: RecentPaymentsProps) {
  const payments = Array.isArray(paymentsProp) ? paymentsProp : []
  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="font-bold text-slate-900">آخر المدفوعات</h2>
        <p className="mt-0.5 text-xs text-slate-400">أحدث عمليات التحصيل</p>
      </div>

      {payments.length === 0 ? (
        <div className="p-8 text-center text-sm text-slate-400">
          لا توجد مدفوعات بعد.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {payments.map((payment) => {
            const remaining = payment.amount - payment.paidAmount
            return (
              <div key={payment._id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                <div className="min-w-0">
                  <p className="font-medium text-slate-900 truncate">
                    {payment.student
                      ? `${payment.student.firstName} ${payment.student.lastName}`
                      : 'طالب'}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400 truncate">
                    {payment.group?.name ?? ''}
                  </p>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="tabular-nums font-semibold text-slate-900">
                    {payment.paidAmount.toLocaleString('ar-EG')} ج.م
                  </span>
                  {remaining > 0 && (
                    <span className="text-xs text-red-500 tabular-nums">
                      متبقي {remaining.toLocaleString('ar-EG')} ج.م
                    </span>
                  )}
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_STYLES[payment.status]}`}>
                    {STATUS_LABELS[payment.status]}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
