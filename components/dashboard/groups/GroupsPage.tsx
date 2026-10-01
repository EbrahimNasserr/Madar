'use client'

import { useState } from 'react'
import { useGetGroupsQuery } from '@/src/lib/api/groupsApi'
import type { Group } from '@/src/lib/api/groupsApi'
import { GroupsHeader }    from './GroupsHeader'
import { GroupsGrid }      from './GroupsGrid'
import { GroupModal }      from './GroupModal'
import { DeactivateModal } from './DeactivateModal'

export function GroupsPage() {
  const { data, isLoading, isError, refetch } = useGetGroupsQuery()

  const groups = data?.data.groups ?? []

  // ── Modal state ──────────────────────────────────────────────────────────
  const [createOpen,      setCreateOpen]      = useState(false)
  const [editTarget,      setEditTarget]      = useState<Group | null>(null)
  const [deactivateTarget, setDeactivateTarget] = useState<Group | null>(null)

  return (
    <section className="space-y-6  animate-[appear_0.28s_ease-out]" dir="rtl">
      <GroupsHeader
        total={isLoading ? undefined : groups.length}
        onAdd={() => setCreateOpen(true)}
      />

      <GroupsGrid
        groups={groups}
        isLoading={isLoading}
        isError={isError}
        onAdd={() => setCreateOpen(true)}
        onEdit={setEditTarget}
        onDeactivate={setDeactivateTarget}
        onRetry={refetch}
      />

      {/* ── Modals ── */}
      {createOpen && (
        <GroupModal onClose={() => setCreateOpen(false)} />
      )}

      {editTarget && (
        <GroupModal
          group={editTarget}
          onClose={() => setEditTarget(null)}
        />
      )}

      {deactivateTarget && (
        <DeactivateModal
          group={deactivateTarget}
          onClose={() => setDeactivateTarget(null)}
        />
      )}
    </section>
  )
}
