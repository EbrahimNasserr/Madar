'use client'

import { useState, useRef, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import {
  useCreateStudentMutation,
  useUpdateStudentMutation,
  type Student,
  type StudentFormData,
} from '@/src/lib/api/studentsApi'
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalError,
} from '@/components/ui/Modal'
import { Input }   from '@/components/ui/input'
import { Select }  from '@/components/ui/select'
import { Spinner } from '@/components/ui/loading'
import { SCHOOL_TYPE_LABELS, getApiErrorMessage } from './shared/constants'

type StudentModalProps = {
  student?: Student
  onClose: () => void
}

export function StudentModal({ student, onClose }: StudentModalProps) {
  const isEdit = Boolean(student)

  const [createStudent, { isLoading: isCreating }] = useCreateStudentMutation()
  const [updateStudent, { isLoading: isUpdating }] = useUpdateStudentMutation()
  const isPending = isCreating || isUpdating

  const [formError, setFormError] = useState<string | null>(null)
  const [form, setForm] = useState<StudentFormData>({
    firstName:   student?.firstName   ?? '',
    lastName:    student?.lastName    ?? '',
    phone:       student?.phone       ?? '',
    parentName:  student?.parentName  ?? '',
    parentPhone: student?.parentPhone ?? '',
    grade:       student?.grade       ?? '',
    schoolType:  student?.schoolType  ?? undefined,
    notes:       student?.notes       ?? '',
  })

  const set = (field: keyof StudentFormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    const payload: StudentFormData = {
      firstName:   form.firstName.trim(),
      lastName:    form.lastName.trim(),
      ...(form.phone       && { phone:       form.phone.trim() }),
      ...(form.parentName  && { parentName:  form.parentName.trim() }),
      ...(form.parentPhone && { parentPhone: form.parentPhone.trim() }),
      ...(form.grade       && { grade:       form.grade.trim() }),
      ...(form.schoolType  && { schoolType:  form.schoolType }),
      ...(form.notes       && { notes:       form.notes.trim() }),
    }

    try {
      if (isEdit && student) {
        await updateStudent({ id: student._id, body: payload }).unwrap()
      } else {
        await createStudent(payload).unwrap()
      }
      onClose()
    } catch (err) {
      setFormError(getApiErrorMessage(err))
    }
  }

  // Auto-focus first field on open
  const formRef = useRef<HTMLFormElement>(null)
  useEffect(() => {
    formRef.current?.querySelector<HTMLElement>('input,select,textarea')?.focus()
  }, [])

  return (
    <Modal
      title={isEdit ? 'تعديل بيانات الطالب' : 'إضافة طالب جديد'}
      onClose={onClose}
      size="md"
    >
      <form ref={formRef} onSubmit={handleSubmit} noValidate>
        <ModalBody>
          {/* Row: first / last name */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="الاسم الأول"
              required
              value={form.firstName}
              onChange={(e) => set('firstName', e.target.value)}
              placeholder="أحمد"
            />
            <Input
              label="اسم العائلة"
              required
              value={form.lastName}
              onChange={(e) => set('lastName', e.target.value)}
              placeholder="محمد"
            />
          </div>

          {/* Phone */}
          <Input
            label="رقم الهاتف"
            type="tel"
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            placeholder="01xxxxxxxxx"
          />

          {/* Row: parent name / parent phone */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="اسم ولي الأمر"
              value={form.parentName}
              onChange={(e) => set('parentName', e.target.value)}
              placeholder="والد أحمد"
            />
            <Input
              label="هاتف ولي الأمر"
              type="tel"
              value={form.parentPhone}
              onChange={(e) => set('parentPhone', e.target.value)}
              placeholder="01xxxxxxxxx"
            />
          </div>

          {/* Row: grade / school type */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="المرحلة الدراسية"
              value={form.grade}
              onChange={(e) => set('grade', e.target.value)}
              placeholder="الثالث الثانوي"
            />
            <Select
              label="نوع المدرسة"
              value={form.schoolType ?? ''}
              onChange={(e) =>
                set('schoolType', e.target.value as NonNullable<Student['schoolType']>)
              }
            >
              <option value="">اختر...</option>
              {Object.entries(SCHOOL_TYPE_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </Select>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600">ملاحظات</label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              placeholder="أي ملاحظات على الطالب..."
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#3157D5] focus:ring-4 focus:ring-[#3157D5]/10 transition resize-none"
            />
          </div>

          {/* API error */}
          <ModalError message={formError} />
        </ModalBody>

        <ModalFooter>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition disabled:opacity-50"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#3157D5] hover:bg-[#243FA3] transition shadow-sm disabled:opacity-60"
          >
            {isPending && <Spinner />}
            {isEdit ? 'حفظ التعديلات' : 'إضافة الطالب'}
          </button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
