"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Check, RefreshCw } from "lucide-react";
import { useGetSubscriptionQuery } from "@/src/lib/api/subscriptionApi";
import {
  useCreateCheckoutMutation,
  useGetBillingPlansQuery,
  useDowngradeSubscriptionMutation,
  useCancelScheduledPlanChangeMutation,
  useCancelSubscriptionMutation,
  useReactivateSubscriptionMutation,
  type PlanId,
} from "@/src/lib/api/billingApi";
import { getApiErrorMessage } from "@/src/lib/api/error";
import { formatMoney } from "@/src/lib/formatters/money";
import { formatArabicDateShort } from "@/src/lib/date/formatDate";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import BillingHistory from "../dashboard/subscription/BillingHistory";

// ─── Feature label map ────────────────────────────────────────────────────────

function featureLabel(feature: string): string {
  const labels: Record<string, string> = {
    students:           "إدارة الطلاب",
    groups:             "المجموعات",
    sessions:           "الحصص",
    attendance:         "الحضور",
    payments:           "المدفوعات",
    expenses:           "المصروفات",
    dashboard:          "لوحة التحكم",
    reports:            "التقارير",
    quizzes:            "الاختبارات",
    grades:             "الدرجات",
    advanced_analytics: "التحليلات المتقدمة",
  };
  return labels[feature] ?? feature;
}

// ─── Current subscription status card ────────────────────────────────────────

function CurrentSubscriptionCard({
  subscription,
}: {
  subscription: {
    status: string;
    plan: "basic" | "pro" | null;
    trial: { active: boolean; endsAt?: string; daysRemaining?: number };
    currentPeriod: { startsAt: string | null; endsAt: string | null };
    cancelAtPeriodEnd: boolean;
    nextPlan: "basic" | "pro" | null;
  };
}) {
  if (subscription.status === "trial") {
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

        <h2 className="mt-4 text-2xl font-black text-slate-950">
          تجربتك المجانية
        </h2>

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

  if (subscription.status === "trial_expired") {
    return (
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="text-xl font-black text-amber-950">
          انتهت تجربتك المجانية
        </h2>
        <p className="mt-2 text-sm text-amber-800">
          بياناتك محفوظة ولن يتم حذفها. اختر باقة للاستمرار في استخدام مَدار.
        </p>
      </div>
    );
  }

  if (subscription.status === "active") {
    const planName =
      subscription.plan === "pro" ? "Madar Pro" : "Madar Basic";

    // Scheduled downgrade: next cycle will switch to basic
    if (subscription.nextPlan === "basic") {
      return (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
          <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-amber-800">
            SCHEDULED CHANGE
          </span>

          <h2 className="mt-4 text-2xl font-black text-slate-950">
            {planName}
          </h2>

          <p className="mt-2 text-sm text-slate-700">
            سيتم تحويل خطتك إلى{" "}
            <strong>Basic</strong>
            {subscription.currentPeriod.endsAt && (
              <>
                {" "}في{" "}
                <strong>
                  {formatArabicDateShort(subscription.currentPeriod.endsAt)}
                </strong>
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
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
        <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-emerald-800">
          ACTIVE
        </span>

        <h2 className="mt-4 text-2xl font-black text-slate-950">
          {planName}
        </h2>

        {subscription.currentPeriod.endsAt && (
          <p className="mt-2 text-sm text-slate-600">
            التجديد القادم:{" "}
            {formatArabicDateShort(subscription.currentPeriod.endsAt)}
          </p>
        )}
      </div>
    );
  }

  if (subscription.status === "past_due") {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-xl font-black text-red-950">الدفع متأخر</h2>
        <p className="mt-2 text-sm text-red-800">
          يوجد مبلغ مستحق على حسابك. جدّد اشتراكك للاستمرار في استخدام مَدار.
        </p>
      </div>
    );
  }

  return null;
}

// ─── Plan card ────────────────────────────────────────────────────────────────

function PlanCard({
  plan,
  isCurrent,
  isInTrial,
  onChoose,
  loading,
}: {
  plan: { id: PlanId; prices: { monthly: number | null }; features: string[] };
  isCurrent: boolean;
  isInTrial: boolean;
  onChoose: (id: PlanId) => void;
  loading: boolean;
}) {
  const isPro = plan.id === "pro";
  const price = plan.prices.monthly;

  const ctaLabel = isCurrent
    ? "خطتك الحالية"
    : isInTrial
      ? `اشترك في ${isPro ? "Pro" : "Basic"}`
      : "اختيار الباقة";

  return (
    <div
      className={[
        "relative flex flex-col rounded-3xl border bg-white p-6",
        isPro
          ? "border-indigo-300 shadow-lg shadow-indigo-100/50"
          : "border-slate-200",
      ].join(" ")}
    >
      {isPro && (
        <span className="absolute -top-3 right-6 rounded-full bg-gradient-to-l from-[#3157D5] to-[#6D5EF5] px-3 py-0.5 text-[11px] font-black text-white shadow">
          الأكثر قيمة
        </span>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-xl font-black text-slate-950">
            Madar {isPro ? "Pro" : "Basic"}
          </h3>
          {isPro && (
            <span className="mt-1 inline-flex rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-indigo-700">
              PRO
            </span>
          )}
        </div>
        {isCurrent && (
          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
            خطتك الحالية
          </span>
        )}
      </div>

      {/* Price */}
      <div className="mt-5">
        <span className="text-3xl font-black text-slate-950">
          {price !== null ? formatMoney(price) : "—"}
        </span>
        <span className="mr-1.5 text-sm text-slate-500">/ شهر</span>
      </div>

      {/* Features */}
      <ul className="mt-5 flex-1 space-y-2.5">
        {plan.features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
            <span
              className={[
                "flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                isPro
                  ? "bg-indigo-100 text-indigo-600"
                  : "bg-emerald-100 text-emerald-600",
              ].join(" ")}
            >
              <Check className="h-2.5 w-2.5" />
            </span>
            {featureLabel(f)}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Button
        className="mt-7 w-full"
        variant={isPro ? "default" : "secondary"}
        disabled={isCurrent || loading}
        onClick={() => onChoose(plan.id)}
      >
        {loading && !isCurrent ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : (
          <>
            {ctaLabel}
            {!isCurrent && isPro && <ArrowLeft className="h-4 w-4" />}
          </>
        )}
      </Button>
    </div>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────

export default function SubscriptionSettings() {
  const {
    data: subscriptionData,
    isLoading: subscriptionLoading,
  } = useGetSubscriptionQuery();

  const {
    data: plansData,
    isLoading: plansLoading,
  } = useGetBillingPlansQuery();

  const [createCheckout, { isLoading: checkoutLoading }] =
    useCreateCheckoutMutation();

  const [downgradeSubscription, { isLoading: isDowngrading }] =
    useDowngradeSubscriptionMutation();

  const [cancelScheduledPlanChange, { isLoading: isCancellingChange }] =
    useCancelScheduledPlanChangeMutation();

  const [cancelSubscription, { isLoading: isCancelling }] =
    useCancelSubscriptionMutation();

  const [reactivateSubscription, { isLoading: isReactivating }] =
    useReactivateSubscriptionMutation();

  // Dialog state
  const [downgradeOpen, setDowngradeOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  const subscription = subscriptionData?.data.subscription;
  const plans = plansData?.data.plans ?? [];

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleChoosePlan = async (planId: PlanId) => {
    try {
      const response = await createCheckout({
        plan: planId,
        billingCycle: "monthly",
      }).unwrap();
      window.location.href = response.data.checkoutUrl;
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleDowngrade = async () => {
    try {
      await downgradeSubscription().unwrap();
      setDowngradeOpen(false);
      toast.success("سيتم التحويل إلى Basic مع بداية دورة الفوترة القادمة.");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleCancelPlanChange = async () => {
    try {
      await cancelScheduledPlanChange().unwrap();
      toast.success("تم إلغاء التغيير المجدول، ستبقى على Pro.");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleCancelSubscription = async () => {
    try {
      await cancelSubscription().unwrap();
      setCancelOpen(false);
      toast.success("تم إلغاء التجديد التلقائي.");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleReactivate = async () => {
    try {
      await reactivateSubscription().unwrap();
      toast.success("تم إعادة تفعيل الاشتراك.");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  // ── Loading skeleton ───────────────────────────────────────────────────────

  if (subscriptionLoading || plansLoading) {
    return (
      <div className="space-y-4">
        <div className="h-36 animate-pulse rounded-3xl bg-slate-100" />
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="h-80 animate-pulse rounded-3xl bg-slate-100" />
          <div className="h-80 animate-pulse rounded-3xl bg-slate-100" />
        </div>
      </div>
    );
  }

  if (!subscription) return null;

  const isInTrial = subscription.status === "trial";
  const isActivePro =
    subscription.status === "active" && subscription.plan === "pro";
  const isActiveBasic =
    subscription.status === "active" && subscription.plan === "basic";
  const isCancelled =
    subscription.status === "active" && subscription.cancelAtPeriodEnd;
  const hasScheduledDowngrade =
    subscription.status === "active" && subscription.nextPlan === "basic";

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6" dir="rtl">
      {/* Current status card */}
      <CurrentSubscriptionCard subscription={subscription} />

      {/* ── Pro → Basic downgrade action ── */}
      {isActivePro && !hasScheduledDowngrade && !isCancelled && (
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-slate-800">
              التغيير إلى Basic
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              سيُطبَّق التغيير مع بداية دورة الفوترة القادمة.
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => setDowngradeOpen(true)}
            disabled={isDowngrading}
          >
            التغيير إلى Basic
          </Button>
        </div>
      )}

      {/* ── Scheduled downgrade banner ── */}
      {hasScheduledDowngrade && (
        <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
          <p className="text-sm text-slate-700">
            سيتم تحويل خطتك إلى{" "}
            <strong>Basic</strong>
            {subscription.currentPeriod.endsAt && (
              <>
                {" "}في{" "}
                <strong>
                  {formatArabicDateShort(subscription.currentPeriod.endsAt)}
                </strong>
              </>
            )}
          </p>
          <Button
            variant="secondary"
            onClick={handleCancelPlanChange}
            disabled={isCancellingChange}
          >
            {isCancellingChange ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              "البقاء على Pro"
            )}
          </Button>
        </div>
      )}

      {/* ── Basic → Pro upgrade ── */}
      {isActiveBasic && !isCancelled && (
        <div className="flex items-center justify-between rounded-2xl border border-indigo-200 bg-indigo-50 px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-slate-800">
              الترقية إلى Pro
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              احصل على التحليلات المتقدمة وكل ميزات مَدار.
            </p>
          </div>
          <Button
            onClick={() => handleChoosePlan("pro")}
            disabled={checkoutLoading}
          >
            {checkoutLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Upgrade to Pro
                <ArrowLeft className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}

      {/* ── Reactivate banner (after cancel) ── */}
      {isCancelled && (
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
          <p className="text-sm text-slate-700">
            يمكنك إعادة تفعيل الاشتراك في أي وقت قبل انتهاء الفترة الحالية.
          </p>
          <Button onClick={handleReactivate} disabled={isReactivating}>
            {isReactivating ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              "إعادة تفعيل الاشتراك"
            )}
          </Button>
        </div>
      )}

      {/* Plan picker — trial & trial_expired only */}
      {(isInTrial || subscription.status === "trial_expired") && (
        <section>
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-950">اختر باقتك</h2>
            <p className="mt-1 text-sm text-slate-500">
              {isInTrial
                ? "اختر الباقة المناسبة علشان تكمل استخدام مَدار بعد انتهاء التجربة."
                : "اختر باقة للاستمرار في استخدام مَدار."}
            </p>
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
                  onChoose={handleChoosePlan}
                  loading={checkoutLoading}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Billing history */}
      <BillingHistory />

      {/* ── Danger zone — cancel subscription (active paid only, not trial) ── */}
      {subscription.status === "active" && !isCancelled && (
        <section className="rounded-2xl border border-red-200 bg-white p-6">
          <h2 className="font-bold text-slate-950">إلغاء الاشتراك</h2>

          <p className="mt-2 text-sm text-slate-500">
            سيظل بإمكانك استخدام مَدار حتى نهاية فترة الاشتراك الحالية.
          </p>

          <Button
            variant="destructive"
            className="mt-5"
            onClick={() => setCancelOpen(true)}
          >
            إلغاء الاشتراك
          </Button>
        </section>
      )}

      {/* ── Confirm: downgrade ── */}
      <ConfirmDialog
        open={downgradeOpen}
        title="التغيير إلى Basic"
        description="سيتم تطبيق التغيير مع بداية دورة الفوترة القادمة. ستفقد الوصول إلى ميزات Pro بعد انتهاء الفترة الحالية."
        confirmLabel="تأكيد التغيير"
        cancelLabel="الرجوع"
        loading={isDowngrading}
        onConfirm={handleDowngrade}
        onCancel={() => setDowngradeOpen(false)}
      />

      {/* ── Confirm: cancel subscription ── */}
      <ConfirmDialog
        open={cancelOpen}
        title="هل تريد إلغاء اشتراكك؟"
        description={
          subscription.currentPeriod.endsAt
            ? `سيظل حسابك فعالًا حتى ${formatArabicDateShort(subscription.currentPeriod.endsAt)}، وبعدها ستحتاج لاختيار باقة جديدة للاستمرار.`
            : "سيظل حسابك فعالًا حتى نهاية فترة الاشتراك الحالية، وبعدها ستحتاج لاختيار باقة جديدة للاستمرار."
        }
        confirmLabel="تأكيد الإلغاء"
        cancelLabel="الرجوع"
        loading={isCancelling}
        destructive
        onConfirm={handleCancelSubscription}
        onCancel={() => setCancelOpen(false)}
      />
    </div>
  );
}
