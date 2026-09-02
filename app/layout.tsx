import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Sans_Arabic } from 'next/font/google'
import './globals.css'
import './auth-styles.css'

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-ibm-plex-arabic',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'مَدار — كُل شَغَلَك كَمُدَرِّس فِي مَكَان وَاحِد',
  description: 'مَدار هو نظام تشغيل المعلم الحديث. نظّم مجموعاتك، سجّل الحضور، تابع المصروفات، وراقب أداء طلابك — كل ده في مكان واحد بدون تعقيد.',
  generator: 'madar.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f9f9ff',
  userScalable: false,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={`${ibmPlexSansArabic.variable} bg-background`}>
      <body className="antialiased font-arabic">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
