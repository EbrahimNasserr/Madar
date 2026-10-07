"use client";

import { useState } from "react";
import { toast } from "sonner";
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
import { formatArabicDateShort } from "@/src/lib/date/formatDate";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import BillingHistory from "../dashboard/subscription/BillingHistory";
import CurrentSubscriptionCard from "./subscription/CurrentSubscriptionCard";
import {
  DowngradeRow,
  ScheduledDowngradeBanner,
  UpgradeBanner,
  ReactivateBanner,
  PlanPicker,
  DangerZone,
} from "./subscription/SubscriptionActions";

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function SubscriptionSkeleton() {
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

// ─── Root export ──────────────────────────────────────────────────────────────

export default function SubscriptionSettings() {
  const { data: subscriptionData, isLoading: subscriptionLoading } =
    useGetSubscriptionQuery();
  const { data: plansData, isLoading: plansLoading } = useGetBillingPlansQuery();

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

  // ── Guards ─────────────────────────────────────────────────────────────────

  if (subscriptionLoading || plansLoading) return <SubscriptionSkeleton />;
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
      <CurrentSubscriptionCard
        subscription={subscription}
        onRenew={() => handleChoosePlan(subscription.plan ?? "basic")}
        renewLoading={checkoutLoading}
      />

      {/* Pro → Basic downgrade */}
      {isActivePro && !hasScheduledDowngrade && !isCancelled && (
        <DowngradeRow
          onDowngrade={() => setDowngradeOpen(true)}
          isDowngrading={isDowngrading}
        />
      )}

      {/* Scheduled downgrade banner */}
      {hasScheduledDowngrade && (
        <ScheduledDowngradeBanner
          endsAt={subscription.currentPeriod.endsAt}
          onCancelChange={handleCancelPlanChange}
          isCancellingChange={isCancellingChange}
        />
      )}

      {/* Basic → Pro upgrade */}
      {isActiveBasic && !isCancelled && (
        <UpgradeBanner
          onUpgrade={() => handleChoosePlan("pro")}
          isLoading={checkoutLoading}
        />
      )}

      {/* Reactivate (after cancel) */}
      {isCancelled && (
        <ReactivateBanner
          onReactivate={handleReactivate}
          isReactivating={isReactivating}
        />
      )}

      {/* Plan picker — trial, trial_expired & expired */}
      {(isInTrial ||
        subscription.status === "trial_expired" ||
        subscription.status === "expired") && (
        <PlanPicker
          subscription={subscription}
          plans={plans}
          onChoosePlan={handleChoosePlan}
          checkoutLoading={checkoutLoading}
        />
      )}

      {/* Billing history */}
      <BillingHistory />

      {/* Danger zone — cancel subscription */}
      {subscription.status === "active" && !isCancelled && (
        <DangerZone onCancel={() => setCancelOpen(true)} />
      )}

      {/* Confirm: downgrade */}
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

      {/* Confirm: cancel subscription */}
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
