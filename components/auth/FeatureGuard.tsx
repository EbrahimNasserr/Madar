"use client";

import { useGetSubscriptionQuery } from "@/src/lib/api/subscriptionApi";
import type { Feature } from "@/src/lib/api/subscriptionApi";

type FeatureGuardProps = {
  feature: Feature;
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export default function FeatureGuard({
  feature,
  children,
  fallback = null,
}: FeatureGuardProps) {
  const { data, isLoading } = useGetSubscriptionQuery();

  // Don't flash locked content while the subscription is loading
  if (isLoading) return null;

  const allowed = data?.data.features.includes(feature) ?? false;

  return allowed ? <>{children}</> : <>{fallback}</>;
}
