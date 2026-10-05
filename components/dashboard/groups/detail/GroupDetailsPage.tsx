'use client'

import { use, useMemo, useState } from 'react'
import { UserPlus, CalendarPlus, CheckCircle2, ArrowLeft } from 'lucide-react'
import { useGetGroupQuery, useGetGroupStudentsQuery } from '@/src/lib/api/groupsApi'
import { useGetStudentsQuery }    from '@/src/lib/api/studentsApi'
import {
  useGetGroupSessionsQuery,
  useCreateSessionMutation,
  type CreateSessionInput,
} from '@/src/lib/api/sessionsApi'
import { getApiErrorMessage }        from '@/components/dashboard/groups/shared/constants'
import { Modal, ModalBody, ModalError } from '@/components/ui/Modal'
import { SessionForm }               from '@/components/dashboard/sessions/SessionForm'
import { MonthlyPaymentLedger }      from '@/components/dashboard/payments/MonthlyPaymentLedger'
import { GroupDetailHeader }         from './GroupDetailHeader'
import { GroupSchedule }             from './GroupSchedule'
import { GroupStudentsList }         from './GroupStudentsList'
import { GroupSessionsList }         from './GroupSessionsList'
import FeatureGuard                  from '@/components/auth/FeatureGuard'
import { FEATURES }                  from '@/src/constants/features'
import GroupQuizPerformance          from '@/components/dashboard/quizzes/GroupQuizPerformance'
import { toast }                     from 'sonner'
import ProFeatureCard                from '../../subscription/ProFeatureCard'

type Props = {
  params: Promise<{ id: string }>
}

// ── Setup checklist shown when the group is brand-new ─────────────────────────
type SetupStep = {
  id:          string
  icon:        React.ElementType
  title:       string
  description: string
  done:        boolean
  action?:     () => void
  actionLabel: string
}

function SetupChecklist({
  steps,
}: {
  steps: SetupStep[]
}) {
  const completedCount = steps.filter((s) => s.done).length
  const allDone        = completedCount === steps.length

  if (allDone) return null           // dismiss wizard once everything is done

  return (
    <section className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-indigo-900">
            🚀 أكمل إعداد مجموعتك
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            {completedCount} من {steps.length} خطوات مكتملة
          </p>
        </div>

        {/* Mini progress bar */}
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="text-xs font-semibold text-indigo-600">
            {Math.round((completedCount / steps.length) * 100)}%
          </span>
          <div className="h-2 w-24 overflow-hidden rounded-full bg-indigo-100">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-500"
              style={{ width: `${(completedCount / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Steps */}
      <ol className="mt-5 space-y-3">
        {steps.map((step, idx) => (
          <li
            key={step.id}
            className={`flex items-center gap-4 rounded-xl border p-4 transition ${
              step.done
                ? 'border-emerald-100 bg-emerald-50/60'
                : 'border-slate-200 bg-white'
            }`}
          >
            {/* Step number / check */}
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold text-sm ${
                step.done
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-indigo-100 text-indigo-700'
              }`}
            >
              {step.done ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                idx + 1
              )}
            </div>

            {/* Copy */}
            <div className="min-w-0 flex-1">
              <p className={`font-semibold text-sm ${step.done ? 'text-emerald-800 line-through decoration-emerald-300' : 'text-slate-900'}`}>
                {step.title}
              </p>
              {!step.done && (
                <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">
                  {step.description}
                </p>
              )}
            </div>

            {/* CTA */}
            {!step.done && step.action && (
              <button
                onClick={step.action}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition"
              >
                {step.actionLabel}
                <ArrowLeft className="h-3 w-3" />
              </button>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}

// ── Page component ────────────────────────────────────────────────────────────
export function GroupDetailsPage({ params }: Props) {
  const { id } = use(params)

  // ── Queries ────────────────────────────────────────────────────────────────
  const { data: groupData,    isLoading: groupLoading }    = useGetGroupQuery(id)
  const { data: studentsData, isLoading: studentsLoading } = useGetGroupStudentsQuery(id)
  const { data: sessionsData, isLoading: sessionsLoading, isError: sessionsError } =
    useGetGroupSessionsQuery(id)

  // All active students for the "add to group" picker
  const { data: allStudentsData } = useGetStudentsQuery({
    page: 1, limit: 100, status: 'active',
  })

  // ── Derived data ───────────────────────────────────────────────────────────
  const group            = groupData?.data.group
  const enrolledStudents = studentsData?.data.students ?? []
  const sessions         = sessionsData?.data.sessions ?? []

  const availableStudents = useMemo(() => {
    const enrolledIds = new Set(enrolledStudents.map((item) => item.student._id))
    return (allStudentsData?.data.students ?? []).filter((s) => !enrolledIds.has(s._id))
  }, [allStudentsData, enrolledStudents])

  // ── Create session modal ───────────────────────────────────────────────────
  const [createSessionOpen, setCreateSessionOpen] = useState(false)
  const [sessionError,      setSessionError]      = useState<string | null>(null)
  const [createSession, { isLoading: isCreatingSession }] = useCreateSessionMutation()

  const handleCreateSession = async (data: CreateSessionInput) => {
    setSessionError(null)
    try {
      await createSession(data).unwrap()
      toast.success('تم إنشاء الحصة بنجاح')
      setCreateSessionOpen(false)
    } catch (err) {
      setSessionError(getApiErrorMessage(err))
      toast.error(getApiErrorMessage(err))
    }
  }

  // ── Loading / not found ────────────────────────────────────────────────────
  if (groupLoading || !group) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-20 text-center" dir="rtl">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
        <p className="text-sm text-slate-500">جارٍ تحميل بيانات المجموعة…</p>
      </div>
    )
  }

  // ── Setup wizard steps ─────────────────────────────────────────────────────
  // Only compute when the relevant data has loaded (avoids false "not done" flickers)
  const dataReady = !studentsLoading && !sessionsLoading

  const setupSteps: SetupStep[] = [
    {
      id:          'students',
      icon:        UserPlus,
      title:       'أضف طلابًا للمجموعة',
      description: 'سجّل الطلاب حتى يظهروا في الحضور وتتبع مدفوعاتهم.',
      done:        dataReady && enrolledStudents.length > 0,
      // Scroll to the students section
      action:      () => document.getElementById('students-section')?.scrollIntoView({ behavior: 'smooth' }),
      actionLabel: 'إضافة طالب',
    },
    {
      id:          'session',
      icon:        CalendarPlus,
      title:       'أنشئ أول حصة',
      description: 'سجّل حصة لتبدأ بتسجيل الحضور ومتابعة المدفوعات.',
      done:        dataReady && sessions.length > 0,
      action:      () => setCreateSessionOpen(true),
      actionLabel: 'إنشاء حصة',
    },
  ]

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5" dir="rtl">
      {/* Hero header */}
      <GroupDetailHeader
        group={group}
        enrolledCount={enrolledStudents.length}
      />

      {/* Setup wizard — only visible while the group is incomplete */}
      {dataReady && <SetupChecklist steps={setupSteps} />}

      {/* Weekly schedule */}
      <GroupSchedule schedule={group.schedule} />

      {/* Sessions */}
      <GroupSessionsList
        groupId={id}
        sessions={sessions}
        isLoading={sessionsLoading}
        isError={sessionsError}
        onAdd={() => setCreateSessionOpen(true)}
      />

      {/* Payments */}
      {group.billingModel === 'monthly' ? (
        <MonthlyPaymentLedger groupId={id} />
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-bold text-slate-900">المدفوعات</h2>
          <p className="mt-2 text-sm text-slate-500">
            يتم احتساب رسوم هذه المجموعة لكل حصة من داخل شاشة الحضور.
          </p>
        </div>
      )}

      {/* Students */}
      <div id="students-section">
        <GroupStudentsList
          groupId={id}
          enrolledStudents={enrolledStudents}
          availableStudents={availableStudents}
          isLoading={studentsLoading}
        />
      </div>

      {/* Quiz performance analytics */}
      <FeatureGuard
        feature={FEATURES.ADVANCED_ANALYTICS}
        fallback={
          <ProFeatureCard
            title="تحليلات الاختبارات"
            description="تابع أداء المجموعة والطلاب عبر الاختبارات مع مَدار Pro."
          />
        }
      >
        <GroupQuizPerformance groupId={id} />
      </FeatureGuard>

      {/* ── Create session modal ── */}
      {createSessionOpen && (
        <Modal
          title="إنشاء حصة جديدة"
          onClose={() => setCreateSessionOpen(false)}
          size="md"
        >
          <ModalBody>
            <ModalError message={sessionError} />
            <SessionForm
              group={group}
              isSubmitting={isCreatingSession}
              onSubmit={handleCreateSession}
              onCancel={() => setCreateSessionOpen(false)}
            />
          </ModalBody>
        </Modal>
      )}
    </div>
  )
}
