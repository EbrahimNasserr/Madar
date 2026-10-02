'use client'

import { FormEvent, useState } from 'react'
import { Loader2 } from 'lucide-react'
import type { LedgerItem } from '@/src/lib/api/paymentsApi'
import { usePayPaymentMutation } from '@/src/lib/api/paymentsApi'
import { toast } from 'sonner'

type PaymentMethod = "cash" | "bank_transfer" | "instapay" | "other"

type PaymentFormProps = {
  payment:        LedgerItem
  // context for cache invalidation — pass whichever applies
  groupId?:       string
  billingPeriod?: string
  sessionId?:     string
  onSuccess:      () => void
}

export function PaymentForm({
  payment,
  groupId,
  billingPeriod,
  sessionId,
  onSuccess,
}: PaymentFormProps) {
  const [amount,        setAmount]        = useState(payment.remainingAmount)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
  const [notes,         setNotes]         = useState('')
  const [error,         setError]         = useState<string | null>(null)

  const [payPayment, { isLoading }] = usePayPaymentMutation()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    try {
      await payPayment({
        paymentId: payment.paymentId,
        amount,
        paymentMethod,
        notes:         notes.trim() || undefined,
        sessionId,
        groupId,
        billingPeriod,
      }).unwrap()
      toast.success('تم تسجيل الدفعة بنجاح.')
      onSuccess()
    } catch {
      setError('تعذر تسجيل الدفعة. حاول مرة أخرى.')
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 p-1">
      {/* Info card */}
      <div className="rounded-xl bg-slate-50 p-4">
        <p className="text-xs text-slate-500">الطالب</p>
        <p className="mt-0.5 font-semibold text-slate-900">
          {payment.student.firstName} {payment.student.lastName}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-slate-500">المتبقي</p>
          <p className="text-xl font-bold text-slate-950">
            {payment.remainingAmount.toLocaleString('ar-EG')} ج.م
          </p>
        </div>
      </div>

      {/* Amount */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-600">
          المبلغ المدفوع
          <span className="text-red-500 mr-0.5">*</span>
        </label>
        <input
          type="number"
          min={1}
          max={payment.remainingAmount}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          required
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#3157D5] focus:ring-4 focus:ring-[#3157D5]/10 transition"
        />
      </div>

      {/* Method */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-600">طريقة الدفع</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#3157D5] focus:ring-4 focus:ring-[#3157D5]/10 transition"
        >
          <option value="cash">نقدي</option>
          <option value="instapay">InstaPay</option>
          <option value="bank_transfer">تحويل بنكي</option>
          <option value="other">أخرى</option>
        </select>
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-600">ملاحظات</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="اختياري..."
          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#3157D5] focus:ring-4 focus:ring-[#3157D5]/10 transition"
        />
      </div>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading || amount <= 0 || amount > payment.remainingAmount}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3157D5] px-4 py-3 text-sm font-semibold text-white hover:bg-[#243FA3] disabled:opacity-50 transition"
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {isLoading ? 'جارٍ تسجيل الدفعة...' : `تسجيل ${amount.toLocaleString('ar-EG')} ج.م`}
      </button>
    </form>
  )
}
