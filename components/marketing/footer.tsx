import Link from 'next/link'
import { Heart } from 'lucide-react'
import Image from 'next/image'
import logo from '@/public/logo_sidebar.png'

export function Footer() {
  return (
    <footer className="bg-[#111827] text-white py-14 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-gray-800">

          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <Image src={logo} alt='logo' width={120} height={60}/>
            </div>

            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              نظام تشغيل المدرس الحديث. كل شغلك كمدرس خصوصي في مكان واحد: الطلاب، المجموعات، الحضور، والمصروفات.
            </p>
            <div className="text-xs text-gray-500">
              صُنع بكل <Heart className="w-3.5 h-3.5 inline text-red-500 mx-0.5" /> للمعلمين في مصر والوطن العربي.
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
            <div className="space-y-3">
              <div className="font-bold text-white text-xs uppercase tracking-wider">المنتج</div>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">المميزات الأساسية</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">كيف يعمل مَدار؟</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">خطط الأسعار</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">الأسئلة الشائعة</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="font-bold text-white text-xs uppercase tracking-wider">التطبيق</div>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/dashboard" className="hover:text-white transition-colors">
                    لوحة التحكم
                  </Link>
                </li>
                <li>
                  <Link href="/attendance" className="hover:text-white transition-colors">
                    تسجيل الحضور
                  </Link>
                </li>
                <li>
                  <Link href="/payments" className="hover:text-white transition-colors">
                    دفتر المصروفات
                  </Link>
                </li>
                <li>
                  <Link href="/quizzes" className="hover:text-white transition-colors">
                    كويزات Pro
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="font-bold text-white text-xs uppercase tracking-wider">قانوني</div>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#terms" className="hover:text-white transition-colors">سياسة الخصوصية</a></li>
                <li><a href="#terms" className="hover:text-white transition-colors">الشروط والأحكام</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">تواصل مع الدعم</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <div>
            © {new Date().getFullYear()} مَـدار (MADAR) — جميع الحقوق محفوظة للمعلم الذكي.
          </div>
          <div className="flex items-center gap-4">
            <span>النسخة 2.4 (إصدار القاهرة)</span>
            <span>•</span>
            <span className="text-[#3157D5] font-semibold">جاهز للعمل المباشر</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
