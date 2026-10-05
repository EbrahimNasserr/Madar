import { Wallet, TrendingUp, TrendingDown, Users, CalendarDays } from 'lucide-react'
import { formatMoney }       from '@/src/lib/formatters/money'
import { formatPercentage }  from '@/src/lib/formatters/percentage'
import type { ReportOverview } from '@/src/lib/api/reportsApi'
import { KpiCard } from './ReportShared'

type Props = {
  financial:  ReportOverview['financial']
  attendance: ReportOverview['attendance']
  sessions:   ReportOverview['sessions']
  groups:     ReportOverview['groups']
}

export function ReportsKpiRow({ financial, attendance, sessions, groups }: Props) {
  const isProfit = financial.netIncome >= 0

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        icon={Wallet}
        label="المحصّل هذا الشهر"
        value={formatMoney(financial.collectedAmount)}
        sub={`من ${formatMoney(financial.expectedAmount)} مستحق`}
        accent="blue"
      />
      <KpiCard
        icon={isProfit ? TrendingUp : TrendingDown}
        label="صافي الدخل"
        value={formatMoney(financial.netIncome)}
        sub={isProfit ? 'ربح 🎉' : 'بعد خصم المصروفات'}
        accent={isProfit ? 'green' : 'red'}
      />
      <KpiCard
        icon={Users}
        label="نسبة الحضور"
        value={formatPercentage(attendance.attendanceRate)}
        sub={`${attendance.present} حاضر من ${attendance.total}`}
        accent={attendance.attendanceRate >= 75 ? 'green' : 'amber'}
      />
      <KpiCard
        icon={CalendarDays}
        label="الحصص والمجموعات"
        value={sessions.total}
        sub={`${groups.total} مجموعة نشطة`}
        accent="blue"
      />
    </div>
  )
}
