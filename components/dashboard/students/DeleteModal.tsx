'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useDeleteStudentMutation, type Student } from '@/src/lib/api/studentsApi'
import { Modal, ModalError } from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/loading'
import { getApiErrorMessage } from './shared/constants'
import { toast } from 'sonner'

type DeleteModalProps = {
  student: Student
  onClose: () => void
}

export function DeleteModal({ student, onClose }: DeleteModalProps) {
  const [deleteStudent, { isLoading }] = useDeleteStudentMutation()
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    setError(null)
    try {
      await deleteStudent(student._id).unwrap()
      toast
        .success('تم حذف الطالب بنجاح')
      onClose()
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  return (
    <Modal
      title="تأكيد حذف الطالب"
      showTitle={false}
      onClose={onClose}
      size="sm"
      mobileSnap={false}
    >
      {/* Icon + message */}
      <div className="flex flex-col items-center px-8 pt-8 pb-5 text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <Trash2 className="w-6 h-6 text-red-500" aria-hidden="true" />
        </div>
        <h2 className="text-base font-bold text-slate-900">حذف الطالب</h2>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
          هل أنت متأكد من حذف{' '}
          <span className="font-semibold text-slate-900">
            {student.firstName} {student.lastName}
          </span>
          ؟ هذا الإجراء لا يمكن التراجع عنه.
        </p>

        <ModalError message={error} className="mt-3 w-full text-xs" />
      </div>

      {/* Actions */}
      <div className="flex gap-3 px-6 pb-6">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition disabled:opacity-50"
        >
          إلغاء
        </button>
        <button
          onClick={handleDelete}
          disabled={isLoading}
          className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition disabled:opacity-60"
        >
          {isLoading && <Spinner />}
          حذف
        </button>
      </div>
    </Modal>
  )
}
