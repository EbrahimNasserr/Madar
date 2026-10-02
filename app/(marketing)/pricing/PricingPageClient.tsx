"use client";

import { useGetSubscriptionQuery } from "@/src/lib/api/subscriptionApi";
import MadarMarketing from "@/components/teacher-os-marketing";

export default function PricingPageClient() {
  const { data } = useGetSubscriptionQuery();
  const plan = data?.data.subscription.plan ?? null;

  return <MadarMarketing pricing plan={plan} />;
}
