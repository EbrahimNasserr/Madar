'use client'

import { useState } from 'react'
import { Loader2, RefreshCw } from 'lucide-react'
import {
  useGetGroupPaymentLedgerQuery,
  useGenerateMonthlyPaymentsMutation,
} from '@/src/lib/api/paymentsApi'
import {
  getCurrentBillingPeriod,
  formatBillingPeriod,
} from '@/src/lib/date/billingPeriod'
import { PaymentRow } from './PaymentRow'

// ─── Financial summary card ───────────────────────────────────────────────────

function FinancialCard({
  label,
  value,
  currency = true,
  highlight,
}: {
  label:      string
  value:      number
  currency?:  boolean
  highlight?: 'red' | 'green'
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`mt-2 text-2xl font-bold tabular-nums ${
        highlight === 'red'   ? 'text-red-600'     :
        highlight === 'green' ? 'text-emerald-600' :
        'text-slate-950'
      }`}>
        {value.toLocaleString('ar-EG')}
        {currency && <span className="mr-1 text-sm font-normal text-slate-400">ج.م</span>}
      </p>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

type MonthlyPaymentLedgerProps = {
  groupId: string
}

export function MonthlyPaymentLedger({ groupId }: MonthlyPaymentLedgerProps) {
  const [period, setPeriod] = useState(getCurrentBillingPeriod)

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetGroupPaymentLedgerQuery({ groupId, billingPeriod: period })

  const [generateMonthlyPayments, { isLoading: isGenerating }] =
    useGenerateMonthlyPaymentsMutation()

  const summary = data?.data.summary
  const ledger  = data?.data.ledger ?? []

  const handleGenerate = async () => {
    await generateMonthlyPayments({ groupId, billingPeriod: period }).unwrap()
  }

  return (
    <section className="space-y-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
      {/* ── Header row ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="font-bold text-slate-900">سجل المدفوعات الشهري</h3>
          <p className="mt-0.5 text-xs text-slate-500">
            {period ? formatBillingPeriod(period) : ''}
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          {/* Period picker */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500">الشهر</label>
            <input
              type="month"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#3157D5] focus:ring-4 focus:ring-[#3157D5]/10 transition"
            />
          </div>

          {/* Generate invoices */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 rounded-xl bg-[#3157D5] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#243FA3] disabled:opacity-50 transition"
          >
            {isGenerating && <Loader2 className="h-4 w-4 animate-spin" />}
            {isGenerating ? 'جارٍ إنشاء الفواتير...' : 'إنشاء فواتير الشهر'}
          </button>
        </div>
      </div>

      {/* ── Loading ── */}
      {(isLoading || isFetching) && (
        <div className="flex items-center gap-2 py-8 text-sm text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          جارٍ تحميل السجل...
        </div>
      )}

      {/* ── Error ── */}
      {isError && !isLoading && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-700">تعذر تحميل سجل المدفوعات.</p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 transition"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* ── Empty ── */}
      {!isLoading && !isError && ledger.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white py-10 text-center">
          <p className="font-medium text-slate-700">لا توجد فواتير لهذا الشهر</p>
          <p className="mt-1 text-sm text-slate-400">
            اضغط "إنشاء فواتير الشهر" لتوليد فاتورة لكل طالب.
          </p>
        </div>
      )}

      {/* ── Summary cards ── */}
      {!isLoading && summary && ledger.length > 0 && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <FinancialCard label="المطلوب"     value={summary.totalAmount}       />
            <FinancialCard label="المحصّل"     value={summary.paidAmount}        highlight="green" />
            <FinancialCard label="المتبقي"     value={summary.outstandingAmount} highlight={summary.outstandingAmount > 0 ? 'red' : undefined} />
            <FinancialCard label="عدد الطلاب"  value={summary.totalStudents}     currency={false} />
          </div>

          {/* Status breakdown chips */}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-emerald-50 px-3 py-1.5 font-medium text-emerald-700">
              {summary.paidCount} مدفوع
            </span>
            <span className="rounded-full bg-amber-50 px-3 py-1.5 font-medium text-amber-700">
              {summary.partialCount} جزئي
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1.5 font-medium text-slate-700">
              {summary.pendingCount} لم يدفع
            </span>
          </div>

          {/* ── Ledger table ── */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-right text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-5 py-3 font-medium text-slate-500">الطالب</th>
                  <th className="px-5 py-3 font-medium text-slate-500">المطلوب</th>
                  <th className="px-5 py-3 font-medium text-slate-500">المدفوع</th>
                  <th className="px-5 py-3 font-medium text-slate-500">المتبقي</th>
                  <th className="px-5 py-3 font-medium text-slate-500">الحالة</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {ledger.map((item) => (
                  <PaymentRow
                    key={item.paymentId}
                    item={item}
                    groupId={groupId}
                    billingPeriod={period}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  )
}
