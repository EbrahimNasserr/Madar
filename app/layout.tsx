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

const BASE_URL = 'https://madar-edu.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: 'مدار — كل شغلك كمدرس في مكان واحد',
    template: '%s | مدار',
  },
  description:
    'مدار هو نظام تشغيل المعلم الحديث. نظّم مجموعاتك، سجّل الحضور، تابع المصروفات، وراقب أداء طلابك — كل ده في مكان واحد بدون تعقيد.',
  keywords: [
    'مدار',
    'نظام إدارة المدرسين',
    'تسجيل الحضور',
    'إدارة الطلاب',
    'حصص خصوصية',
    'متابعة المدفوعات',
    'تطبيق مدرس',
    'teacher management app',
    'madar',
  ],
  authors: [{ name: 'مدار', url: BASE_URL }],
  creator: 'مدار',
  publisher: 'مدار',
  category: 'education',

  // Canonical & alternates
  alternates: {
    canonical: '/',
    languages: {
      'ar': '/',
    },
  },

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'ar_EG',
    url: BASE_URL,
    siteName: 'مدار',
    title: 'مدار — كل شغلك كمدرس في مكان واحد',
    description:
      'مدار هو نظام تشغيل المعلم الحديث. نظّم مجموعاتك، سجّل الحضور، تابع المصروفات، وراقب أداء طلابك — كل ده في مكان واحد.',
    images: [
      {
        url: '/favicon-package/icon-512.png',
        width: 512,
        height: 512,
        alt: 'مدار — نظام تشغيل المعلم',
      },
    ],
  },

  // Twitter / X Card
  twitter: {
    card: 'summary',
    title: 'مدار — كل شغلك كمدرس في مكان واحد',
    description:
      'نظام تشغيل المعلم الحديث — حضور، مجموعات، مدفوعات، وأداء الطلاب في مكان واحد.',
    images: ['/favicon-package/icon-512.png'],
    creator: '@madar_app',
    site: '@madar_app',
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Favicons & icons
  icons: {
    icon: [
      { url: '/favicon-package/favicon.ico', sizes: 'any' },
      { url: '/favicon-package/favicon.svg', type: 'image/svg+xml', sizes: 'any' },
      { url: '/favicon-package/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
    ],
    apple: [
      { url: '/favicon-package/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/favicon-package/favicon.svg' },
    ],
  },

  // Web app manifest
  manifest: '/favicon-package/site.webmanifest',

  // Verification placeholders — fill in once you have the codes
  // verification: {
  //   google: 'GOOGLE_SITE_VERIFICATION_CODE',
  // },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f9f9ff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  userScalable: false,
  width: 'device-width',
  initialScale: 1,
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
