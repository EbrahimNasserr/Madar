'use client'

import { useState } from 'react'
import { Loader2, MessageCircle, Check } from 'lucide-react'

import type { Student } from '@/src/lib/api/studentsApi'
import { useLazyGetParentReportQuery } from '@/src/lib/api/studentsApi'
import { getApiErrorMessage } from '@/src/lib/api/error'
import {
  normalizeEgyptPhone,
  buildParentReportMessage,
} from '@/src/lib/whatsapp'
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalError,
} from '@/components/ui/Modal'

type Props = {
  student: Student
  onClose: () => void
}

const REPORT_INCLUDES = [
  'الحضور والغياب',
  'التأخير',
  'الاختبارات',
  'الدرجات',
  'المدفوعات',
  'المبالغ المستحقة',
]

export function SendParentReportModal({ student, onClose }: Props) {
  const [triggerReport] = useLazyGetParentReportQuery()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSend = async () => {
    setError(null)
    setIsLoading(true)

    try {
      const result = await triggerReport(student._id).unwrap()
      const report = result.data

      const message = encodeURIComponent(
        buildParentReportMessage(report)
      )
      const phone = normalizeEgyptPhone(student.parentPhone ?? '')

      window.open(
        `https://wa.me/${phone}?text=${message}`,
        '_blank'
      )
      onClose()
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal title="إرسال تقرير لولي الأمر" onClose={onClose} size="sm">
      <ModalBody scrollable={false}>
        {/* Parent info */}
        <div className="space-y-3 py-1">
          {student.parentName && (
            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
              <span className="text-sm text-slate-500">ولي الأمر</span>
              <span className="text-sm font-semibold text-slate-900">
                {student.parentName}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
            <span className="text-sm text-slate-500">رقم WhatsApp</span>
            <span className="text-sm font-semibold text-slate-900" dir="ltr">
              {student.parentPhone ?? '—'}
            </span>
          </div>
        </div>

        {/* Report includes */}
        <div className="rounded-xl border border-slate-200 px-4 py-3">
          <p className="text-xs font-semibold text-slate-600 mb-2.5">
            التقرير سيشمل:
          </p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            {REPORT_INCLUDES.map((item) => (
              <div
                key={item}
                className="flex items-center gap-1.5 text-sm text-slate-700"
              >
                <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <ModalError message={error} />
      </ModalBody>

      <ModalFooter>
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition disabled:opacity-50"
        >
          إلغاء
        </button>

        <button
          type="button"
          onClick={handleSend}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#25D366] hover:bg-[#1ebd5a] transition disabled:opacity-60"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MessageCircle className="h-4 w-4" />
          )}
          فتح WhatsApp
        </button>
      </ModalFooter>
    </Modal>
  )
}
