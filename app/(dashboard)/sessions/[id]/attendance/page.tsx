import type { Metadata } from 'next'
import MadarDashboard from '@/components/teacher-os-dashboard'
import { AttendanceWorkspace } from '@/components/attendance/AttendanceWorkspace'

export const metadata: Metadata = {
  title: 'تسجيل الحضور',
  robots: { index: false, follow: false },
}

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <MadarDashboard>
      <AttendanceWorkspace params={params} />
    </MadarDashboard>
  )
}
