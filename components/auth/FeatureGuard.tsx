"use client";

import type { ReactNode } from "react";
import type { Feature } from "@/src/lib/api/subscriptionApi";
import { useFeature } from "@/src/lib/hooks/useFeature";

type Props = {
  feature: Feature;
  children: ReactNode;
  fallback?: ReactNode;
};

export default function FeatureGuard({
  feature,
  children,
  fallback = null,
}: Props) {
  const { hasFeature, isLoading } = useFeature(feature);

  if (isLoading) return null;

  return hasFeature ? children : fallback;
}
