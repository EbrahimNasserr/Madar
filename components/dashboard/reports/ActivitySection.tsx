import { CalendarDays, BadgeCheck } from 'lucide-react'
import type { ReportOverview } from '@/src/lib/api/reportsApi'
import { KpiCard, ReportSection } from './ReportShared'

type Props = {
  sessions: ReportOverview['sessions']
  groups:   ReportOverview['groups']
}

export function ActivitySection({ sessions, groups }: Props) {
  return (
    <ReportSection
      title="النشاط"
      subtitle="ملخص الحصص والمجموعات النشطة"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <KpiCard
          icon={CalendarDays}
          label="عدد الحصص"
          value={sessions.total}
          sub="حصة مسجّلة في هذه الفترة"
          accent="blue"
        />
        <KpiCard
          icon={BadgeCheck}
          label="المجموعات النشطة"
          value={groups.total}
          sub="مجموعة تدريس نشطة"
          accent="green"
        />
      </div>
    </ReportSection>
  )
}
