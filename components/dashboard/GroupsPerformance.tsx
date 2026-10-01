import Link from 'next/link'
import type { GroupPerformanceItem } from '@/src/lib/api/dashboardApi'

type GroupsPerformanceProps = {
  groups:   GroupPerformanceItem[] | null | undefined
  loading?: boolean
}

function PercentBar({ value, color }: { value: number | null | undefined; color: string }) {
  const safeValue = value ?? 0
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 rounded-full bg-slate-100">
        <div
          className={`h-1.5 rounded-full ${color}`}
          style={{ width: `${Math.min(100, safeValue)}%` }}
        />
      </div>
      <span className="w-8 text-right text-xs font-semibold tabular-nums text-slate-700">
        {safeValue.toFixed(0)}%
      </span>
    </div>
  )
}

export function GroupsPerformance({ groups: groupsProp, loading }: GroupsPerformanceProps) {
  const groups = Array.isArray(groupsProp) ? groupsProp : []
  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="font-bold text-slate-900">أداء المجموعات</h2>
        <p className="mt-0.5 text-xs text-slate-400">الحضور والتحصيل لكل مجموعة</p>
      </div>

      {loading ? (
        <div className="space-y-3 p-5">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-14 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <div className="p-8 text-center text-sm text-slate-400">
          لا توجد مجموعات لعرضها.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs font-medium text-slate-500">
                <th className="px-5 py-3">المجموعة</th>
                <th className="px-5 py-3">الطلاب</th>
                <th className="px-5 py-3 min-w-[120px]">الحضور</th>
                <th className="px-5 py-3 min-w-[120px]">التحصيل</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {groups.map((group, i) => (
                <tr key={group.groupId ?? i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-semibold text-slate-900">{group.groupName}</p>
                    {group.subject && (
                      <p className="text-xs text-slate-400">{group.subject}</p>
                    )}
                  </td>
                  <td className="px-5 py-3 tabular-nums text-slate-600">
                    {group.studentsCount}
                  </td>
                  <td className="px-5 py-3">
                    <PercentBar value={group.attendanceRate} color="bg-[#3157D5]" />
                  </td>
                  <td className="px-5 py-3">
                    <PercentBar value={group.collectionRate} color="bg-emerald-500" />
                  </td>
                  <td className="px-5 py-3">
                    <Link
                      href={`/groups/${group.groupId}`}
                      className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
                    >
                      فتح
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
