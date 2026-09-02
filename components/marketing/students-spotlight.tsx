'use client'
import React, { useState } from 'react';
import { Award, Phone, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const StudentProfileSpotlight: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'payments' | 'quizzes'>('overview');

  return (
    <section className="py-20 md:py-28 bg-[#F7F8FC] border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-[#3157D5] uppercase tracking-wider px-3 py-1 bg-[#EAF0FF] rounded-full border border-[#3157D5]/20">
            الملف الرقمي للطالب
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] mt-3">
            سجل كامل وشامل لكل طالب.
          </h2>
          <p className="text-base text-[#667085] mt-3 font-normal">
            بدل السؤال والتشتت، افتح بروفايل أي طالب لترى نسبة حضوره، تفاصيل مدفوعاته، ودرجاته في مكان واحد.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-[#E5E7EB] shadow-xl p-6 sm:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#3157D5] to-[#6D5EF5] text-white font-bold text-xl flex items-center justify-center shadow-md">
                أم
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold text-[#111827]">أحمد محمد إسماعيل</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF3] text-[#12B76A] text-xs font-bold">
                    طالب نشط
                  </span>
                </div>
                <p className="text-sm text-[#667085] mt-0.5">
                  الصف الثالث الثانوي • مجموعة A (سنتر النور)
                </p>
              </div>
            </div>
            <a
              href="https://wa.me/201223456781"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 bg-[#E7F7EE] text-[#12B76A] rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-[#D2F4E2] transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>واتساب الولي</span>
            </a>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 my-6">
            <div className="bg-[#F7F8FC] p-3.5 rounded-2xl border border-gray-200 text-center">
              <div className="text-xs text-[#667085] mb-1">نسبة الحضور</div>
              <div className="text-xl font-black text-[#12B76A]">92%</div>
              <div className="text-[10px] text-[#667085]">22 من 24 حصة</div>
            </div>
            <div className="bg-[#F7F8FC] p-3.5 rounded-2xl border border-gray-200 text-center">
              <div className="text-xs text-[#667085] mb-1">المصروفات</div>
              <div className="text-xl font-black text-[#F04438]">100 ج.م</div>
              <div className="text-[10px] text-[#F04438] font-bold">متبقي غير مسدد</div>
            </div>
            <div className="bg-[#F7F8FC] p-3.5 rounded-2xl border border-gray-200 text-center">
              <div className="text-xs text-[#667085] mb-1">آخر نشاط</div>
              <div className="text-sm font-bold text-[#111827] mt-1">حضر حصة اليوم</div>
              <div className="text-[10px] text-[#667085]">الثلاثاء 6:00 م</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-5 gap-2">
            {(
              [
                { key: 'overview' as const, label: 'نظرة عامة', isPro: false },
                { key: 'attendance' as const, label: 'الحضور والغياب', isPro: false },
                { key: 'payments' as const, label: 'المصروفات', isPro: false },
                { key: 'quizzes' as const, label: 'الاختبارات', isPro: true },
              ]
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-3 px-3 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === tab.key
                    ? tab.isPro
                      ? 'border-[#6D5EF5] text-[#6D5EF5]'
                      : 'border-[#3157D5] text-[#3157D5]'
                    : 'border-transparent text-[#667085] hover:text-[#111827]'
                }`}
              >
                <span>{tab.label}</span>
                {tab.isPro && (
                  <span className="px-1.5 text-[9px] font-black uppercase rounded bg-[#F3F0FF] text-[#6D5EF5] border border-[#6D5EF5]/30">
                    PRO
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-[#F7F8FC] rounded-2xl p-4 border border-gray-200 min-h-[140px] flex items-center justify-center">
            {activeTab === 'overview' && (
              <div className="w-full space-y-2 text-xs text-[#667085]">
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span>رقم هاتف الطالب:</span>
                  <span className="font-bold text-[#111827] font-mono">01012345671</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span>رقم ولي الأمر (الأب):</span>
                  <span className="font-bold text-[#111827] font-mono">01223456781</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>ملاحظات الأستاذ:</span>
                  <span className="font-bold text-[#111827]">طالب ممتاز ومستواه في الجبر متقدم جداً.</span>
                </div>
              </div>
            )}

            {activeTab === 'attendance' && (
              <div className="w-full space-y-2 text-xs">
                {[
                  { label: 'حصة اليوم (تفاضل وتكامل):', status: '✓ حاضر في الموعد', ok: true },
                  { label: 'حصة الجمعة 28 أغسطس:', status: '✓ حاضر', ok: true },
                  { label: 'حصة الثلاثاء 25 أغسطس:', status: '✗ غائب (اعتذار بعذر)', ok: false },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between p-2 bg-white rounded-lg">
                    <span>{row.label}</span>
                    <span className={`font-bold ${row.ok ? 'text-[#12B76A]' : 'text-[#F04438]'}`}>{row.status}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="w-full space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                  <span>إجمالي مستحق الشهر (8 حصص):</span>
                  <span className="font-bold text-[#111827]">800 ج.م</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                  <span>المدفوع حتى الآن:</span>
                  <span className="font-bold text-[#12B76A]">700 ج.م (كاش)</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-[#FECDCA]">
                  <span>المتبقي المطلوب:</span>
                  <span className="font-bold text-[#F04438]">100 ج.م</span>
                </div>
              </div>
            )}

            {activeTab === 'quizzes' && (
              <div className="w-full p-3 bg-[#F3F0FF]/50 rounded-xl border border-[#6D5EF5]/20 text-center space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#6D5EF5]">
                  <Award className="w-4 h-4" />
                  <span>نتائج اختبارات Pro</span>
                </div>
                <div className="text-xs text-[#111827]">
                  حصل أحمد على <strong>18.5 / 20</strong> في Algebra Quiz 1 (المركز الرابع بالمجموعة)
                </div>
                <div className="text-[11px] text-[#667085]">
                  تحليلات الكويزات ورسوم التقدم متوفرة بالكامل لمشتركي باقة Pro.
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#3157D5] hover:text-[#243FA3] hover:underline"
          >
            <span>استعراض سجلات جميع الطلاب في لوحة التحكم</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
