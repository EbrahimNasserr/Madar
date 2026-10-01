'use client'

import { FormEvent, useState } from 'react'
import { Trash2 } from 'lucide-react'
import type { CreateGroupInput, Group } from '@/src/lib/api/groupsApi'
import { Input }    from '@/components/ui/input'
import { Select }   from '@/components/ui/select'
import { WEEK_DAYS } from '@/src/constants/weekDays'

type GroupFormProps = {
  group?:        Group
  isSubmitting?: boolean
  onSubmit:      (data: CreateGroupInput) => Promise<void>
  onCancel?:     () => void
}

const DEFAULT_SLOT = { dayOfWeek: 0, startTime: '17:00', endTime: '18:30' }

export function GroupForm({ group, isSubmitting, onSubmit, onCancel }: GroupFormProps) {
  const [form, setForm] = useState<CreateGroupInput>({
    name:             group?.name             ?? '',
    subject:          group?.subject          ?? '',
    grade:            group?.grade            ?? '',
    schoolType:       group?.schoolType       ?? 'government',
    billingModel:     group?.billingModel     ?? 'per_session',
    pricePerSession:  group?.pricePerSession  ?? undefined,
    monthlyPrice:     group?.monthlyPrice     ?? undefined,
    sessionsPerMonth: group?.sessionsPerMonth ?? undefined,
    schedule:         group?.schedule?.length ? group.schedule : [DEFAULT_SLOT],
  })

  // ── Field helpers ──────────────────────────────────────────────────────────

  const set = <K extends keyof CreateGroupInput>(key: K, value: CreateGroupInput[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const updateSlot = (
    index: number,
    key: 'dayOfWeek' | 'startTime' | 'endTime',
    value: string | number,
  ) =>
    setForm((prev) => ({
      ...prev,
      schedule: prev.schedule.map((slot, i) =>
        i === index ? { ...slot, [key]: value } : slot,
      ),
    }))

  const addSlot = () =>
    setForm((prev) => ({ ...prev, schedule: [...prev.schedule, { ...DEFAULT_SLOT }] }))

  const removeSlot = (index: number) =>
    setForm((prev) => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index),
    }))

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const payload: CreateGroupInput = { ...form }

    if (payload.billingModel === 'per_session') {
      delete payload.monthlyPrice
      delete payload.sessionsPerMonth
    } else {
      delete payload.pricePerSession
    }

    await onSubmit(payload)
  }

  // ── UI ─────────────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Basic info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="اسم المجموعة"
          required
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="رياضيات ثانوي أ"
        />
        <Input
          label="المادة"
          required
          value={form.subject}
          onChange={(e) => set('subject', e.target.value)}
          placeholder="رياضيات"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="المرحلة الدراسية"
          value={form.grade ?? ''}
          onChange={(e) => set('grade', e.target.value)}
          placeholder="الثالث الثانوي"
        />
        <Select
          label="نوع المدرسة"
          value={form.schoolType ?? ''}
          onChange={(e) =>
            set('schoolType', e.target.value as CreateGroupInput['schoolType'])
          }
        >
          <option value="government">حكومي</option>
          <option value="experimental">تجريبي</option>
          <option value="private">خاص</option>
          <option value="other">أخرى</option>
        </Select>
      </div>

      {/* Billing */}
      <div className="space-y-4 rounded-2xl border border-slate-200 p-5">
        <div>
          <h3 className="font-semibold text-slate-900">نظام الدفع</h3>
          <p className="mt-1 text-sm text-slate-500">حدد طريقة حساب رسوم المجموعة.</p>
        </div>

        <Select
          label="نظام الحساب"
          value={form.billingModel}
          onChange={(e) =>
            set('billingModel', e.target.value as CreateGroupInput['billingModel'])
          }
        >
          <option value="per_session">لكل حصة</option>
          <option value="monthly">شهري</option>
        </Select>

        {form.billingModel === 'per_session' ? (
          <Input
            label="سعر الحصة (جنيه)"
            type="number"
            min="0"
            required
            value={form.pricePerSession ?? ''}
            onChange={(e) => set('pricePerSession', Number(e.target.value))}
            placeholder="100"
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="السعر الشهري (جنيه)"
              type="number"
              min="0"
              required
              value={form.monthlyPrice ?? ''}
              onChange={(e) => set('monthlyPrice', Number(e.target.value))}
              placeholder="400"
            />
            <Input
              label="عدد الحصص شهريًا"
              type="number"
              min="1"
              required
              value={form.sessionsPerMonth ?? ''}
              onChange={(e) => set('sessionsPerMonth', Number(e.target.value))}
              placeholder="8"
            />
          </div>
        )}
      </div>

      {/* Schedule */}
      <div className="space-y-4 rounded-2xl border border-slate-200 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-slate-900">مواعيد المجموعة</h3>
            <p className="mt-1 text-sm text-slate-500">المواعيد المتكررة أسبوعيًا.</p>
          </div>

          <button
            type="button"
            onClick={addSlot}
            className="rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition"
          >
            + إضافة موعد
          </button>
        </div>

        <div className="space-y-3">
          {form.schedule.map((slot, index) => (
            <div
              key={index}
              className="grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-[1fr_1fr_1fr_auto]"
            >
              <Select
                label="اليوم"
                value={slot.dayOfWeek}
                onChange={(e) => updateSlot(index, 'dayOfWeek', Number(e.target.value))}
              >
                {WEEK_DAYS.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </Select>

              <Input
                label="من"
                type="time"
                value={slot.startTime}
                onChange={(e) => updateSlot(index, 'startTime', e.target.value)}
              />

              <Input
                label="إلى"
                type="time"
                value={slot.endTime}
                onChange={(e) => updateSlot(index, 'endTime', e.target.value)}
              />

              <div className="flex items-end">
                <button
                  type="button"
                  disabled={form.schedule.length === 1}
                  onClick={() => removeSlot(index)}
                  aria-label="حذف الموعد"
                  className="flex h-[46px] w-[46px] items-center justify-center rounded-xl text-red-500 hover:bg-red-50 disabled:opacity-30 transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            إلغاء
          </button>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-[#3157D5] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#243FA3] disabled:opacity-50 transition"
        >
          {isSubmitting ? 'جارٍ الحفظ...' : group ? 'حفظ التعديلات' : 'إنشاء المجموعة'}
        </button>
      </div>
    </form>
  )
}
