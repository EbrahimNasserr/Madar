import { AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Student } from '@/src/lib/api/studentsApi'
import { TableSkeleton, FetchingBar } from '@/components/ui/loading'
import { StudentRow } from './StudentRow'
import { EmptyState } from './EmptyState'

type Pagination = {
  total:           number
  limit:           number
  totalPages:      number
  hasPreviousPage: boolean
  hasNextPage:     boolean
}

type StudentsTableProps = {
  students:     Student[]
  pagination:   Pagination | undefined
  isLoading:    boolean
  isFetching:   boolean
  isError:      boolean
  isFiltered:   boolean
  page:         number
  onPageChange: (page: number) => void
  onAdd:        () => void
  onEdit:       (student: Student) => void
  onDelete:     (student: Student) => void
}

export function StudentsTable({
  students,
  pagination,
  isLoading,
  isFetching,
  isError,
  isFiltered,
  page,
  onPageChange,
  onAdd,
  onEdit,
  onDelete,
}: StudentsTableProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

      {/* Error banner */}
      {isError && (
        <div className="flex items-center gap-3 p-6 text-sm text-red-700 bg-red-50">
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          تعذّر تحميل الطلاب. يرجى تحديث الصفحة والمحاولة مرة أخرى.
        </div>
      )}

      {/* Loading skeleton — rendered inside a table so proportions match the data rows */}
      {isLoading && (
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm" aria-busy="true">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                <th className="px-5 py-3.5 font-semibold" scope="col">الطالب</th>
                <th className="px-5 py-3.5 font-semibold hidden sm:table-cell" scope="col">الهاتف</th>
                <th className="px-5 py-3.5 font-semibold hidden md:table-cell" scope="col">المرحلة</th>
                <th className="px-5 py-3.5 font-semibold hidden lg:table-cell" scope="col">نوع المدرسة</th>
                <th className="px-5 py-3.5 font-semibold" scope="col">الحالة</th>
              </tr>
            </thead>
            {/* 5 cols: avatar+name, phone, grade, schoolType, status */}
            <TableSkeleton rows={6} cols={5} />
          </table>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && students.length === 0 && (
        <EmptyState isFiltered={isFiltered} onAdd={onAdd} />
      )}

      {/* Data table */}
      {!isLoading && !isError && students.length > 0 && (
        <div
          className={`overflow-x-auto transition-opacity ${
            isFetching ? 'opacity-60' : ''
          }`}
        >
          <table className="w-full text-right text-sm" role="table">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                <th className="px-5 py-3.5 font-semibold" scope="col">الطالب</th>
                <th className="px-5 py-3.5 font-semibold hidden sm:table-cell" scope="col">الهاتف</th>
                <th className="px-5 py-3.5 font-semibold hidden md:table-cell" scope="col">المرحلة</th>
                <th className="px-5 py-3.5 font-semibold hidden lg:table-cell" scope="col">نوع المدرسة</th>
                <th className="px-5 py-3.5 font-semibold" scope="col">الحالة</th>
                <th className="px-5 py-3.5 font-semibold" scope="col">
                  <span className="sr-only">إجراءات</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student) => (
                <StudentRow
                  key={student._id}
                  student={student}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Background-refetch indicator */}
      <FetchingBar visible={isFetching && !isLoading} />

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 text-sm">
          <span className="text-slate-500 text-xs">
            {(page - 1) * pagination.limit + 1}–
            {Math.min(page * pagination.limit, pagination.total)} من {pagination.total}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={!pagination.hasPreviousPage || isFetching}
              aria-label="الصفحة السابقة"
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 rounded-lg bg-[#EAF0FF] text-[#3157D5] text-xs font-bold">
              {page}
            </span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={!pagination.hasNextPage || isFetching}
              aria-label="الصفحة التالية"
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
