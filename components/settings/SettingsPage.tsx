"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { User, Lock, CreditCard } from "lucide-react";
import { cn } from "@/src/lib/utils";

import PageHeader from "@/components/ui/PageHeader";
import ProfileSettings from "./ProfileSettings";
import AccountSettings from "./AccountSettings";
import SubscriptionSettings from "./SubscriptionSettings";

// ─── Tab definitions ──────────────────────────────────────────────────────────

type TabId = "profile" | "account" | "subscription";

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "profile",      label: "الملف الشخصي",  icon: User       },
  { id: "account",      label: "أمان الحساب",    icon: Lock       },
  { id: "subscription", label: "الاشتراك",        icon: CreditCard },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const tabParam     = searchParams.get("tab") as TabId | null;

  const [activeTab, setActiveTab] = useState<TabId>(
    tabParam && TABS.some((t) => t.id === tabParam) ? tabParam : "profile"
  );

  // Sync if URL param changes (e.g. redirected from SubscriptionGuard)
  useEffect(() => {
    if (tabParam && TABS.some((t) => t.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  return (
    <section className="space-y-6 animate-[appear_0.28s_ease-out]" dir="rtl">
      <PageHeader
        eyebrow="الإعدادات"
        title="إعدادات الحساب"
        description="أدِر بياناتك الشخصية وكلمة المرور واشتراكك."
      />

      {/* Tab bar */}
      <div className="flex gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150",
              activeTab === id
                ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                : "text-slate-500 hover:text-slate-700 hover:bg-white/60"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            {label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      {activeTab === "profile"      && <ProfileSettings />}
      {activeTab === "account"      && <AccountSettings />}
      {activeTab === "subscription" && <SubscriptionSettings />}
    </section>
  );
}
