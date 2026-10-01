import { Users } from 'lucide-react'
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

export function GroupStudentsList({
  groupId,
  enrolledStudents,
  availableStudents,
  isLoading,
}: GroupStudentsListProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white">
      {/* ── Section header + picker ── */}
      <div className="border-b border-slate-100 p-6">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-indigo-500" />
          <div>
            <h2 className="text-lg font-bold text-slate-900">الطلاب</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              {enrolledStudents.length} طالب في المجموعة
            </p>
          </div>
        </div>

        <div className="mt-5">
          <AddStudentPicker
            groupId={groupId}
            availableStudents={availableStudents}
          />
        </div>
      </div>

      {/* ── Rows ── */}
      <div className="divide-y divide-slate-100">
        {isLoading ? (
          <div className="p-6 text-sm text-slate-500">جارٍ تحميل الطلاب...</div>
        ) : enrolledStudents.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-medium text-slate-900">لا يوجد طلاب في المجموعة</p>
            <p className="mt-1 text-sm text-slate-500">أضف أول طالب من الأعلى.</p>
          </div>
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
