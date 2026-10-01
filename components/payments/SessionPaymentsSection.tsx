'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import type { AttendanceSheetItem, AttendanceStatus } from '@/src/lib/api/attendanceApi'
import type { Payment, LedgerItem } from '@/src/lib/api/paymentsApi'
import { useCreateSessionPaymentMutation } from '@/src/lib/api/paymentsApi'
import { Modal, ModalBody } from '@/components/ui/Modal'
import { PaymentForm } from './PaymentForm'

// ─── Types ────────────────────────────────────────────────────────────────────

type DraftAttendance = {
  studentId: string
  status:    AttendanceStatus
  note:      string
}

type SessionPaymentsSectionProps = {
  sessionId:        string
  students:         AttendanceSheetItem[]
  attendance:       DraftAttendance[]
  paymentByStudent: Map<string, Payment>
  pricePerSession:  number
}

// ─── Payment status actions ───────────────────────────────────────────────────

function PaymentActions({
  payment,
  sessionId,
  onPay,
}: {
  payment:   Payment
  sessionId: string
  onPay:     () => void
}) {
  const remaining = payment.amount - payment.paidAmount

  if (payment.status === 'paid') {
    return (
      <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
        مدفوع ✓
      </span>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {payment.status === 'partial' && (
        <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
          متبقي {remaining.toLocaleString('ar-EG')} ج.م
        </span>
      )}
      <button
        onClick={onPay}
        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition"
      >
        تسجيل دفعة
      </button>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function SessionPaymentsSection({
  sessionId,
  students,
  attendance,
  paymentByStudent,
  pricePerSession,
}: SessionPaymentsSectionProps) {
  const [createPayment, { isLoading: isCreating }] = useCreateSessionPaymentMutation()
  const [selectedPayment, setSelectedPayment]       = useState<Payment | null>(null)
  const [creatingFor,     setCreatingFor]           = useState<string | null>(null)

  const getStatus = (studentId: string) =>
    attendance.find((a) => a.studentId === studentId)?.status

  const handleCreate = async (studentId: string) => {
    setCreatingFor(studentId)
    try {
      await createPayment({ sessionId, studentId }).unwrap()
    } finally {
      setCreatingFor(null)
    }
  }

  // Build a LedgerItem shape from a Payment for PaymentForm
  const toLedgerItem = (p: Payment): LedgerItem => ({
    paymentId:       p._id,
    student:         typeof p.studentId === 'string' ? ({ _id: p.studentId } as any) : p.studentId,
    amount:          p.amount,
    paidAmount:      p.paidAmount,
    remainingAmount: p.amount - p.paidAmount,
    status:          p.status,
    paymentMethod:   p.paymentMethod,
    paymentDate:     p.paymentDate,
  })

  return (
    <>
      <section className="rounded-2xl border border-slate-200 bg-white">
        {/* Header */}
        <div className="border-b border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-900">مدفوعات الحصة</h2>
          <p className="mt-1 text-sm text-slate-500">
            الحاضر والمتأخر فقط يتم احتساب رسوم الحصة لهم.
          </p>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-100">
          {students.map(({ student }) => {
            const status  = getStatus(student._id)
            const payment = paymentByStudent.get(student._id)
            const canCharge = status === 'present' || status === 'late'
            const isThisCreating = creatingFor === student._id

            return (
              <div
                key={student._id}
                className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                {/* Student info */}
                <div>
                  <p className="font-medium text-slate-900">
                    {student.firstName} {student.lastName}
                  </p>
                  <p className="mt-0.5 text-sm text-slate-400">
                    {canCharge ? `${pricePerSession.toLocaleString('ar-EG')} ج.م` : 'غائب'}
                  </p>
                </div>

                {/* Action */}
                <div className="flex shrink-0 items-center gap-2">
                  {!canCharge ? (
                    <span className="text-sm text-slate-300">—</span>
                  ) : !payment ? (
                    <button
                      disabled={isCreating}
                      onClick={() => handleCreate(student._id)}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#3157D5] px-4 py-2 text-sm font-semibold text-white hover:bg-[#243FA3] disabled:opacity-50 transition"
                    >
                      {isThisCreating && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      إنشاء مستحق
                    </button>
                  ) : (
                    <PaymentActions
                      payment={payment}
                      sessionId={sessionId}
                      onPay={() => setSelectedPayment(payment)}
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Pay modal */}
      {selectedPayment && (
        <Modal
          title="تسجيل دفعة"
          onClose={() => setSelectedPayment(null)}
          size="sm"
        >
          <ModalBody scrollable={false}>
            <PaymentForm
              payment={toLedgerItem(selectedPayment)}
              sessionId={sessionId}
              onSuccess={() => setSelectedPayment(null)}
            />
          </ModalBody>
        </Modal>
      )}
    </>
  )
}
