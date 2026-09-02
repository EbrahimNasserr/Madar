'use client'
import React, { useState } from 'react';
import { Check, X, Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const PricingSection: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  return (
    <section id="pricing" className="py-20 md:py-28 bg-[#F7F8FC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#3157D5] uppercase tracking-wider px-3 py-1 bg-[#EAF0FF] rounded-full border border-[#3157D5]/20">
            خطط واضحة ومناسبة
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] mt-3">
            اختر الباقة المناسبة لحجم تدريسك.
          </h2>
          <p className="text-base text-[#667085] mt-3 font-normal">
            ابدأ بالخطة الأساسية مجاناً لإدارة يومك، أو قم بالترقية لـ Pro لمتابعة درجات وتحليلات طلابك.
          </p>

          <div className="inline-flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-gray-200 mt-8 shadow-2xs">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-[#3157D5] text-white shadow-2xs'
                  : 'text-[#667085] hover:text-[#111827]'
              }`}
            >
              دفع شهري
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                billingCycle === 'annual'
                  ? 'bg-[#3157D5] text-white shadow-2xs'
                  : 'text-[#667085] hover:text-[#111827]'
              }`}
            >
              <span>دفع سنوي</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#ECFDF3] text-[#12B76A] text-[10px] font-bold">
                وفر 20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* BASIC */}
          <div className="bg-white rounded-3xl p-7 sm:p-9 border border-[#E5E7EB] shadow-sm flex flex-col justify-between hover:border-gray-300 transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-[#667085] uppercase tracking-wider">الخطة الأساسية</span>
                <span className="px-3 py-1 rounded-full bg-gray-100 text-[#667085] text-xs font-bold">Basic</span>
              </div>

              <h3 className="text-3xl font-black text-[#111827] mb-2">مجانًا</h3>
              <p className="text-xs text-[#667085] mb-6">
                للمدرسين الراغبين في تنظيم الحضور والمجموعات والمصروفات اليومية.
              </p>

              <div className="border-t border-gray-100 pt-6 space-y-3.5">
                <div className="text-xs font-bold text-[#111827] mb-2">تشمل:</div>
                {[
                  'إدارة الطلاب والبيانات',
                  'المجموعات والجداول وتعدد السناتر',
                  'الحصص والمواعيد',
                  'تسجيل الحضور والغياب بزر "حضور الكل"',
                  'متابعة المصروفات والمتبقي حصة بحصة',
                  'التقارير الأساسية',
                ].map((feat) => (
                  <div key={feat} className="flex items-center gap-2.5 text-sm text-[#111827]">
                    <Check className="w-4 h-4 text-[#12B76A] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}

                <div className="pt-2 border-t border-dashed border-gray-200 space-y-2.5">
                  {['الاختبارات والكويزات', 'رصد الدرجات وترتيب الأوائل', 'التحليلات المتقدمة'].map((feat) => (
                    <div key={feat} className="flex items-center gap-2.5 text-sm text-gray-400">
                      <X className="w-4 h-4 text-gray-300 shrink-0" />
                      <span className="line-through">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/signup"
                className="w-full py-4 bg-[#F7F8FC] hover:bg-gray-100 text-[#111827] font-bold rounded-2xl border border-gray-200 transition-all text-sm flex items-center justify-center"
              >
                ابدأ مجانًا
              </Link>
            </div>
          </div>

          {/* PRO */}
          <div className="bg-white rounded-3xl p-7 sm:p-9 border-2 border-[#3157D5] shadow-xl relative flex flex-col justify-between">
            <div className="absolute -top-4 right-8 px-4 py-1 rounded-full bg-gradient-to-r from-[#3157D5] to-[#6D5EF5] text-white text-xs font-black shadow-md">
              الأكثر قيمة
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-[#3157D5] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  باقة المحترفين
                </span>
                <span className="px-3 py-1 rounded-full bg-[#EAF0FF] text-[#3157D5] text-xs font-black uppercase">
                  PRO
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-black text-[#111827]">
                  {billingCycle === 'monthly' ? '199' : '159'}
                </span>
                <span className="text-sm font-bold text-[#667085]">ج.م / شهرياً</span>
              </div>
              <p className="text-xs text-[#667085] mb-6">
                للمدرسين الراغبين في رؤية عميقة لأداء الطلاب ودرجات الكويزات ورسوم التقدم.
              </p>

              <div className="border-t border-gray-100 pt-6 space-y-3.5">
                <div className="text-xs font-bold text-[#3157D5] mb-2">
                  كل مميزات باقة Basic بالكامل، بالإضافة إلى:
                </div>
                {[
                  'إنشاء الاختبارات والكويزات المخصصة',
                  'رصد الدرجات وترتيب أوائل كل مجموعة تلقائياً',
                  'تحليل نسب النجاح ومعدلات التطور عبر الزمن',
                  'تقارير متقدمة وموجهة لأولياء الأمور عبر واتساب',
                  'تنبيهات فورية للطلاب المحتاجين لدعم أكاديمي',
                  'دعم فني مخصص وأولوية في التحديثات',
                ].map((feat) => (
                  <div key={feat} className="flex items-center gap-2.5 text-sm font-semibold text-[#111827]">
                    <div className="w-4 h-4 rounded-full bg-[#EAF0FF] text-[#3157D5] flex items-center justify-center text-[10px] font-bold shrink-0">✓</div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/signup"
                className="w-full py-4 bg-[#3157D5] hover:bg-[#243FA3] text-white font-bold rounded-2xl shadow-lg shadow-[#3157D5]/25 hover:shadow-xl transition-all text-sm flex items-center justify-center gap-2 group"
              >
                <span>ابدأ مع Pro الآن</span>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Keep old named exports so existing imports don't break
export { PricingSection as PricingCards };
export { PricingSection as ComparisonTable };
