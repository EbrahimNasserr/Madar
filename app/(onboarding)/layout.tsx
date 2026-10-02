"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/src/lib/store/hooks";

export default function OnboardingLayout({
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
    }
  }, [initialized, user, router]);

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <div className="size-5 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
          جارٍ التحميل...
        </div>
      </div>
    );
  }

  if (!user) return null;

  return <div className="min-h-screen bg-slate-50">{children}</div>;
}
