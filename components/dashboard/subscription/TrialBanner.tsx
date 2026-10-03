"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useGetSubscriptionQuery } from "@/src/lib/api/subscriptionApi";

export default function TrialBanner() {
  const { data } = useGetSubscriptionQuery();
  const subscription = data?.data?.subscription;

  if (subscription?.status !== "trial") return null;

  const daysRemaining = subscription.trial?.daysRemaining ?? 0;
  const urgent = daysRemaining <= 3;

  const message =
    daysRemaining > 1
      ? `متبقي ${daysRemaining} أيام في تجربتك المجانية.`
      : daysRemaining === 1
        ? "متبقي يوم واحد في تجربتك المجانية."
        : "تنتهي تجربتك المجانية اليوم.";

  return (
    <div
      className={[
        "flex flex-col mx-5 mt-2 gap-4 rounded-2xl border p-2 sm:flex-row sm:items-center sm:justify-between",
        urgent
          ? "border-amber-200 bg-amber-50"
          : "border-indigo-200 bg-indigo-50",
      ].join(" ")}
      dir="rtl"
      role="status"
    >
      <div className="flex items-start gap-3">
        <Sparkles
          className={`mt-0.5 h-5 w-5 shrink-0 ${urgent ? "text-amber-600" : "text-indigo-600"}`}
          aria-hidden
        />
        <div>
          <p
            className={`font-bold ${urgent ? "text-amber-900" : "text-indigo-900"}`}
          >
            تجربة Madar Pro
          </p>
          <p className="mt-0.5 text-sm text-slate-600">{message}</p>
        </div>
      </div>

      <Link
        href="/subscription"
        className={[
          "shrink-0 rounded-xl px-4 py-2 text-sm font-bold transition",
          urgent
            ? "bg-amber-600 text-white hover:bg-amber-700"
            : "bg-indigo-600 text-white hover:bg-indigo-700",
        ].join(" ")}
      >
        اختر باقتك
      </Link>
    </div>
  );
}
