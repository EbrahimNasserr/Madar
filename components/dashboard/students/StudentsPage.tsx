'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useGetStudentsQuery, type Student } from '@/src/lib/api/studentsApi'
import { useDebounce } from '@/src/lib/hooks/useDebounce'
import { StudentsToolbar } from './StudentsToolbar'
import { StudentsTable }   from './StudentsTable'
import { StudentModal }    from './StudentModal'
import { DeleteModal }     from './DeleteModal'
import PageHeader from '@/components/ui/PageHeader'

export function StudentsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'' | 'active' | 'inactive'>('')

  const debouncedSearch = useDebounce(search, 400)

  // Reset to page 1 when filters change by treating the filter combo as the page key
  const [page, setPage] = useState(1)

  const [addOpen,      setAddOpen]      = useState(false)
  const [editTarget,   setEditTarget]   = useState<Student | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null)

  const handleSearch = (value: string) => { setSearch(value); setPage(1) }
  const handleStatus = (value: '' | 'active' | 'inactive') => { setStatus(value); setPage(1) }

  const { data, isLoading, isFetching, isError } = useGetStudentsQuery({
    page,
    limit: 20,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(status          && { status }),
  })

  const students   = data?.data.students   ?? []
  const pagination = data?.data.pagination

  return (
    <section className="space-y-6 animate-[appear_0.28s_ease-out]" dir="rtl">
      <PageHeader
        eyebrow="إدارة الطلاب"
        title={pagination?.total !== undefined ? `الطلاب (${pagination.total})` : 'الطلاب'}
        description="إدارة طلابك ومتابعة بياناتهم من مكان واحد."
        actions={
          <button
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3157D5] text-white text-sm font-semibold hover:bg-[#243FA3] transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            إضافة طالب
          </button>
        }
      />

      <StudentsToolbar
        search={search}
        status={status}
        onSearch={handleSearch}
        onStatus={handleStatus}
      />

      <StudentsTable
        students={students}
        pagination={pagination}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        isFiltered={Boolean(debouncedSearch || status)}
        page={page}
        onPageChange={setPage}
        onAdd={() => setAddOpen(true)}
        onEdit={setEditTarget}
        onDelete={setDeleteTarget}
      />

      {addOpen      && <StudentModal onClose={() => setAddOpen(false)} />}
      {editTarget   && <StudentModal student={editTarget} onClose={() => setEditTarget(null)} />}
      {deleteTarget && <DeleteModal  student={deleteTarget} onClose={() => setDeleteTarget(null)} />}
    </section>
  )
}
