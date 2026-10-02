'use client'

import { useState } from 'react'
import { useGetStudentsQuery, type Student } from '@/src/lib/api/studentsApi'
import { useDebounce } from '@/src/lib/hooks/useDebounce'
import { StudentsHeader }  from './StudentsHeader'
import { StudentsToolbar } from './StudentsToolbar'
import { StudentsTable }   from './StudentsTable'
import { StudentModal }    from './StudentModal'
import { DeleteModal }     from './DeleteModal'

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
      <StudentsHeader
        total={pagination?.total}
        onAdd={() => setAddOpen(true)}
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
