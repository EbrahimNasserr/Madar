'use client'

import { use }  from 'react'
import Link     from 'next/link'
import { ArrowRight } from 'lucide-react'

import { useGetStudentQuery } from '@/src/lib/api/studentsApi'
import FeatureGuard           from '@/components/auth/FeatureGuard'
import { FEATURES }           from '@/src/constants/features'
import StudentQuizPerformance from '@/components/dashboard/quizzes/StudentQuizPerformance'
import PageSkeleton           from '@/components/ui/PageSkeleton'

import { StudentProfileCard }     from './StudentProfileCard'
import { StudentFinancialHistory } from './StudentFinancialHistory'

type Props = {
  params: Promise<{ id: string }>
}

export function StudentDetailPage({ params }: Props) {
  const { id } = use(params)
  const { data, isLoading } = useGetStudentQuery(id)
  const student = data?.data.student

  if (isLoading || !student) {
    return <PageSkeleton cards={2} />
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Back link */}
      <Link
        href="/students"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition"
      >
        <ArrowRight className="h-4 w-4 rotate-180" />
        العودة للطلاب
      </Link>

      {/* Profile hero */}
      <StudentProfileCard student={student} />

      {/* Financial history */}
      <StudentFinancialHistory studentId={id} />

      {/* Quiz performance — Pro only */}
      <FeatureGuard feature={FEATURES.QUIZZES}>
        <StudentQuizPerformance studentId={id} />
      </FeatureGuard>
    </div>
  )
}
