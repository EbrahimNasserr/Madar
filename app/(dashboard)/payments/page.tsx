import type { Metadata } from 'next'
import MadarDashboard from '@/components/teacher-os-dashboard'

export const metadata: Metadata = {
  title: 'المدفوعات',
  description: 'تابع مدفوعات طلابك، سجّل الإيصالات، وتعرّف على من لسه ما دفعش.',
  robots: { index: false, follow: false },
}

export default function PaymentsPage() { return <MadarDashboard /> }
