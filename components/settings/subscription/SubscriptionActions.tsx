"use client";

import { ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatArabicDateShort } from "@/src/lib/date/formatDate";
import type { PlanId } from "@/src/lib/api/billingApi";
import type { SubscriptionSnapshot } from "./CurrentSubscriptionCard";
import PlanCard from "./PlanCard";

// ─── Downgrade action row ─────────────────────────────────────────────────────

interface DowngradeRowProps {
  onDowngrade: () => void;
  isDowngrading: boolean;
}

export function DowngradeRow({ onDowngrade, isDowngrading }: DowngradeRowProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4">
      <div>
        <p className="text-sm font-semibold text-slate-800">التغيير إلى Basic</p>
        <p className="mt-0.5 text-xs text-slate-500">
          سيُطبَّق التغيير مع بداية دورة الفوترة القادمة.
        </p>
      </div>
      <Button variant="secondary" onClick={onDowngrade} disabled={isDowngrading}>
        التغيير إلى Basic
      </Button>
    </div>
  );
}

// ─── Scheduled downgrade banner ───────────────────────────────────────────────

interface ScheduledDowngradeBannerProps {
  endsAt: string | null;
  onCancelChange: () => void;
  isCancellingChange: boolean;
}

export function ScheduledDowngradeBanner({
  endsAt,
  onCancelChange,
  isCancellingChange,
}: ScheduledDowngradeBannerProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
      <p className="text-sm text-slate-700">
        سيتم تحويل خطتك إلى <strong>Basic</strong>
        {endsAt && (
          <>
            {" "}في <strong>{formatArabicDateShort(endsAt)}</strong>
          </>
        )}
      </p>
      <Button variant="secondary" onClick={onCancelChange} disabled={isCancellingChange}>
        {isCancellingChange ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : (
          "البقاء على Pro"
        )}
      </Button>
    </div>
  );
}

// ─── Upgrade to Pro banner ────────────────────────────────────────────────────

interface UpgradeBannerProps {
  onUpgrade: () => void;
  isLoading: boolean;
}

export function UpgradeBanner({ onUpgrade, isLoading }: UpgradeBannerProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-indigo-200 bg-indigo-50 px-5 py-4">
      <div>
        <p className="text-sm font-semibold text-slate-800">الترقية إلى Pro</p>
        <p className="mt-0.5 text-xs text-slate-500">
          احصل على التحليلات المتقدمة وكل ميزات مَدار.
        </p>
      </div>
      <Button onClick={onUpgrade} disabled={isLoading}>
        {isLoading ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : (
          <>
            Upgrade to Pro
            <ArrowLeft className="h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
}

// ─── Reactivate banner ────────────────────────────────────────────────────────

interface ReactivateBannerProps {
  onReactivate: () => void;
  isReactivating: boolean;
}

export function ReactivateBanner({ onReactivate, isReactivating }: ReactivateBannerProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
      <p className="text-sm text-slate-700">
        يمكنك إعادة تفعيل الاشتراك في أي وقت قبل انتهاء الفترة الحالية.
      </p>
      <Button onClick={onReactivate} disabled={isReactivating}>
        {isReactivating ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : (
          "إعادة تفعيل الاشتراك"
        )}
      </Button>
    </div>
  );
}

// ─── Plan picker (trial / trial_expired / expired) ────────────────────────────

interface PlanPickerProps {
  subscription: SubscriptionSnapshot;
  plans: { id: PlanId; prices: { monthly: number | null }; features: string[] }[];
  onChoosePlan: (id: PlanId) => void;
  checkoutLoading: boolean;
}

export function PlanPicker({
  subscription,
  plans,
  onChoosePlan,
  checkoutLoading,
}: PlanPickerProps) {
  const isInTrial = subscription.status === "trial";

  const subtitle =
    isInTrial
      ? "اختر الباقة المناسبة علشان تكمل استخدام مَدار بعد انتهاء التجربة."
      : subscription.status === "expired"
        ? "جدّد اشتراكك لاستعادة الوصول إلى كل ميزات مَدار."
        : "اختر باقة للاستمرار في استخدام مَدار.";

  return (
    <section>
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-950">اختر باقتك</h2>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>

      {plans.length === 0 ? (
        <p className="text-sm text-slate-500">لا توجد خطط متاحة حاليًا.</p>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isCurrent={false}
              isInTrial={isInTrial}
              isExpired={subscription.status === "expired"}
              onChoose={onChoosePlan}
              loading={checkoutLoading}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Cancel / danger zone ─────────────────────────────────────────────────────

interface DangerZoneProps {
  onCancel: () => void;
}

export function DangerZone({ onCancel }: DangerZoneProps) {
  return (
    <section className="rounded-2xl border border-red-200 bg-white p-6">
      <h2 className="font-bold text-slate-950">إلغاء الاشتراك</h2>
      <p className="mt-2 text-sm text-slate-500">
        سيظل بإمكانك استخدام مَدار حتى نهاية فترة الاشتراك الحالية.
      </p>
      <Button variant="destructive" className="mt-5" onClick={onCancel}>
        إلغاء الاشتراك
      </Button>
    </section>
  );
}
