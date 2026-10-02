import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useGetGroupsQuery } from '@/src/lib/api/groupsApi'
import type { Group } from '@/src/lib/api/groupsApi'
import { GroupsGrid }      from './GroupsGrid'
import { GroupModal }      from './GroupModal'
import { DeactivateModal } from './DeactivateModal'
import PageHeader from '@/components/ui/PageHeader'

export function GroupsPage() {
  const { data, isLoading, isError, refetch } = useGetGroupsQuery()

  const groups = data?.data.groups ?? []

  // ── Modal state ──────────────────────────────────────────────────────────
  const [createOpen,      setCreateOpen]      = useState(false)
  const [editTarget,      setEditTarget]      = useState<Group | null>(null)
  const [deactivateTarget, setDeactivateTarget] = useState<Group | null>(null)

  return (
    <section className="space-y-6  animate-[appear_0.28s_ease-out]" dir="rtl">
      <PageHeader
        eyebrow="إدارة المجموعات"
        title={!isLoading ? `المجموعات (${groups.length})` : 'المجموعات'}
        description="نظم مجموعاتك ومواعيد الحصص والطلاب من مكان واحد."
        actions={
          <button
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3157D5] text-white text-sm font-semibold hover:bg-[#243FA3] transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            إنشاء مجموعة
          </button>
        }
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
