import type { Metadata } from 'next'
import MadarDashboard from '@/components/teacher-os-dashboard'

export const metadata: Metadata = {
  title: 'المجموعات',
  description: 'نظّم طلابك في مجموعات ومتابع جداول كل مجموعة بسهولة.',
  robots: { index: false, follow: false },
}

export default function GroupsPage() { return <MadarDashboard /> }
