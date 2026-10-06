'use client'

import { useState } from 'react'
import type { LedgerItem } from '@/src/lib/api/paymentsApi'
import { Modal, ModalBody } from '@/components/ui/Modal'
import { PaymentForm } from './PaymentForm'
import Link from 'next/link'

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<LedgerItem['status'], string> = {
  pending:   'لم يدفع',
  partial:   'دفع جزئي',
  paid:      'مدفوع',
  cancelled: 'ملغي',
}

const STATUS_STYLES: Record<LedgerItem['status'], string> = {
  pending:   'bg-slate-100 text-slate-700',
  partial:   'bg-amber-50 text-amber-700',
  paid:      'bg-emerald-50 text-emerald-700',
  cancelled: 'bg-red-50 text-red-700',
}

// ─── Component ────────────────────────────────────────────────────────────────

type PaymentRowProps = {
  item:          LedgerItem
  groupId:       string
  billingPeriod: string
}

export function PaymentRow({ item, groupId, billingPeriod }: PaymentRowProps) {
  const [open, setOpen] = useState(false)

  const canPay = item.status !== 'paid' && item.status !== 'cancelled'

  return (
    <>
      <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
        {/* Student name */}
        <td className="px-5 py-4 font-medium text-slate-900 whitespace-nowrap">
          <Link href={`/students/${item.student._id}`}>{item.student.firstName} {item.student.lastName}</Link>
        </td>

        {/* Required */}
        <td className="px-5 py-4 tabular-nums text-slate-700">
          {item.amount.toLocaleString('ar-EG')} ج.م
        </td>

        {/* Paid */}
        <td className="px-5 py-4 tabular-nums text-emerald-700">
          {item.paidAmount.toLocaleString('ar-EG')} ج.م
        </td>

        {/* Remaining */}
        <td className={`px-5 py-4 tabular-nums font-semibold ${item.remainingAmount > 0 ? 'text-red-600' : 'text-slate-400'}`}>
          {item.remainingAmount.toLocaleString('ar-EG')} ج.م
        </td>

        {/* Status badge */}
        <td className="px-5 py-4">
          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[item.status]}`}>
            {STATUS_LABELS[item.status]}
          </span>
        </td>

        {/* Action */}
        <td className="px-5 py-4 text-left">
          {canPay && (
            <button
              onClick={() => setOpen(true)}
              className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
            >
              تسجيل دفعة
            </button>
          )}
        </td>
      </tr>

      {/* Payment modal */}
      {open && (
        <Modal
          title="تسجيل دفعة"
          onClose={() => setOpen(false)}
          size="sm"
        >
          <ModalBody scrollable={false}>
            <PaymentForm
              payment={item}
              groupId={groupId}
              billingPeriod={billingPeriod}
              onSuccess={() => setOpen(false)}
            />
          </ModalBody>
        </Modal>
      )}
    </>
  )
}
