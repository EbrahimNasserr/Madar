import Link from 'next/link'
import { Pencil, Trash2 } from 'lucide-react'
import type { Student } from '@/src/lib/api/studentsApi'
import { Avatar } from './shared/Avatar'
import { StatusBadge } from './shared/StatusBadge'
import { SCHOOL_TYPE_LABELS } from './shared/constants'

type StudentRowProps = {
  student: Student
  onEdit:   (student: Student) => void
  onDelete: (student: Student) => void
}

export function StudentRow({ student, onEdit, onDelete }: StudentRowProps) {
  return (
    <tr className="hover:bg-slate-50/60 transition-colors group">
      {/* Name + avatar */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar name={student.firstName} />
          <div className="min-w-0">
            <Link
              href={`/students/${student._id}`}
              className="font-semibold text-slate-900 hover:text-[#3157D5] transition truncate block"
            >
              {student.firstName} {student.lastName}
            </Link>
            {student.parentName && (
              <p className="text-xs text-slate-400 truncate">
                ولي الأمر: {student.parentName}
              </p>
            )}
          </div>
        </div>
      </td>

      {/* Phone */}
      <td className="px-5 py-4 text-slate-500 hidden sm:table-cell">
        {student.phone ?? '—'}
      </td>

      {/* Grade */}
      <td className="px-5 py-4 text-slate-600 hidden md:table-cell">
        {student.grade ?? '—'}
      </td>

      {/* School type */}
      <td className="px-5 py-4 text-slate-600 hidden lg:table-cell">
        {student.schoolType ? SCHOOL_TYPE_LABELS[student.schoolType] : '—'}
      </td>

      {/* Status */}
      <td className="px-5 py-4">
        <StatusBadge status={student.status} />
      </td>

      {/* Actions */}
      <td className="px-5 py-4">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(student)}
            aria-label={`تعديل ${student.firstName}`}
            className="p-2 rounded-lg text-slate-400 hover:text-[#3157D5] hover:bg-[#EAF0FF] transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(student)}
            aria-label={`حذف ${student.firstName}`}
            className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  )
}
