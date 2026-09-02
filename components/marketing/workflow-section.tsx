'use client'
import React, { useState } from 'react';
import { Layers, Play, UserCheck, Wallet, LineChart, ChevronLeft, ChevronRight, Check } from 'lucide-react';

export const HowItWorksTimeline: React.FC = () => {
  const [activeStep, setActiveStep] = useState(2);

  const steps = [
    {
      step: '01',
      title: 'أنشئ المجموعة',
      subtitle: 'حدد السنتر والمواعيد وسعر الحصة ونوع التعليم',
      desc: 'سواء مجموعة مدارس حكومية أو لغات أو تجريبي، حدد جدول الحصص الأسبوعي وسعة المجموعة وطريقة الحساب.',
      icon: Layers,
    },
    {
      step: '02',
      title: 'ابدأ الحصة',
      subtitle: 'افتح الحصة بضغطة واحدة مع وصولك القاعة',
      desc: 'كل بيانات الطلاب وأرقام أولياء الأمور وسجل الحصص السابقة تكون جاهزة على موبايلك فوراً.',
      icon: Play,
    },
    {
      step: '03',
      title: 'سجل الحضور',
      subtitle: 'كل الطلاب يبدأوا حاضر — عدل الاستثناءات فقط',
      desc: 'الابتكار الأسرع: الجميع يبدأ "حاضر". تضغط فقط على الغائب أو المتأخر وتنتهي في 10 ثوانٍ.',
      icon: UserCheck,
    },
    {
      step: '04',
      title: 'تابع الدفع',
      subtitle: 'سجل الكاش أو فودافون كاش فور الاستلام',
      desc: 'حصة بحصة، مَدار يحسب إجمالي المحصل والمتبقي على كل طالب بدون دفاتر ولا شطب.',
      icon: Wallet,
    },
    {
      step: '05',
      title: 'راجع أداء طلابك',
      subtitle: 'تقارير فورية وكويزات Pro لقياس التطور',
      desc: 'شارك تقرير الحضور والدرجات مع أولياء الأمور عبر واتساب واكتشف الطلاب المحتاجين لدعم.',
      icon: LineChart,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-white border-y border-[#E5E7EB] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-[#3157D5] uppercase tracking-wider px-3 py-1 bg-[#EAF0FF] rounded-full border border-[#3157D5]/20">
            طريقة العمل
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] mt-3">
            من أول الحصة لحد آخر الشهر.
          </h2>
          <p className="text-base text-[#667085] mt-3 font-normal">
            تسلسل طبيعي ومنطقي يواكب طريقة تدريسك الواقعية في القاعة بدون أي خطوات معقدة.
          </p>
        </div>

        {/* Horizontal Steps Nav */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-10">
          {steps.map((item, index) => {
            const Icon = item.icon;
            const isCurrent = activeStep === index;
            const isPassed = activeStep > index;

            return (
              <button
                key={item.step}
                onClick={() => setActiveStep(index)}
                className={`p-4 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-[#3157D5] text-white border-[#3157D5] shadow-md shadow-[#3157D5]/20 scale-[1.02]'
                    : isPassed
                    ? 'bg-[#EAF0FF]/60 text-[#3157D5] border-[#3157D5]/30'
                    : 'bg-[#F7F8FC] text-[#667085] border-[#E5E7EB] hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-mono font-bold ${isCurrent ? 'text-white' : 'text-[#667085]'}`}>
                    {item.step}
                  </span>
                  {isPassed ? (
                    <div className="w-5 h-5 rounded-full bg-[#12B76A] text-white flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                  ) : (
                    <Icon className={`w-4 h-4 ${isCurrent ? 'text-white' : 'text-[#667085]'}`} />
                  )}
                </div>
                <div className={`font-bold text-sm ${isCurrent ? 'text-white' : 'text-[#111827]'}`}>
                  {item.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Step Spotlight */}
        <div className="bg-[#F7F8FC] rounded-3xl p-6 sm:p-10 border border-[#E5E7EB] shadow-xs flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white border border-[#E5E7EB] text-xs font-bold text-[#3157D5]">
              <span>الخطوة {steps[activeStep].step} من 05</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#111827]">
              {steps[activeStep].title}
            </h3>
            <p className="text-base text-[#3157D5] font-semibold">
              {steps[activeStep].subtitle}
            </p>
            <p className="text-sm text-[#667085] leading-relaxed">
              {steps[activeStep].desc}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                disabled={activeStep === 0}
                onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs font-bold text-[#667085] hover:text-[#111827] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <ChevronRight className="w-4 h-4" />
                <span>السابق</span>
              </button>
              <button
                disabled={activeStep === steps.length - 1}
                onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
                className="px-4 py-2 rounded-xl bg-[#3157D5] text-white text-xs font-bold hover:bg-[#243FA3] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-xs"
              >
                <span>التالي</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Visual Mock per step */}
          <div className="w-full md:w-5/12 bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm">
            {activeStep === 0 && (
              <div className="space-y-3">
                <div className="text-xs font-bold text-[#667085]">معاينة إعداد المجموعة</div>
                <div className="p-3 bg-[#F7F8FC] rounded-xl border border-gray-200 text-xs">
                  <div className="font-bold text-[#111827]">مجموعة A — النور (الصف الثالث)</div>
                  <div className="text-[#667085] mt-1">28 طالب • 8 حصص/شهر • 100 ج.م/حصة</div>
                </div>
                <div className="p-2.5 bg-[#ECFDF3] rounded-xl text-xs text-[#12B76A] font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4" /> جاهزة للبدء والجدولة الفورية
                </div>
              </div>
            )}

            {activeStep === 1 && (
              <div className="space-y-3">
                <div className="text-xs font-bold text-[#667085]">حصة اليوم الحية</div>
                <div className="p-3 bg-[#EAF0FF] rounded-xl border border-[#3157D5]/30 text-xs">
                  <div className="font-bold text-[#3157D5]">6:00 م — رياضيات (تفاضل وتكامل)</div>
                  <div className="text-[#667085] mt-1">سنتر النور — قاعة 4</div>
                </div>
                <div className="w-full py-2 bg-[#3157D5] text-white text-center rounded-lg text-xs font-bold">
                  بدء الحصة الآن
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#111827]">حضور الحصة (28 طالب)</span>
                  <span className="px-2 py-0.5 bg-[#EAF0FF] text-[#3157D5] font-bold rounded">
                    حضور الكل بنقرة واحدة
                  </span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between p-2 bg-[#F7F8FC] rounded-lg">
                    <span>أحمد محمود</span>
                    <span className="text-[#12B76A] font-bold">✓ حاضر</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-[#F7F8FC] rounded-lg">
                    <span>عمر خالد</span>
                    <span className="text-[#F04438] font-bold">✗ غائب (اعتذار)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-[#F7F8FC] rounded-lg">
                    <span>علي أحمد</span>
                    <span className="text-[#F79009] font-bold">⏱ متأخر 15 د</span>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-3">
                <div className="text-xs font-bold text-[#667085]">تحصيل حصة اليوم</div>
                <div className="p-3 bg-[#ECFDF3] rounded-xl border border-[#A6F4C5] text-xs">
                  <div className="text-[#667085]">المحصل من حصة 6:00 م:</div>
                  <div className="text-lg font-black text-[#12B76A] mt-1">2,400 ج.م</div>
                </div>
                <div className="text-[11px] text-[#667085] flex justify-between">
                  <span>تم سداد: 24 طالب</span>
                  <span className="text-[#F04438] font-bold">متبقي: طالبين</span>
                </div>
              </div>
            )}

            {activeStep === 4 && (
              <div className="space-y-3">
                <div className="text-xs font-bold text-[#667085]">تقرير مستوى الطالب</div>
                <div className="p-3 bg-[#F3F0FF] rounded-xl border border-[#6D5EF5]/30 text-xs">
                  <div className="font-bold text-[#6D5EF5]">Algebra Quiz 1 (Pro)</div>
                  <div className="text-[#111827] mt-1 font-bold">متوسط المجموعة: 17.4 / 20 (92%)</div>
                </div>
                <div className="text-center text-[11px] text-[#3157D5] font-bold">
                  إرسال تقرير واتساب لولي الأمر بنقرة واحدة
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// Named export alias for backward compatibility
export { HowItWorksTimeline as WorkflowSection };
