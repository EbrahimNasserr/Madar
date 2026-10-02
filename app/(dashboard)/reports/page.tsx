import type { Metadata } from 'next'
import MadarDashboard from '@/components/teacher-os-dashboard'
import { ReportsPage } from '@/components/dashboard/reports/ReportsPage'

export const metadata: Metadata = {
  title: 'التقارير',
  description: 'احصل على تقارير شاملة عن أداء طلابك، حضورهم، ومدفوعاتهم في لحظة.',
  robots: { index: false, follow: false },
}

export default function ReportsRoute() {
  return (
    <MadarDashboard>
      <ReportsPage />
    </MadarDashboard>
  )
}
