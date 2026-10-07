"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGetSubscriptionQuery } from "@/src/lib/api/subscriptionApi";

// Paths accessible even without an active subscription
const ALLOWED_WITHOUT_SUBSCRIPTION = [
  "/settings",
  "/billing/result",
];

export default function SubscriptionGuard({ children }: { children: ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const { data, isLoading } = useGetSubscriptionQuery();

  const subscription = data?.data.subscription;

  const allowed = ALLOWED_WITHOUT_SUBSCRIPTION.some((path) =>
    pathname.startsWith(path)
  );

  useEffect(() => {
    if (isLoading || !subscription) return;
    if (!subscription.access && !allowed) {
      router.replace("/settings?tab=subscription");
    }
  }, [subscription, isLoading, allowed, router]);

  // Still loading — render nothing to avoid flash
  if (isLoading) return null;

  // Access denied and not on an allowed path — render nothing while redirecting
  if (subscription && !subscription.access && !allowed) return null;

  return <>{children}</>;
}
