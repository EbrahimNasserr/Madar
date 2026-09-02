'use client'
import React, { useState } from 'react';
import { Check, CheckCheck, Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const AttendanceSpotlight: React.FC = () => {
  const [studentsList, setStudentsList] = useState([
    { id: '1', name: 'أحمد محمود إسماعيل', status: 'present' as const, payment: 'مدفوع', amount: '100 ج.م' },
    { id: '2', name: 'محمد علي الشناوي', status: 'present' as const, payment: 'مدفوع', amount: '100 ج.م' },
    { id: '3', name: 'يوسف حسن الصاوي', status: 'present' as const, payment: 'مدفوع', amount: '100 ج.م' },
    { id: '4', name: 'عمر خالد المنشاوي', status: 'absent' as const, payment: 'غير مدفوع', amount: '0 ج.م' },
    { id: '5', name: 'علي أحمد عبد الرحمن', status: 'late' as const, payment: 'مدفوع', amount: '100 ج.م' },
    { id: '6', name: 'مريم إبراهيم القاضي', status: 'present' as const, payment: 'مدفوع', amount: '100 ج.م' },
  ]);

  const handleStatusChange = (id: string, newStatus: 'present' | 'absent' | 'late') => {
    setStudentsList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  const handleMarkAllPresent = () => {
    setStudentsList((prev) => prev.map((s) => ({ ...s, status: 'present' as const })));
  };

  const presentCount = studentsList.filter((s) => s.status === 'present').length + 19;
  const absentCount = studentsList.filter((s) => s.status === 'absent').length + 2;
  const lateCount = studentsList.filter((s) => s.status === 'late').length;

  return (
    <section className="py-20 md:py-28 bg-[#FFFFFF] border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF0FF] text-[#3157D5] text-xs font-bold border border-[#3157D5]/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>الميزة الأهم والأسرع في مَدار</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] leading-tight">
              ودّع ورقة الحضور.
            </h2>

            <p className="text-base text-[#667085] leading-relaxed">
              كل الطلاب يبدأوا <strong className="text-[#12B76A] font-bold">حاضر</strong> تلقائياً. عدّل فقط حالات الغياب أو التأخير بنقرة واحدة، واحفظ سجل الحصة كاملاً في ثوانٍ معدودة.
            </p>

            <div className="space-y-3 pt-2">
              {[
                { title: 'زر "حضور الكل" الفوري', desc: 'بضغطة واحدة يُسجل الجميع، ومتاح تعديل أي استثناء بسهولة.' },
                { title: 'ربط الحضور بالمصروفات', desc: 'تعرف حالة دفع كل طالب أمام اسمه أثناء تسجيل الحضور مباشرة.' },
                { title: 'وضع الموبايل المريح بيد واحدة', desc: 'أزرار لمس كبيرة تناسب المعلم أثناء وقوفه داخل قاعة الشرح.' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#ECFDF3] text-[#12B76A] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#111827]">{item.title}</div>
                    <div className="text-xs text-[#667085]">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                href="/signup"
                className="px-6 py-3.5 bg-[#3157D5] hover:bg-[#243FA3] text-white font-bold rounded-2xl shadow-md shadow-[#3157D5]/20 inline-flex items-center gap-2 group text-sm"
              >
                <span>جرّب تسجيل الحضور الفعلي الآن</span>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Interactive Mockup */}
          <div className="lg:col-span-7">
            <div className="bg-[#F7F8FC] rounded-3xl p-5 sm:p-7 border border-[#E5E7EB] shadow-xl">
              {/* Header */}
              <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h4 className="font-bold text-base text-[#111827]">رياضيات — الصف الثالث الثانوي</h4>
                    <p className="text-xs text-[#667085]">الثلاثاء، 11 أغسطس • 6:00 م • 28 طالب</p>
                  </div>
                  <button
                    onClick={handleMarkAllPresent}
                    className="px-3.5 py-1.5 bg-[#EAF0FF] hover:bg-[#3157D5] text-[#3157D5] hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto border border-[#3157D5]/20"
                  >
                    <CheckCheck className="w-4 h-4" />
                    <span>حضور الكل</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
                  <div className="p-2 rounded-xl bg-[#ECFDF3] text-center">
                    <span className="text-base font-black text-[#12B76A]">{presentCount}</span>
                    <span className="text-[11px] font-bold text-[#12B76A] mr-1">حاضر</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#FEF3F2] text-center">
                    <span className="text-base font-black text-[#F04438]">{absentCount}</span>
                    <span className="text-[11px] font-bold text-[#F04438] mr-1">غائب</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#FFFAEB] text-center">
                    <span className="text-base font-black text-[#F79009]">{lateCount}</span>
                    <span className="text-[11px] font-bold text-[#F79009] mr-1">متأخر</span>
                  </div>
                </div>
              </div>

              {/* Student list */}
              <div className="space-y-2.5">
                <div className="text-[11px] font-bold text-[#667085] px-2 flex justify-between">
                  <span>الطالب</span>
                  <span>حالة الحضور • حالة الدفع</span>
                </div>

                {studentsList.map((st) => (
                  <div
                    key={st.id}
                    className="bg-white rounded-xl p-3 border border-[#E5E7EB] flex items-center justify-between shadow-2xs hover:border-[#3157D5]/30 transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#F1F3F9] text-[#111827] font-bold text-xs flex items-center justify-center">
                        {st.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-[#111827]">{st.name}</div>
                        <div className="text-[10px] text-[#667085]">
                          حصة اليوم: <span className="font-semibold text-gray-700">{st.amount}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="inline-flex rounded-lg bg-[#F7F8FC] p-0.5 border border-[#E5E7EB]">
                        {(['present', 'absent', 'late'] as const).map((s) => (
                          <button
                            key={s}
                            onClick={() => handleStatusChange(st.id, s)}
                            className={`px-2 py-1 text-[11px] font-bold rounded-md transition-all ${
                              st.status === s
                                ? s === 'present'
                                  ? 'bg-[#12B76A] text-white shadow-2xs'
                                  : s === 'absent'
                                  ? 'bg-[#F04438] text-white shadow-2xs'
                                  : 'bg-[#F79009] text-white shadow-2xs'
                                : 'text-[#667085] hover:text-black'
                            }`}
                          >
                            {s === 'present' ? 'حاضر' : s === 'absent' ? 'غائب' : 'متأخر'}
                          </button>
                        ))}
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-1 rounded-md hidden sm:inline-block ${
                          st.payment === 'مدفوع'
                            ? 'bg-[#ECFDF3] text-[#12B76A]'
                            : 'bg-[#FEF3F2] text-[#F04438]'
                        }`}
                      >
                        {st.payment}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-center">
                <span className="text-xs text-[#667085]">
                  💡 اضغط على الأزرار لتجربة تغيير حالة الطالب التفاعلية فوراً
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { AttendanceSpotlight as AttendanceFeature };
