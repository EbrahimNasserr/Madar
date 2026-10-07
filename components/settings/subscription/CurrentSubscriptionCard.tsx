"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/src/lib/formatters/money";
import { formatArabicDateShort } from "@/src/lib/date/formatDate";
import { calcDaysRemaining } from "./utils";

// ─── Props ────────────────────────────────────────────────────────────────────

export interface SubscriptionSnapshot {
  status: string;
  plan: "basic" | "pro" | null;
  trial: { active: boolean; endsAt?: string; daysRemaining?: number };
  currentPeriod: { startsAt: string | null; endsAt: string | null };
  cancelAtPeriodEnd: boolean;
  nextPlan: "basic" | "pro" | null;
}

interface Props {
  subscription: SubscriptionSnapshot;
  onRenew?: () => void;
  renewLoading?: boolean;
}

// ─── Sub-renders ──────────────────────────────────────────────────────────────

function TrialCard({ subscription }: { subscription: SubscriptionSnapshot }) {
  const days = subscription.trial.daysRemaining ?? 0;
  const urgent = days <= 3;

  return (
    <div
      className={[
        "rounded-3xl border p-6",
        urgent
          ? "border-amber-200 bg-amber-50"
          : "border-indigo-200 bg-indigo-50",
      ].join(" ")}
    >
      <span
        className={[
          "inline-flex rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-wide",
          urgent
            ? "bg-amber-100 text-amber-800"
            : "bg-indigo-100 text-indigo-800",
        ].join(" ")}
      >
        PRO TRIAL
      </span>

      <h2 className="mt-4 text-2xl font-black text-slate-950">تجربتك المجانية</h2>

      <p className="mt-2 text-sm text-slate-600">
        متبقي{" "}
        <strong className={urgent ? "text-amber-900" : "text-indigo-900"}>
          {days}
        </strong>{" "}
        {days === 1 ? "يوم" : "أيام"}.
      </p>

      {subscription.trial.endsAt && (
        <p className="mt-1 text-xs text-slate-500">
          تنتهي في {formatArabicDateShort(subscription.trial.endsAt)}
        </p>
      )}
    </div>
  );
}

function TrialExpiredCard() {
  return (
    <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
      <span className="inline-flex rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-red-800">
        TRIAL EXPIRED
      </span>
      <h2 className="mt-4 text-2xl font-black text-red-950">
        انتهت تجربتك المجانية
      </h2>
      <p className="mt-2 text-sm text-red-800">
        بياناتك محفوظة كما هي. اختر باقة للاستمرار في استخدام مَدار.
      </p>
    </div>
  );
}

function ExpiredCard({
  subscription,
  onRenew,
  renewLoading,
}: Props) {
  const planLabel = subscription.plan === "pro" ? "Madar Pro" : "Madar Basic";

  return (
    <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
      <span className="inline-flex rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-red-800">
        EXPIRED
      </span>
      <h2 className="mt-4 text-2xl font-black text-red-950">
        انتهى اشتراك {planLabel}
      </h2>
      <p className="mt-2 text-sm text-red-800">لن يتم حذف أي من بياناتك.</p>
      <p className="mt-1 text-sm text-red-800">
        جدّد اشتراكك لاستعادة الوصول إلى الطلاب والجلسات والحضور والمدفوعات
        والتقارير.
      </p>
      {onRenew && (
        <Button className="mt-5" onClick={onRenew} disabled={renewLoading}>
          {renewLoading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            `تجديد ${subscription.plan === "pro" ? "Pro" : "Basic"}`
          )}
        </Button>
      )}
    </div>
  );
}

function PastDueCard({ onRenew, renewLoading }: Pick<Props, "onRenew" | "renewLoading">) {
  return (
    <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
      <h2 className="text-xl font-black text-red-950">الدفع متأخر</h2>
      <p className="mt-2 text-sm text-red-800">
        يوجد مبلغ مستحق على حسابك. جدّد اشتراكك للاستمرار في استخدام مَدار.
      </p>
      {onRenew && (
        <Button className="mt-5" onClick={onRenew} disabled={renewLoading}>
          {renewLoading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            "تجديد الاشتراك"
          )}
        </Button>
      )}
    </div>
  );
}

function ActiveCard({
  subscription,
  onRenew,
  renewLoading,
}: Props) {
  const planName = subscription.plan === "pro" ? "Madar Pro" : "Madar Basic";
  const daysRemaining = calcDaysRemaining(subscription.currentPeriod.endsAt);
  const nearExpiry = daysRemaining <= 7;
  const veryNearExpiry = daysRemaining <= 3;

  // Scheduled downgrade
  if (subscription.nextPlan === "basic") {
    return (
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
        <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-amber-800">
          SCHEDULED CHANGE
        </span>
        <h2 className="mt-4 text-2xl font-black text-slate-950">{planName}</h2>
        <p className="mt-2 text-sm text-slate-700">
          سيتم تحويل خطتك إلى <strong>Basic</strong>
          {subscription.currentPeriod.endsAt && (
            <>
              {" "}في{" "}
              <strong>{formatArabicDateShort(subscription.currentPeriod.endsAt)}</strong>
            </>
          )}
          .
        </p>
      </div>
    );
  }

  // Cancelled (will not renew)
  if (subscription.cancelAtPeriodEnd) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <span className="inline-flex rounded-full bg-slate-200 px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-slate-700">
          CANCELLED
        </span>
        <h2 className="mt-4 text-2xl font-black text-slate-950">
          تم إلغاء التجديد التلقائي
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          يمكنك استخدام {planName} حتى:{" "}
          {subscription.currentPeriod.endsAt && (
            <strong className="text-slate-900">
              {formatArabicDateShort(subscription.currentPeriod.endsAt)}
            </strong>
          )}
        </p>
      </div>
    );
  }

  // Normal active
  return (
    <div
      className={[
        "rounded-3xl border p-6",
        veryNearExpiry
          ? "border-red-200 bg-red-50"
          : nearExpiry
            ? "border-amber-200 bg-amber-50"
            : "border-emerald-200 bg-emerald-50",
      ].join(" ")}
    >
      <span
        className={[
          "inline-flex rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-wide",
          veryNearExpiry
            ? "bg-red-100 text-red-800"
            : nearExpiry
              ? "bg-amber-100 text-amber-800"
              : "bg-emerald-100 text-emerald-800",
        ].join(" ")}
      >
        ACTIVE
      </span>

      <h2 className="mt-4 text-2xl font-black text-slate-950">{planName}</h2>

      {subscription.currentPeriod.endsAt && (
        <p className="mt-2 text-sm text-slate-600">
          التجديد القادم:{" "}
          {formatArabicDateShort(subscription.currentPeriod.endsAt)}
        </p>
      )}

      {nearExpiry && (
        <div
          className={[
            "mt-4 flex items-start gap-2 rounded-xl p-3 text-sm",
            veryNearExpiry
              ? "bg-red-100 text-red-900"
              : "bg-amber-100 text-amber-900",
          ].join(" ")}
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <div className="flex-1">
            {veryNearExpiry ? (
              <p className="font-semibold">
                متبقي {daysRemaining}{" "}
                {daysRemaining === 1 ? "يوم" : "أيام"} على انتهاء اشتراكك
              </p>
            ) : (
              <p>اشتراكك سينتهي قريبًا</p>
            )}
          </div>
          {onRenew && (
            <Button
              size="sm"
              onClick={onRenew}
              disabled={renewLoading}
              className="shrink-0"
            >
              {renewLoading ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                "جدّد الآن"
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────

export default function CurrentSubscriptionCard({ subscription, onRenew, renewLoading }: Props) {
  switch (subscription.status) {
    case "trial":
      return <TrialCard subscription={subscription} />;
    case "trial_expired":
      return <TrialExpiredCard />;
    case "expired":
      return <ExpiredCard subscription={subscription} onRenew={onRenew} renewLoading={renewLoading} />;
    case "past_due":
      return <PastDueCard onRenew={onRenew} renewLoading={renewLoading} />;
    case "active":
      return <ActiveCard subscription={subscription} onRenew={onRenew} renewLoading={renewLoading} />;
    default:
      return null;
  }
}
