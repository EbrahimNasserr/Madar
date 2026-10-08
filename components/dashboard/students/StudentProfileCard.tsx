'use client'

import { useState } from 'react'
import { Phone, GraduationCap, School, MessageSquare, MessageCircle } from 'lucide-react'
import type { Student } from '@/src/lib/api/studentsApi'
import { Avatar }      from './shared/Avatar'
import { StatusBadge } from './shared/StatusBadge'
import { SCHOOL_TYPE_LABELS } from './shared/constants'
import { SendParentReportModal } from './SendParentReportModal'

// ─── Single info row ──────────────────────────────────────────────────────────

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon:  React.ElementType
  label: string
  value: string | undefined
}) {
  if (!value) return null
  return (
    <div className="flex items-center gap-3 border-b border-slate-100 py-3 last:border-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100">
        <Icon className="h-4 w-4 text-slate-500" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="font-medium text-slate-900">{value}</p>
      </div>
    </div>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────

type Props = { student: Student }

export function StudentProfileCard({ student }: Props) {
  const fullName = `${student.firstName} ${student.lastName}`
  const [showReportModal, setShowReportModal] = useState(false)

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
      {/* Gradient band */}
      <div className="bg-gradient-to-l from-indigo-600 to-indigo-500 px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Large avatar */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold text-white backdrop-blur-sm">
              {student.firstName.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                {fullName}
              </h1>
              {student.parentName && (
                <p className="mt-0.5 text-sm text-indigo-200">
                  ولي الأمر: {student.parentName}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={student.status} />
            <button
              type="button"
              onClick={() => setShowReportModal(true)}
              disabled={!student.parentPhone}
              title={
                student.parentPhone
                  ? 'إرسال تقرير لولي الأمر عبر WhatsApp'
                  : 'لا يوجد رقم ولي الأمر'
              }
              className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/25 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      {/* Info rows */}
      <div className="px-6 pt-2 pb-4">
        <InfoRow icon={Phone}         label="هاتف الطالب"    value={student.phone} />
        <InfoRow icon={Phone}         label="هاتف ولي الأمر" value={student.parentPhone} />
        <InfoRow icon={GraduationCap} label="المرحلة الدراسية" value={student.grade} />
        <InfoRow
          icon={School}
          label="نوع المدرسة"
          value={student.schoolType ? SCHOOL_TYPE_LABELS[student.schoolType] : undefined}
        />
      </div>

      {/* Notes */}
      {student.notes && (
        <div className="mx-6 mb-5 flex gap-3 rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
          <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <div>
            <p className="text-xs font-medium text-amber-700">ملاحظات</p>
            <p className="mt-0.5 text-sm text-amber-900 leading-relaxed">{student.notes}</p>
          </div>
        </div>
      )}

      {/* WhatsApp report modal */}
      {showReportModal && (
        <SendParentReportModal student={student} onClose={() => setShowReportModal(false)} />
      )}
    </section>
  )
}
