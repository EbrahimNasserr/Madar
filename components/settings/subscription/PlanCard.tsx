"use client";

import { ArrowLeft, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/src/lib/formatters/money";
import type { PlanId } from "@/src/lib/api/billingApi";
import { featureLabel } from "./utils";

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  plan: { id: PlanId; prices: { monthly: number | null }; features: string[] };
  isCurrent: boolean;
  isInTrial: boolean;
  isExpired?: boolean;
  onChoose: (id: PlanId) => void;
  loading: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PlanCard({
  plan,
  isCurrent,
  isInTrial,
  isExpired,
  onChoose,
  loading,
}: Props) {
  const isPro = plan.id === "pro";
  const price = plan.prices.monthly;

  const ctaLabel = isCurrent
    ? "خطتك الحالية"
    : isExpired
      ? `تجديد ${isPro ? "Pro" : "Basic"}`
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
