"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/src/lib/store/hooks";
import { ONBOARDING_KEY } from "@/components/onboarding/OnboardingWizard";
import SubscriptionGuard from "@/components/auth/SubscriptionGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, initialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!initialized) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (typeof window !== "undefined") {
      const done = localStorage.getItem(ONBOARDING_KEY);
      if (!done) {
        router.replace("/onboarding");
      }
    }
  }, [initialized, user, router]);

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="size-5 animate-spin rounded-full border-2 border-border border-t-primary" />
          جارٍ تحميل مَدار...
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <SubscriptionGuard>
        {children}
      </SubscriptionGuard>
    </div>
  );
}
