import type { Metadata } from 'next'
import MadarDashboard from '@/components/teacher-os-dashboard'
import { ExpensesPage } from '@/components/dashboard/expenses/ExpensesPage'

export const metadata: Metadata = {
  title: 'المصروفات',
  description: 'سجل وتابع مصروفات شغلك واحسب صافي دخلك بدقة.',
  robots: { index: false, follow: false },
}

export default function ExpensesRoute() {
  return (
    <MadarDashboard>
      <ExpensesPage />
    </MadarDashboard>
  )
}
