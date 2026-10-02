import type { Metadata } from 'next'
import MadarDashboard from '@/components/teacher-os-dashboard'
import { SubscriptionPage } from '@/components/dashboard/subscription/SubscriptionPage'

export const metadata: Metadata = {
  title: 'الاشتراك',
  description: 'تابع خطتك الحالية وميزات Pro المتاحة على حسابك في مَدار.',
  robots: { index: false, follow: false },
}

export default function SubscriptionRoute() {
  return (
    <MadarDashboard>
      <SubscriptionPage />
    </MadarDashboard>
  )
}
