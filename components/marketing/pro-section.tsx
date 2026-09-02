import React from 'react';
import { Award, Sparkles, ArrowLeft, Trophy } from 'lucide-react';
import Link from 'next/link';

export const ProFeatureSection: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-[#FFFFFF] border-b border-[#E5E7EB] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F3F0FF] text-[#6D5EF5] text-xs font-black border border-[#6D5EF5]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ميزة مَـدار PRO الحصرية</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111827] leading-tight">
              مش بس تعرف مين حضر...{' '}
              <span className="text-[#6D5EF5]">اعرف مين بيتطور.</span>
            </h2>

            <p className="text-base text-[#667085] leading-relaxed">
              مع <strong className="text-[#111827] font-bold">MADAR Pro</strong>، انقل تدريسك لمستوى احترافي: رصد درجات الكويزات، رسم منحنيات تطور مستوى كل طالب، وتوليد تقارير أداء فورية تبهر أولياء الأمور.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                'إنشاء ورصد الكويزات الدورية',
                'ترتيب الأوائل بالمجموعة',
                'توزيع نسب النجاح والدرجات',
                'تقارير تقدم تفصيلية لكل طالب',
              ].map((feat) => (
                <div key={feat} className="flex items-center gap-2.5 text-sm font-semibold text-[#111827]">
                  <div className="w-5 h-5 rounded-full bg-[#F3F0FF] text-[#6D5EF5] flex items-center justify-center text-xs font-black">✓</div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-[#F8F9FE] rounded-2xl border border-[#6D5EF5]/20 text-xs text-[#667085] flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#6D5EF5] text-white flex items-center justify-center shrink-0">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-[#111827] block">تنبيه حصري:</strong>
                الكويزات والدرجات والتحليلات المتقدمة متاحة فقط لمشتركي باقة Pro.
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/pricing"
                className="px-7 py-4 bg-gradient-to-r from-[#6D5EF5] to-[#3157D5] hover:from-[#5848E5] hover:to-[#243FA3] text-white font-bold rounded-2xl shadow-lg shadow-[#6D5EF5]/25 inline-flex items-center gap-2.5 group text-sm"
              >
                <span>استكشف تجربة Pro الآن</span>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Quiz Analytics Mockup */}
          <div className="lg:col-span-6">
            <div className="bg-[#F7F8FC] rounded-3xl p-6 sm:p-8 border border-[#E5E7EB] shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-lg text-[#111827]">Algebra Quiz 1 — الجبر العام</h4>
                    <span className="px-2 py-0.5 rounded-md bg-[#6D5EF5] text-white text-[10px] font-black uppercase">
                      PRO
                    </span>
                  </div>
                  <p className="text-xs text-[#667085] mt-0.5">الصف الثالث الثانوي • 26 تسليم من إجمالي 28</p>
                </div>
                <span className="text-xs font-bold text-[#12B76A] bg-[#ECFDF3] px-3 py-1 rounded-full">
                  تم التصحيح
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-white p-3.5 rounded-2xl border border-gray-200 text-center">
                  <div className="text-xs text-[#667085] mb-1">المتوسط</div>
                  <div className="text-xl font-black text-[#6D5EF5]">17.4</div>
                  <div className="text-[10px] text-[#667085]">من 20 درجة</div>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-gray-200 text-center">
                  <div className="text-xs text-[#667085] mb-1">أعلى درجة</div>
                  <div className="text-xl font-black text-[#12B76A]">20 / 20</div>
                  <div className="text-[10px] text-[#12B76A] font-bold">مريم إبراهيم 🏆</div>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-gray-200 text-center">
                  <div className="text-xs text-[#667085] mb-1">نسبة النجاح</div>
                  <div className="text-xl font-black text-[#111827]">92%</div>
                  <div className="text-[10px] text-[#12B76A] font-bold">24 طالب ناجح</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-gray-200 space-y-3">
                <div className="text-xs font-bold text-[#111827] flex justify-between items-center">
                  <span>أوائل الاختبار بالمجموعة</span>
                  <span className="text-[11px] text-[#6D5EF5] font-semibold">ترتيب تلقائي</span>
                </div>

                <div className="space-y-2 text-xs">
                  {[
                    { rank: '1', name: 'مريم إبراهيم القاضي', score: '20 / 20 (100%)', bg: 'bg-[#FFFDF5] border-amber-200', badge: 'bg-amber-400' },
                    { rank: '2', name: 'محمد علي الشناوي', score: '19.5 / 20 (97.5%)', bg: 'bg-gray-50 border-gray-200', badge: 'bg-gray-400' },
                    { rank: '3', name: 'سارة عادل الباز', score: '19 / 20 (95%)', bg: 'bg-gray-50 border-gray-200', badge: 'bg-amber-700' },
                  ].map((student) => (
                    <div key={student.rank} className={`flex items-center justify-between p-2 rounded-xl border ${student.bg}`}>
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full ${student.badge} text-white font-black text-[10px] flex items-center justify-center`}>
                          {student.rank}
                        </span>
                        <span className="font-bold text-[#111827]">{student.name}</span>
                      </div>
                      <span className={`font-bold ${student.rank === '1' ? 'text-[#12B76A]' : 'text-[#111827]'}`}>
                        {student.score}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { ProFeatureSection as ProSection };
