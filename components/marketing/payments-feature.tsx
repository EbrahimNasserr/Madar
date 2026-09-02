import React from 'react';
import { Wallet, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const PaymentSpotlight: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-[#F7F8FC] border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Visual */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E7EB] shadow-xl space-y-6">
              {/* Monthly Overview */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-base text-[#111827]">التحصيل هذا الشهر (سبتمبر 2026)</h4>
                  <span className="px-3 py-1 rounded-full bg-[#ECFDF3] text-[#12B76A] text-xs font-bold">
                    85% تم التحصيل
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex">
                  <div className="h-full bg-[#12B76A] rounded-full" style={{ width: '85%' }} />
                </div>
              </div>

              {/* 3 Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#F7F8FC] rounded-2xl p-3.5 sm:p-4 border border-[#E5E7EB]">
                  <div className="text-[11px] font-semibold text-[#667085] mb-1">المتوقع</div>
                  <div className="text-lg sm:text-xl font-black text-[#111827]">80,000</div>
                  <div className="text-[10px] text-[#667085] font-bold">ج.م</div>
                </div>
                <div className="bg-[#ECFDF3]/60 rounded-2xl p-3.5 sm:p-4 border border-[#A6F4C5]">
                  <div className="text-[11px] font-semibold text-[#12B76A] mb-1">المحصل</div>
                  <div className="text-lg sm:text-xl font-black text-[#12B76A]">68,500</div>
                  <div className="text-[10px] text-[#12B76A] font-bold">ج.م</div>
                </div>
                <div className="bg-[#FEF3F2]/60 rounded-2xl p-3.5 sm:p-4 border border-[#FECDCA]">
                  <div className="text-[11px] font-semibold text-[#F04438] mb-1">متبقي</div>
                  <div className="text-lg sm:text-xl font-black text-[#F04438]">11,500</div>
                  <div className="text-[10px] text-[#F04438] font-bold">ج.م</div>
                </div>
              </div>

              {/* Student-level tracking */}
              <div className="bg-[#F7F8FC] rounded-2xl p-5 border border-[#E5E7EB] space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#EAF0FF] text-[#3157D5] font-bold flex items-center justify-center text-xs">
                      أم
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#111827]">أحمد محمد إسماعيل</div>
                      <div className="text-[11px] text-[#667085]">الصف الثالث الثانوي • مجموعة A</div>
                    </div>
                  </div>
                  <div className="text-left">
                    <span className="text-xs text-[#667085]">المتبقي: </span>
                    <span className="text-sm font-black text-[#F04438]">100 ج.م</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    { label: 'الحصة 1', paid: true },
                    { label: 'الحصة 2', paid: true },
                    { label: 'الحصة 3', paid: false },
                    { label: 'الحصة 4', paid: true },
                  ].map((session) => (
                    <div
                      key={session.label}
                      className={`p-2.5 rounded-xl border text-center ${
                        session.paid
                          ? 'bg-white border-gray-200'
                          : 'bg-[#FEF3F2]/40 border-[#FECDCA]'
                      }`}
                    >
                      <div className={`text-[11px] mb-1 ${session.paid ? 'text-[#667085]' : 'text-[#F04438]'}`}>
                        {session.label}
                      </div>
                      <div className={`font-bold flex items-center justify-center gap-1 ${session.paid ? 'text-[#12B76A]' : 'text-[#F04438]'}`}>
                        {session.paid
                          ? <><CheckCircle2 className="w-3.5 h-3.5" /><span>مدفوع (100)</span></>
                          : <><AlertCircle className="w-3.5 h-3.5" /><span>غير مدفوع (100)</span></>
                        }
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs bg-white p-3 rounded-xl border border-gray-200">
                  <span className="text-[#667085]">
                    الإجمالي: <strong className="text-[#111827]">400 ج.م</strong> | المدفوع:{' '}
                    <strong className="text-[#12B76A]">300 ج.م</strong>
                  </span>
                  <span className="font-bold text-[#3157D5] hover:underline cursor-pointer">
                    تسجيل دفع 100 ج.م
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Text */}
          <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFAEB] text-[#F79009] text-xs font-bold border border-[#F79009]/20">
              <Wallet className="w-3.5 h-3.5" />
              <span>إدارة مالية دقيقة وسريعة</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] leading-tight">
              اعرف فلوسك راحت فين.
            </h2>

            <p className="text-base text-[#667085] leading-relaxed">
              مَدار يتابع الدفع <strong className="text-[#111827] font-semibold">حصة بحصة</strong> وتلقائياً، بدون حسابات يدوية ولا جداول شطب في كشكول الحسابات.
            </p>

            <ul className="space-y-3 pt-2 text-sm text-[#667085]">
              {[
                'حساب فوري للمتوقع والمحصل والمتبقي لكل سنتر ومجموعة.',
                'دعم كامل لجميع طرق الدفع في مصر: كاش، فودافون كاش، وInstaPay.',
                'قائمة فورية بجميع الطلاب الذين عليهم مستحقات لتذكيرهم بسهولة.',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#ECFDF3] text-[#12B76A] flex items-center justify-center text-xs font-bold">✓</div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <Link
                href="/signup"
                className="px-6 py-3.5 bg-[#3157D5] hover:bg-[#243FA3] text-white font-bold rounded-2xl shadow-md shadow-[#3157D5]/20 inline-flex items-center gap-2 group text-sm"
              >
                <span>استعراض لوحة المصروفات</span>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { PaymentSpotlight as PaymentsFeature };
