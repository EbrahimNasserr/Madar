import type { Metadata } from 'next'
import MadarDashboard from '@/components/teacher-os-dashboard'

export const metadata: Metadata = {
  title: 'الطلاب',
  description: 'تصفّح وأدر قائمة طلابك، تابع أداءهم وبياناتهم في مكان واحد.',
  robots: { index: false, follow: false },
}

export default function StudentsPage() { return <MadarDashboard /> }
