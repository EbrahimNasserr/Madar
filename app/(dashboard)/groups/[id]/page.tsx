import type { Metadata } from 'next'
import MadarDashboard from '@/components/teacher-os-dashboard'
import { GroupDetailsPage } from '@/components/dashboard/groups/detail/GroupDetailsPage'

export const metadata: Metadata = {
  title: 'تفاصيل المجموعة',
  robots: { index: false, follow: false },
}

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <MadarDashboard>
      <GroupDetailsPage params={params} />
    </MadarDashboard>
  )
}
