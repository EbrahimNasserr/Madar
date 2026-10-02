'use client'

import { use } from 'react'
import Link from 'next/link'
import { ArrowRight, Phone, GraduationCap, School } from 'lucide-react'
import { useGetStudentQuery } from '@/src/lib/api/studentsApi'
import { StudentFinancialHistory } from './StudentFinancialHistory'
import { StatusBadge } from './shared/StatusBadge'
import { Avatar } from './shared/Avatar'
import { SCHOOL_TYPE_LABELS } from './shared/constants'
import FeatureGuard from '@/components/auth/FeatureGuard'
import { FEATURES } from '@/src/constants/features'
import StudentQuizPerformance from '@/components/dashboard/quizzes/StudentQuizPerformance'

type Props = {
  params: Promise<{ id: string }>
}

function InfoRow({ icon: Icon, label, value }: {
  icon:  React.ElementType
  label: string
  value: string | undefined
}) {
  if (!value) return null
  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0">
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

export function StudentDetailPage({ params }: Props) {
  const { id } = use(params)
  const { data, isLoading } = useGetStudentQuery(id)
  const student = data?.data.student

  if (isLoading || !student) {
    return (
      <div className="flex items-center justify-center p-16 text-sm text-slate-400">
        جارٍ تحميل بيانات الطالب...
      </div>
    )
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Back */}
      <Link
        href="/students"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition"
      >
        <ArrowRight className="h-4 w-4 rotate-180" />
        العودة للطلاب
      </Link>

      {/* Profile card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          {/* Avatar + name */}
          <div className="flex items-center gap-4">
            <Avatar name={student.firstName} size="lg" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {student.firstName} {student.lastName}
              </h1>
              {student.parentName && (
                <p className="mt-1 text-sm text-slate-500">ولي الأمر: {student.parentName}</p>
              )}
            </div>
          </div>
          <StatusBadge status={student.status} />
        </div>

        {/* Info rows */}
        <div className="mt-5">
          <InfoRow icon={Phone}        label="هاتف الطالب"  value={student.phone} />
          <InfoRow icon={Phone}        label="هاتف ولي الأمر" value={student.parentPhone} />
          <InfoRow icon={GraduationCap} label="المرحلة"      value={student.grade} />
          <InfoRow
            icon={School}
            label="نوع المدرسة"
            value={student.schoolType ? SCHOOL_TYPE_LABELS[student.schoolType] : undefined}
          />
        </div>

        {student.notes && (
          <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">
            <p className="text-xs text-slate-400">ملاحظات</p>
            <p className="mt-1 text-sm text-slate-700">{student.notes}</p>
          </div>
        )}
      </div>

      {/* Financial history */}
      <div className="space-y-3">
        <h2 className="font-bold text-slate-900">السجل المالي</h2>
        <StudentFinancialHistory studentId={id} />
      </div>

      {/* Quiz performance — Pro only */}
      <FeatureGuard feature={FEATURES.QUIZZES}>
        <StudentQuizPerformance studentId={id} />
      </FeatureGuard>
    </div>
  )
}
