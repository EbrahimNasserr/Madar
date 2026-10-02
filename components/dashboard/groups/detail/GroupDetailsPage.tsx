'use client'

import { use, useMemo, useState } from 'react'
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

type Props = {
  params: Promise<{ id: string }>
}

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
      setCreateSessionOpen(false)
    } catch (err) {
      setSessionError(getApiErrorMessage(err))
    }
  }

  // ── Loading / not found ────────────────────────────────────────────────────
  if (groupLoading || !group) {
    return (
      <div className="flex items-center justify-center p-16 text-sm text-slate-500">
        جارٍ تحميل المجموعة...
      </div>
    )
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6" dir="rtl">
      <GroupDetailHeader
        group={group}
        enrolledCount={enrolledStudents.length}
      />

      <GroupSchedule schedule={group.schedule} />

      <GroupSessionsList
        groupId={id}
        sessions={sessions}
        isLoading={sessionsLoading}
        isError={sessionsError}
        onAdd={() => setCreateSessionOpen(true)}
      />

      {/* Payments — conditional on billing model */}
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

      <GroupStudentsList
        groupId={id}
        enrolledStudents={enrolledStudents}
        availableStudents={availableStudents}
        isLoading={studentsLoading}
      />

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
