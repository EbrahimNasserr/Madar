'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import type { Student } from '@/src/lib/api/studentsApi'
import { useRemoveStudentFromGroupMutation } from '@/src/lib/api/groupsApi'
import { getApiErrorMessage } from '../shared/constants'
import { toast } from 'sonner'

type GroupStudentRowProps = {
  student: Student
  groupId: string
}

export function GroupStudentRow({ student, groupId }: GroupStudentRowProps) {
  const [removeStudent, { isLoading }] = useRemoveStudentFromGroupMutation()
  const [error, setError] = useState<string | null>(null)

  const handleRemove = async () => {
    setError(null)
    try {
      await removeStudent({ groupId, studentId: student._id }).unwrap()
      toast.success('تمت الإزالة بنجاح')
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4">
      <div className="min-w-0">
        <p className="truncate font-medium text-slate-900">
          {student.firstName} {student.lastName}
        </p>
        <p className="mt-0.5 text-xs text-slate-500">
          {student.phone || 'لا يوجد رقم هاتف'}
        </p>
        {error && (
          <p className="mt-1 text-xs text-red-600">{error}</p>
        )}
      </div>

      <button
        onClick={handleRemove}
        disabled={isLoading}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 transition"
      >
        {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        إزالة
      </button>
    </div>
  )
}
