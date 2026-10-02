"use client";

import { useGetSubscriptionQuery } from "@/src/lib/api/subscriptionApi";
import { FEATURES } from "@/src/constants/features";

const ALL_FEATURES: { key: keyof typeof FEATURES; label: string }[] = [
  { key: "DASHBOARD",          label: "لوحة التحكم"      },
  { key: "STUDENTS",           label: "الطلاب"            },
  { key: "GROUPS",             label: "المجموعات"         },
  { key: "SESSIONS",           label: "الحصص"             },
  { key: "ATTENDANCE",         label: "الحضور"            },
  { key: "PAYMENTS",           label: "المصروفات"         },
  { key: "QUIZZES",            label: "الاختبارات"        },
  { key: "GRADES",             label: "الدرجات"           },
  { key: "ADVANCED_ANALYTICS", label: "تحليلات متقدمة"   },
];

export default function SubscriptionPage() {
  const { data, isLoading } = useGetSubscriptionQuery();

  if (isLoading) {
    return (
      <div className="h-52 animate-pulse rounded-2xl bg-slate-100" />
    );
  }

  const subscription = data?.data;

  if (!subscription) return null;

  const isPro = subscription.plan === "pro";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-indigo-600">الاشتراك</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">خطتك الحالية</h1>
        <p className="mt-2 text-sm text-slate-500">
          تابع خطتك والميزات المتاحة لحسابك.
        </p>
      </div>

      {/* Plan card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
              {isPro ? "PRO" : "BASIC"}
            </span>

            <h2 className="mt-4 text-2xl font-bold text-slate-950">
              {isPro ? "مَدار Pro" : "مَدار Basic"}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {isPro
                ? "كل أدوات مَدار متاحة لك."
                : "كل الأدوات الأساسية لإدارة دروسك."}
            </p>
          </div>

          {!isPro && (
            <button className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700">
              الترقية إلى Pro
            </button>
          )}
        </div>
      </div>

      {/* Features list */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="mb-4 text-base font-bold text-slate-950">الميزات المتاحة</h3>
        <ul className="divide-y divide-slate-100">
          {ALL_FEATURES.map(({ key, label }) => {
            const active = subscription.features.includes(FEATURES[key]);
            return (
              <li
                key={key}
                className="flex items-center justify-between py-3 text-sm"
              >
                <span className={active ? "text-slate-800" : "text-slate-400"}>
                  {label}
                </span>
                {active ? (
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    متاح
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-400">
                    Pro فقط
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
