'use client'

import { Users, UserPlus } from 'lucide-react'
import type { Student } from '@/src/lib/api/studentsApi'
import { AddStudentPicker } from './AddStudentPicker'
import { GroupStudentRow }  from './GroupStudentRow'

type EnrolledItem = {
  enrollmentId?: string
  student: Student
}

type GroupStudentsListProps = {
  groupId:           string
  enrolledStudents:  EnrolledItem[]
  availableStudents: Student[]
  isLoading:         boolean
}

// ── Skeleton rows while loading ───────────────────────────────────────────────
function StudentSkeletons() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between gap-4 px-6 py-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-slate-100" />
            <div className="space-y-1.5">
              <div className="h-3.5 w-28 rounded bg-slate-100" />
              <div className="h-3 w-20 rounded bg-slate-100" />
            </div>
          </div>
          <div className="h-7 w-16 rounded-lg bg-slate-100" />
        </div>
      ))}
    </>
  )
}

// ── Guided empty state ────────────────────────────────────────────────────────
function EmptyStudentsState() {
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-10 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
        <UserPlus className="h-7 w-7 text-slate-400" />
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold text-slate-700">لا يوجد طلاب حتى الآن</h3>
        <p className="text-sm text-slate-400">استخدم البحث أعلاه لإضافة أول طالب إلى المجموعة.</p>
      </div>
    </div>
  )
}

export function GroupStudentsList({
  groupId,
  enrolledStudents,
  availableStudents,
  isLoading,
}: GroupStudentsListProps) {
  const count = enrolledStudents.length

  return (
    <section className="rounded-2xl border border-slate-200 bg-white">
      {/* ── Section header ── */}
      <div className="border-b border-slate-100 px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
              <Users className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">الطلاب</h2>
              {count > 0 && (
                <p className="text-xs text-slate-400">{count} طالب مسجّل</p>
              )}
            </div>
          </div>

          {count > 0 && (
            <span className="flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-indigo-600 px-2 text-xs font-bold text-white">
              {count}
            </span>
          )}
        </div>

        {/* Add student picker — always visible so teacher knows it exists */}
        <div className="mt-4">
          <AddStudentPicker
            groupId={groupId}
            availableStudents={availableStudents}
          />
        </div>
      </div>

      {/* ── Student rows ── */}
      <div className="divide-y divide-slate-100">
        {isLoading ? (
          <StudentSkeletons />
        ) : count === 0 ? (
          <EmptyStudentsState />
        ) : (
          enrolledStudents.map(({ student }) => (
            <GroupStudentRow
              key={student._id}
              student={student}
              groupId={groupId}
            />
          ))
        )}
      </div>
    </section>
  )
}
