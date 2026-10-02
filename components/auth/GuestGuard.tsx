"use client";

import type { ReactNode } from "react";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { useAppSelector } from "@/src/lib/store/hooks";

type Props = {
  children: ReactNode;
};

export default function GuestGuard({ children }: Props) {
  const router = useRouter();

  const { user, initialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (initialized && user) {
      router.replace("/dashboard");
    }
  }, [initialized, user, router]);

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
      </div>
    );
  }

  if (user) {
    return null;
  }

  return children;
}
