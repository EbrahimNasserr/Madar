"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { makeStore, AppStore } from "@/src/lib/store/store";
import AuthInitializer from "@/components/auth/AuthInitializer";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <Provider store={storeRef.current}>
      <AuthInitializer>{children}</AuthInitializer>
      <Toaster richColors position="top-center" />
    </Provider>
  );
}
