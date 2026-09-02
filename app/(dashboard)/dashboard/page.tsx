import type { Metadata } from 'next'
import MadarDashboard from '@/components/teacher-os-dashboard'

export const metadata: Metadata = {
  title: 'لوحة التحكم',
  description: 'نظرة عامة على مجموعاتك وطلابك وحضورك ومدفوعاتك في مدار.',
  robots: { index: false, follow: false },
}

export default function DashboardPage() { return <MadarDashboard /> }
