import type { Metadata } from 'next'
import MadarDashboard from '@/components/teacher-os-dashboard'

export const metadata: Metadata = {
  title: 'الإعدادات',
  description: 'اضبط إعدادات حسابك وتفضيلاتك على مدار.',
  robots: { index: false, follow: false },
}

export default function SettingsPage() { return <MadarDashboard /> }
