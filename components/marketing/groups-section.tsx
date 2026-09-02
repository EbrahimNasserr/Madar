import React from 'react';
import { Layers, Users, Calendar, Coins, School, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const GroupSpotlight: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-white border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-[#3157D5] uppercase tracking-wider px-3 py-1 bg-[#EAF0FF] rounded-full border border-[#3157D5]/20">
            مرونة الإعدادات
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] mt-3">
            كل مجموعة ليها نظامها.
          </h2>
          <p className="text-base text-[#667085] mt-3 font-normal">
            لكل سنتر ولكل مرحلة قواعدها ومواعيدها وتسعيرها الخاص. مَدار يمنحك المرونة الكاملة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Government Group */}
          <div className="bg-[#F7F8FC] rounded-3xl p-6 sm:p-8 border border-[#E5E7EB] hover:border-[#3157D5]/40 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-[#EAF0FF] text-[#3157D5] text-xs font-bold flex items-center gap-1.5">
                <School className="w-3.5 h-3.5" />
                حكومي
              </span>
              <span className="text-xs font-bold text-[#667085]">سنتر النور — مكرم عبيد</span>
            </div>

            <h3 className="text-2xl font-bold text-[#111827] mb-1">رياضيات — الصف الثالث</h3>
            <p className="text-xs text-[#667085] mb-6">الثانوية العامة • مجموعة A</p>

            <div className="grid grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-[#E5E7EB] mb-6">
              <div className="text-center">
                <div className="text-xs text-[#667085] mb-1 flex items-center justify-center gap-1">
                  <Users className="w-3 h-3 text-[#3157D5]" /><span>الطلاب</span>
                </div>
                <div className="text-lg font-bold text-[#111827]">28 طالب</div>
              </div>
              <div className="text-center border-x border-gray-100">
                <div className="text-xs text-[#667085] mb-1 flex items-center justify-center gap-1">
                  <Calendar className="w-3 h-3 text-[#3157D5]" /><span>الحصص</span>
                </div>
                <div className="text-lg font-bold text-[#111827]">8 / شهر</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-[#667085] mb-1 flex items-center justify-center gap-1">
                  <Coins className="w-3 h-3 text-[#3157D5]" /><span>سعر الحصة</span>
                </div>
                <div className="text-lg font-bold text-[#12B76A]">100 ج.م</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#667085]">
              <span>المواعيد: الثلاثاء والجمعة 6:00 م</span>
              <span className="font-bold text-[#3157D5]">800 ج.م شهرياً</span>
            </div>
          </div>

          {/* Experimental Group */}
          <div className="bg-[#F7F8FC] rounded-3xl p-6 sm:p-8 border border-[#E5E7EB] hover:border-[#6D5EF5]/40 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-[#F3F0FF] text-[#6D5EF5] text-xs font-bold flex items-center gap-1.5">
                <School className="w-3.5 h-3.5" />
                تجريبي / لغات
              </span>
              <span className="text-xs font-bold text-[#667085]">سنتر الأوائل — مصر الجديدة</span>
            </div>

            <h3 className="text-2xl font-bold text-[#111827] mb-1">رياضيات — الصف الثاني</h3>
            <p className="text-xs text-[#667085] mb-6">الثانوية العامة • مجموعة B</p>

            <div className="grid grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-[#E5E7EB] mb-6">
              <div className="text-center">
                <div className="text-xs text-[#667085] mb-1 flex items-center justify-center gap-1">
                  <Users className="w-3 h-3 text-[#6D5EF5]" /><span>الطلاب</span>
                </div>
                <div className="text-lg font-bold text-[#111827]">22 طالب</div>
              </div>
              <div className="text-center border-x border-gray-100">
                <div className="text-xs text-[#667085] mb-1 flex items-center justify-center gap-1">
                  <Calendar className="w-3 h-3 text-[#6D5EF5]" /><span>الحصص</span>
                </div>
                <div className="text-lg font-bold text-[#111827]">4 / شهر</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-[#667085] mb-1 flex items-center justify-center gap-1">
                  <Coins className="w-3 h-3 text-[#6D5EF5]" /><span>سعر الحصة</span>
                </div>
                <div className="text-lg font-bold text-[#12B76A]">150 ج.م</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#667085]">
              <span>المواعيد: الأحد والأربعاء 8:00 م</span>
              <span className="font-bold text-[#6D5EF5]">600 ج.م شهرياً</span>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#3157D5] hover:text-[#243FA3] hover:underline"
          >
            <span>استعراض وإدارة جميع المجموعات</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export { GroupSpotlight as GroupsSection };
