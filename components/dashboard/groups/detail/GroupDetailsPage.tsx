'use client'

import { use, useMemo } from 'react'
import { useGetGroupQuery, useGetGroupStudentsQuery } from '@/src/lib/api/groupsApi'
import { useGetStudentsQuery } from '@/src/lib/api/studentsApi'
import { GroupDetailHeader } from './GroupDetailHeader'
import { GroupSchedule }     from './GroupSchedule'
import { GroupStudentsList } from './GroupStudentsList'

type Props = {
  params: Promise<{ id: string }>
}

export function GroupDetailsPage({ params }: Props) {
  const { id } = use(params)

  // ── Queries ────────────────────────────────────────────────────────────────
  const { data: groupData,    isLoading: groupLoading }    = useGetGroupQuery(id)
  const { data: studentsData, isLoading: studentsLoading } = useGetGroupStudentsQuery(id)

  // Fetch all active students so we can offer ones not yet in the group
  const { data: allStudentsData } = useGetStudentsQuery({
    page: 1, limit: 100, status: 'active',
  })

  const group           = groupData?.data.group
  const enrolledStudents = studentsData?.data.students ?? []

  // Remove already-enrolled students from the picker
  const availableStudents = useMemo(() => {
    const enrolledIds = new Set(enrolledStudents.map((item) => item.student._id))
    return (allStudentsData?.data.students ?? []).filter((s) => !enrolledIds.has(s._id))
  }, [allStudentsData, enrolledStudents])

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
    <div className="space-y-6 p-6 lg:p-8" dir="rtl">
      <GroupDetailHeader
        group={group}
        enrolledCount={enrolledStudents.length}
      />

      <GroupSchedule schedule={group.schedule} />

      <GroupStudentsList
        groupId={id}
        enrolledStudents={enrolledStudents}
        availableStudents={availableStudents}
        isLoading={studentsLoading}
      />
    </div>
  )
}
