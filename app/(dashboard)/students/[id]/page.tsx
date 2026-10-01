import type { Metadata } from 'next'
import MadarDashboard from '@/components/teacher-os-dashboard'
import { StudentDetailPage } from '@/components/dashboard/students/StudentDetailPage'

export const metadata: Metadata = {
  title: 'تفاصيل الطالب',
  robots: { index: false, follow: false },
}

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <MadarDashboard>
      <StudentDetailPage params={params} />
    </MadarDashboard>
  )
}
